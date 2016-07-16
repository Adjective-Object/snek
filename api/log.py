import os, json
from config import config

# Basic log interface functions
# =============================

class FsStore(object):

    def __init__(self, path):
        self.build_log = {}
        self.path = path

    # check if handle exists already
    def exists(self, handle):
        return (handle in self.build_log.keys() or 
                os.path.isfile(self.path(handle))
                )

    # dump to filesystem
    def dump(self, handle):
        json.dump(self.build_log[handle], open(self.path(handle), 'w'))

    # get handle from filesystem
    def fetch(self, handle):
        if handle not in self.build_log.keys():
            logPath = self.path(handle)
            if not os.path.isfile(logPath):
                self.build_log[handle] = {}
                return;

            self.build_log[handle] = json.load(open(logPath, 'r'))

    # get the content of a handle
    def content(self, handle):
        self.fetch(handle)
        return self.build_log[handle]

    # list the things
    def list():
        return self.build_log.keys()

class FsBuildLog(FsStore):

    # initialize a log entry
    def init(self, handle):
        self.build_log[handle] = {}
        self.dump(handle)

    # append text to a section of the log entry
    def append(self, handle, attr_path, blob):
        current = self.build_log[handle]
        for a in attr_path[:-1]:
            if a not in current.keys():
                current[a] = {}
            current = current[a]

        if attr_path[-1] not in current:
            current[attr_path[-1]] = ''

        current[attr_path[-1]] += blob
        self.dump(handle)

class FsRepoStatus(FsStore):

    # initialize 
    def init(self, repo):
        self.build_log[repo] = {
            "log_entries": {},
            "latest_build": None
        }
        self.dump(repo)

    def add_build(self, repo, build_id, build_time):
        self.build_log[repo]["log_entries"][build_id] = {
            "time": build_time,
            "build_status": "in-progress",
            "package_status": {}
        }
        self.build_log[repo]["latest_build"] = build_id
        self.dump(repo)

    def set_build_git_info(self, repo, build_id, revision, msg):
        self.build_log[repo]["log_entries"][build_id]['git'] = {
            'revision': revision,
            'msg': msg
        }
        self.dump(repo)

    def add_packages(self, repo, build, packages):
        blank_statuses = {}
        for package in packages:
            blank_statuses[package] = {
                "status": "unstarted"
            }

        self.build_log[repo]["log_entries"
            ][build]["package_status"] = blank_statuses
        self.dump(repo)

    def update_package_status(self, repo, build, package, status):
        self.build_log[repo]["log_entries"
            ][build]["package_status"][package] = {
            "status": status
        }
        self.dump(repo)

    def finish(self, repo, build):
        self.build_log[repo]["build_status"] = "finished";


log     = FsBuildLog(lambda handle: os.path.join(config.paths.logs, handle + '.json'))
status  = FsRepoStatus(lambda handle: os.path.join(config.paths.status, handle + '.json'))
