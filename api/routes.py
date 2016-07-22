from flask import Flask, request, jsonify, Blueprint
from voluptuous import *
import time
import json

from build import Build
from log import log, status
from util import *

from config import config

blueprint = Blueprint('api', __name__)

##########
# Routes #
##########

def api_route(*args, **vargs):
    def real_decorator(func):
        r = wraps(func)(blueprint.route(*args, **vargs)(json_conv(func)))
        r._original = func
        return r

    return real_decorator

# get list of repos
@api_route('/about', methods=['GET'])
def get_about():
    return {
        "name": config.server.name,
        "server-status": get_server_status._original()
    }

# get list of repos
@api_route('/server-status', methods=['GET'])
def get_server_status():
    return {
        "dependencies": "satisfied" # TODO
    }

# get list of repos
@api_route('/repos', methods=['GET'])
def get_repos():
    return config.repos

# get details on a given repo
@api_route('/repos/<repo_id>', methods=['GET'])
def get_repo(repo_id):

    if repo_id not in config.repos.keys():
        return errjson("repo %s does not exist" % repo_id)

    if not status.exists(repo_id):
        status.init(repo_id)

    return status.content(repo_id)

# get list of builds
@api_route('/builds', methods=['GET'])
@validate_params(Schema({
    Optional('page'): Coerce(int),
    Optional('filter'): Coerce(str)
    }))
def get_builds():
    #TODO: paginate
    #TODO: allow filter by active
    return log.list()

#request a build
@api_route('/builds', methods=['POST'])
@validate_params(Schema({
    Required('repo_id'): Coerce(str)
    }))
def post_builds():
    """ Build creation route
        Checks that the build is allowed on the whitelist and is not currently
        already being performed. Then, it starts the build & returns a 'handle'
        which can be used to query build status.
    """
    repo_id = request.values['repo_id']
    if not repo_id:
        return errjson('%s not on whitelist' % repo_id)
    elif Build.is_ongoing(repo_id):
        return errjson('build for %s already underway' % repo_id)
    else:
        build = Build(repo_id)
        build.build()

    return {
            'status': 'success',
            'build_id': build.handle
        }

@api_route('/builds/<build_id>', methods=['GET'])
def get_build_status(build_id):
    """ Fetches overview of a task (list of packages), some meta
    """
    build = Build.from_log(build_id)
    if not build:
        return errjson('build not found'), 404
    else:
        pkgs = build.get_package_statuses()

        return {
            "build_id": build.handle,
            "time": build.build_time,
            "logs": {
                # "fetch": build.build_logs["fetch"]
            },
            "packages": pkgs
        }

@api_route('/builds/<build_id>/<package_name>', methods=['GET'])
def get_package_status_in_build(build_id, package_name):
    build = log.get_build(build_id)
    if not build:
        return errjson('build not found'), 404

    elif not build.get_package(package_name):
        return errjson(
                'package %s not found in build %s' % (package_name, build_id),
                404
                )

    else:
        pkg_logs = build.get_package_logs(package_name)
        return pkg_logs


@api_route('/hooks/github', methods=['POST'])
def github_build_hook():
    if request.is_json:
        return _build(request.json['repository']['git_url'])
    else:
        return errjson('route requires json'), 400

