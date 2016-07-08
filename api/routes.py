from flask import Flask, request, jsonify
from voluptuous import *
import time
import json

from build import Build
from log import log_list, log_exists, log_content
from util import *

from config import config

def apply_routes(app):

    ##########
    # Routes #
    ##########

    # get list of repos
    @app.route('/repos', methods=['GET'])
    def get_repos():
        return json.dumps(config.repos)


    # get list of builds
    @app.route('/builds', methods=['GET'])
    @validate_params(Schema({
        Optional('page'): Coerce(int),
        Optional('filter'): Coerce(str)
        }))
    def get_builds():
        #TODO: paginate
        #TODO: allow filter by active
        return jsonify(log_list())

    #request a build
    @app.route('/builds', methods=['POST'])
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
            return errjson('build not on whitelist')
        elif Build.is_ongoing(repo_id):
            return errjson('build for %s already underway' % repo_id)
        else:
            build = Build(repo_id)
            build.build()

        return json.dumps({
                'status': 'success',
                'build_id': build.handle
            })

    @app.route('/builds/<build_id>', methods=['GET'])
    def get_build_status(build_id):
        """ Fetches overview of a task (list of packages), some meta
        """
        build = Build.from_log(build_id)
        if not build:
            return errjson('build not found'), 404
        else:
            pkgs = build.get_package_statuses()

            return json.dumps({
                build_id: build.build_id,
                time: build.build_time,
                logs: {
                    "fetch": build.build_logs["fetch"]
                },
                packages: pkgs
            })

    @app.route('/builds/<build_id>/<package_name>', methods=['GET'])
    def get_package_status_in_build(build_id, package_name):
        build = log_get_build(build_id)
        if not build:
            return errjson('build not found'), 404

        elif not build.get_package(package_name):
            return errjson(
                    'package %s not found in build %s' % (package_name, build_id),
                    404
                    )

        else:
            pkg_logs = build.get_package_logs(package_name)
            return json.dumps(pkg_logs)


    @app.route('/hooks/github', methods=['POST'])
    def github_build_hook():
        if request.is_json:
            return _build(request.json['repository']['git_url'])
        else:
            return errjson('route requires json'), 400
