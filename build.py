from log import log_add, log_append
import subprocess, threading
import os

from config import (
    REPO_ROOT, CACHE_ROOT,
    STORE_ROOT, NIXPKGS_PATH,
    REPO_WHITELIST
    )

ongoing_builds = set()

def is_build_ongoing(repo):
    return repo in ongoing_builds

# perform some process while saving things to the log
def log_proc(cmd, handle, step, **kwargs):
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
        log_append(handle, step, out);
        log_append(handle, step, err);

    out, err = proc.communicate()
    log_append(handle, step, out);
    log_append(handle, step, err);

    return proc.returncode;

# perform a build and log to fs
def build_proc(key, handle):
    ongoing_builds.add(key);

    repo = REPO_WHITELIST[key];

    # make folders for repo and cache
    repo_path  = os.path.join(REPO_ROOT,  key)
    cache_path = os.path.join(CACHE_ROOT, key)
    store_path = STORE_ROOT # shared store

    log_add(handle);

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
            handle,
            'fetch'
        )

    # otherwise pull to update it (TODO: allow specific version request)
    else:
        exitcode = log_proc(
            ['git', 'pull'],
            handle,
            'fetch',
            cwd=repo_path
        )
    if exitcode:
        ongoing_builds.remove(key)
        return

    exitcode = log_proc(
        'NIX_STORE_DIR=%s ' % (store_path) +
        'NIX_PATH=nixpkgs=%s:$NIX_PATH ' % (NIXPKGS_PATH) +
        'nix-build %s/default.nix' % (repo_path),
        handle,
        'build',
        shell=True
    )
    if exitcode:
        ongoing_builds.remove(key)
        return

    exitcode = log_proc(
        ['./build-cache.sh', repo_path, cache_path, store_path],
        handle,
        'cache'
    )
    if exitcode:
        ongoing_builds.remove(key)
        return


    # remove this job from the ongoing jobs
    ongoing_builds.remove(key)

def build_start(repo, handle):
    t = threading.Thread(
            target=build_proc,
            args=(repo, handle)
        )
    t.start()

    return {
        'repo': repo,
        'handle': handle,
        'steps': ['fetch', 'build', 'cache']
    }

