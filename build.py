from log import log_add, log_append
import subprocess, threading
import os
from config import config

ongoing_builds = set()

def is_build_ongoing(repo):
    return repo in ongoing_builds

# perform some process while saving things to the log
def log_proc(cmd, handle, *attr_path, **kwargs):
    kwargs['stdout'] = subprocess.PIPE
    kwargs['stderr'] = subprocess.PIPE
    print cmd, kwargs
    # build the cache from the store
    proc = subprocess.Popen(
            cmd,
            **kwargs
            )
   
    while proc.poll() is None:
        out = proc.stdout.readline()
        err = proc.stderr.readline()
        log_append(handle, attr_path, out);
        log_append(handle, attr_path, err);

    out, err = proc.communicate()
    log_append(handle, attr_path, out);
    log_append(handle, attr_path, err);

    return proc.returncode;

# perform a build and log to fs
def build_proc(repo_name, build_handle):
    repo = config.repos[repo_name]

    ongoing_builds.add(repo_name);
    repo = config.repos[repo_name]

    # make folders for repo and cache
    repo_path  = os.path.join(config.paths.repos, repo_name)
    cache_path = os.path.join(config.paths.repos, repo_name)
    store_path = config.paths.store # shared store

    log_add(build_handle);

    def mkdir_p(path):
        if not os.path.exists(path):
            os.makedirs(path)
    mkdir_p(repo_path)
    mkdir_p(cache_path)
    mkdir_p(store_path)

    # clone the git repo if it doesn't exist,
    if not os.path.exists(os.path.join(repo_path, '.git')):
        exitcode = log_proc(
            ['git', 'clone', repo['url'], repo_path],
            build_handle,
            'fetch'
        )

    # otherwise pull to update it (TODO: allow specific version request)
    else:
        exitcode = log_proc(
            ['git', 'pull'],
            build_handle,
            'fetch',
            cwd=repo_path
        )
    if exitcode:
        ongoing_builds.remove(repo_name)
        return

    exitcode = log_proc(
        'NIX_STORE_DIR=%s ' % (store_path) +
        'NIX_PATH=nixpkgs=%s:$NIX_PATH ' % (repo.nixpkgs) +
        'nix-build %s/default.nix' % (repo_path),
        build_handle,
        'build',
        shell=True
    )
    if exitcode:
        ongoing_builds.remove(repo_name)
        return

    exitcode = log_proc(
        ['./build-cache.sh', repo_path, cache_path, store_path],
        build_handle,
        'cache'
    )
    if exitcode:
        ongoing_builds.remove(repo_name)
        return


    # remove this job from the ongoing jobs
    ongoing_builds.remove(repo_name)

def build_start(repo, build_handle):
    t = threading.Thread(
            target=build_proc,
            args=(repo, build_handle)
        )
    t.start()

    return {
        'repo': repo,
        'handle': build_handle,
        'steps': ['fetch', 'build', 'cache']
    }

