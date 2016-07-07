import os, json
from config import config

# Basic log interface functions
# =============================

build_log = {}

def log_path(handle):
    return os.path.join(config.logs, handle)

def log_exists(handle):
    return (handle in build_log.keys() or 
            os.path.isfile(os.path.join(config.logs, handle))
            )

def log_dump(handle):
    json.dump(build_log[handle], open(log_path(handle), 'w'))

def log_fetch(handle):
    if handle not in build_log.keys():
        logPath = log_path(handle)
        if not os.path.isfile(logPath):
            build_log[handle] = {}
            return;

        build_log[handle] = json.load(open(logPath, 'r'))

def log_content(handle):
    log_fetch(handle)
    return build_log[handle]

def log_add(handle):
    build_log[handle] = {}
    log_dump(handle)

def log_append(handle, section, blob):
    if section not in build_log[handle].keys():
        build_log[handle][section] = ''

    build_log[handle][section] += blob
    log_dump(handle)

def log_set_status(handle, status, msg=None):
    build_log[handle]['status'] = {
            'state': status,
            'msg': msg 
            }

    log_dump(handle)

def log_list():
    return build_log.keys()

