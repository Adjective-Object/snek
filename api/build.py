from log import log, status
import subprocess, threading, os, time, re
from config import config
from util import mkdir_p
import base64
from hashlib import md5

ongoing_builds = set()

def append_builds(handle, *attr_path):
    def write_log(out, err, done):
        log.append(handle, attr_path, out)
        log.append(handle, attr_path, err)
    return write_log

def aggregate_with_callback(callback):
    def aggregate(out, err, done):
        aggregate.output += out
        aggregate.error += err
        if (done):
            callback(aggregate.output, aggregate.error)

    aggregate.output = ''
    aggregate.error = ''

    return aggregate

# Helper: perform some process while saving things to the log
def proc(cmd, handle, logging_callback, **kwargs):
    kwargs['stdout'] = subprocess.PIPE
    kwargs['stderr'] = subprocess.PIPE

    # build the cache from the store
    proc = subprocess.Popen(
            cmd,
            **kwargs
            )
  
    # TODO deinterleave this maybe
    while proc.poll() is None:
        out = proc.stdout.readline()
        err = proc.stderr.readline()

        logging_callback(out, err, False)

    out, err = proc.communicate()
    logging_callback(out, err, True)

    return proc.returncode;


class Build(object):
    def __init__(self, repo_id):
        self.repo_id = repo_id
        self.repo = config.repos[repo_id]

    ##################
    # static methods #
    ##################

    @staticmethod
    def is_ongoing(handle):
        return handle in ongoing_builds

    @staticmethod
    def from_log(build_id):
        build_log = log.content(build_id)
        if not build_log:
            return None

        b = Build(build_log["repo_id"])
        b.handle = build_id
        b.packages = build_log["packages"].keys()
        b.build_time = build_log["time"]

        return b

    ###################
    # THE BUILD STEPS #
    ###################

    def prep_folders(self):
        # make folders for repo and cache
        self.repo_path  = os.path.abspath(
                os.path.join(config.paths.repos, self.repo_id))
        self.cache_path = os.path.abspath(
                os.path.join(config.paths.cache, self.repo_id))
        self.store_path = os.path.abspath(config.paths.store) # shared store
       
        mkdir_p(self.repo_path)
        mkdir_p(self.cache_path)
        mkdir_p(self.store_path)

    def build_step_fetch_source(self):
        # clone the git repo if it doesn't exist,
        if not os.path.exists(os.path.join(self.repo_path, '.git')):
            return proc(
                ['git', 'clone', self.repo['url'], self.repo_path],
                self.handle,
                append_builds(self.handle, 'fetch')
            )
        # otherwise pull to update it (TODO: allow specific version request)
        else:
            return proc(
                ['git', 'pull'],
                self.handle,
                append_builds(self.handle, 'fetch'),
                cwd=self.repo_path
            )

    def build_step_check_revision(self):
        def assign_repo(out, err):
            self.build_hash, self.commit_msg = out.split(' ', 1)
            status.set_build_git_info(
                self.repo_id,
                self.handle,
                self.build_hash,
                self.commit_msg)

        return proc(
            ['git', 'log', '--pretty=oneline', 'HEAD~1..HEAD',],
            self.handle,
            aggregate_with_callback(assign_repo),
            cwd=self.repo_path
        )
 
    def build_step_list_packages(self):
        repo_nix_entry = os.path.join(self.repo_path, 'default.nix')
        exitcode = proc(
                ['nix-env', '-qaP', '-f', repo_nix_entry],
                self.handle,
                append_builds(self.handle, 'list_packages'),
                cwd=self.repo_path)

        if exitcode:
            return exitcode

        # split on repeated spaces, remove empty strings, take every other
        package_str = log.content(self.handle)['list_packages']
        self.packages = filter(lambda x: x!= '', re.split('\\s+', package_str))[::2]


    def build_step_build_package(self, pkg):
        # reusable env override
        nix_env_override = (
            'NIX_STORE_DIR=%s ' % (self.store_path) +
            'NIX_PATH=nixpkgs=%s:$NIX_PATH ' % (self.repo.nixpkgs)
        )

        # build it
        exitcode = proc(
            nix_env_override +
            'nix-build --no-out-link %s/default.nix' % (self.repo_path),
            self.handle,
            append_builds(self.handle, 'packages', pkg, 'build'),
            shell=True
        )
        if exitcode:
            return exitcode
       
        # fetch from something
        exitcode = proc(
            nix_env_override +
            './nix-lookup %s/default.nix %s' % (self.repo_path, pkg),
            self.handle,
            append_builds(self.handle, 'packages', pkg, 'lookup'),
            shell=True
        )
        if exitcode:
            return exitcode

        # lookup from cache (todo not pls)
        pkg_path = log.content(self.handle)['packages'][pkg]['lookup'].strip()

        # ??
        return proc(
            ['nix-push', pkg_path, '--dest', self.cache_path],
            self.handle,
            append_builds(self.handle, 'packages', pkg, 'cache')
        )

    def build(self):
        self.build_time = int(time.time())


        self.handle = base64.urlsafe_b64encode(
                md5("%s%s" % (self.repo_id, self.build_time)).digest())[0:8]
        while status.exists(self.handle):
            self.handle = base64.urlsafe_b64encode(
                    md5("%s%s" % (self.repo_id, self.build_time)).digest())[0:8]

        # add an entry for this specific build to the log
        log.init(self.handle);
        if (not status.exists(self.repo_id)):
            status.init(self.repo_id)

        log.append(self.handle, ["repo_id"], self.repo_id)
        log.append(self.handle, ["time"], str(self.build_time))

        threading.Thread(target=self._build).start()

    def _build(self):
        ongoing_builds.add(self.handle)

        status.add_build(self.repo_id, self.handle, self.build_time)

        # prep the folders        
        self.prep_folders()

        # clone & exit on failure
        if self.build_step_fetch_source():
            ongoing_builds.remove(self.handle)
            return

        # check revision
        if self.build_step_check_revision():
            ongoing_builds.remove(self.handle)
            return

        # list processes & exit on failure
        if self.build_step_list_packages():
            ongoing_builds.remove(self.handle)
            return

        status.add_packages(self.repo_id, self.handle, self.packages)

        # build each of the packages
        for pkg_path in self.packages:
            status.update_package_status(
                self.repo_id,
                self.handle,
                pkg_path,
                'ongoing'
                )
            if (self.build_step_build_package(pkg_path)):
                status.update_package_status(
                    self.repo_id,
                    self.handle,
                    pkg_path,
                    'failure')
            else:
                status.update_package_status(
                    self.repo_id,
                    self.handle,
                    pkg_path,
                    'success')

        # remove this job from the ongoing jobs
        ongoing_builds.remove(self.handle)
    
    #######################
    # POST-BUILD QUERYING #
    #######################

    def get_package_statuses(self):
        return log.content(self.handle)["packages"]
