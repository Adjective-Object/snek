from flask import Flask, request, jsonify
from voluptuous import *
import time

from build import is_build_ongoing, build_start
from log import log_list, log_exists, log_content
from util import *

app = Flask(__name__)

##########
# Routes #
##########

def _build(git_repo_url):
    # check if the build is on the whitelist
    repo = get_repo_by_url(git_repo_url)

    if not repo:
        return errjson(
                "repo %s not on whitelist" % (git_repo_url)
                ), 401
   
    build_handle = "%s-%s" % (repo, int(time.time()))

    # check if the build is already happening
    if is_build_ongoing(repo):
        return errjson("build for %s already underway" % (repo))

    # fork and request the build
    return jsonify(build_start(repo, build_handle))

@app.route('/builds', methods=['POST'])
@validate_params(Schema({
    Required('git_repo'): Coerce(str)
    }))
def build():
    """ Build creation route
        Checks that the build is allowed on the whitelist and is not currently
        already being performed. Then, it starts the build & returns a 'handle'
        which can be used to query build status.
    """
    return _build(request.values['git_repo'])

@app.route('/builds', methods=['GET'])
@validate_params(Schema({
    Optional('page'): Coerce(int)
    }))
def list_logs():
    """ Lists builds in reverse chronological order, paginated.
    """
    return jsonify(log_list())


@app.route('/builds/<build_id>', methods=['GET'])
def fetch_log(build_id):
    """ Fetches the log of a build 
    """
    if not log_exists(build_id):
        return errjson('build not found'), 404
    else:
        return jsonify(log_content(build_id))

@app.route('/hooks/github', methods=['POST'])
def github_build_hook():
    if request.is_json:
        return _build(request.json['repository']['git_url'])
    else:
        return errjson('route requires json'), 400


