from functools import wraps
from voluptuous import *
from flask import request, jsonify
from config import config
import json

###########
# Helpers #
###########
def errjson(msg):
    return {'error': msg}, 400

def validate_params(schema):
    def decorator(callback):
        @wraps(callback)
        def wrapper(*args, **kwargs):
            try:
                schema(request.values)
                return callback(*args, **kwargs)

            except MultipleInvalid as e:
                return errjson("invalid parameters"), 401
        return wrapper
    return decorator

def get_repo_by_url(repo_url):
    for k, v in config.repos.iteritems():
        if v['url'] == repo_url:
            return k
    return None

def mkdir_p(path):
    if not os.path.exists(path):
        os.makedirs(path)

def json_conv(callback):
    @wraps(callback)
    def wrapped_callback(*args, **argv):
        d = callback(*args, **argv)
        
        if type(d) is tuple:
            return json.dumps(d[0]), d[1]

        return json.dumps(d)

    return wrapped_callback
