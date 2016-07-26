import os, json
import shelve
from config import config
import atexit

# Basic log interface functions
# =============================

db_instance = shelve.open('shelve.db')
atexit.register(db_instance.close)

def _update(a, b):
    a.update(b)
    return a

class FsStore(object):

    def __init__(self, attr):
        self.db = db_instance
        self.attr = attr

        if attr not in self.db.keys() or not self.db[attr]:
            self.db[attr] = {}
            self.db.sync()

        print self.db


    # check if handle exists already
    def exists(self, handle):
        return handle in self.db[self.attr].keys()

    # get the content of a handle
    def content(self, handle):
        return self.db[self.attr][handle]

    # list the things
    def list(self):
        return self.db.keys()

    def update(self, path, value, 
            default=None,
            fold=_update):
        db_entry = self.db[self.attr]
        
        # create objects
        cur = db_entry
        for x in path[:-1]:
            if x not in cur.keys():
                cur[x] = {}
            cur = cur[x]

        # default value for deepest value
        if path[-1] not in cur.keys():
            cur[path[-1]] = {} if default is None else default
        cur[path[-1]] = fold(cur[path[-1]], value)

        self.db[self.attr] = db_entry
        self.db.sync()

class FsBuildLog(FsStore):

    def __init__(self):
        super(FsBuildLog, self).__init__('logs')

    # initialize a log entry
    def init(self, handle):
        print('init log' , handle)
        self.update([handle], {})
        print(self.db)
        self.db.sync()

    # append text to a section of the log entry
    def append(self, handle, attr_path, blob):
        self.update([handle] + list(attr_path), blob,
                default='',
                fold=lambda a, b: a + b
                )

        self.db.sync()

class FsRepoStatus(FsStore):

    def __init__(self):
        super(FsRepoStatus, self).__init__('repos')

    # initialize 
    def init(self, repo):
        self.update(
            [repo], {
                "log_entries": {},
                "latest_build": None
            })

        self.db.sync()

    def add_build(self, repo, build_id, build_time):
        self.update([repo, "log_entries", build_id], {
            "time": build_time,
            "build_status": "in-progress",
            "package_status": {}
        })
        self.update([repo, "latest_build"], build_id, fold=lambda a, b: b)
        self.db.sync()

    def set_build_git_info(self, repo, build_id, revision, msg):
        self.update([repo, "log_entries", build_id, 'git'], {
            'revision': revision,
            'msg': msg
        })
        self.db.sync()

    def add_packages(self, repo, build, packages):
        blank_statuses = {}
        for package in packages:
            blank_statuses[package] = {
                "status": "unstarted"
            }

        self.update(
            [repo, "log_entries", build, "package_status"],
            blank_statuses
        )
        self.db.sync()

    def update_package_status(self, repo, build, package, status):
        self.update(
            [repo, "log_entries", build, "package_status", package],
            { "status": status }
        )
        self.db.sync()

    def finish(self, repo, build):
        self.update([repo], {
            "build_status": "finished"
        })
        self.db.sync()

log     = FsBuildLog()
status  = FsRepoStatus()
