from functools import wraps
from voluptuous import *
from flask import request, jsonify
from config import REPO_WHITELIST

###########
# Helpers #
###########
def errjson(msg):
    return jsonify({'error': msg})

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

def get_whitelist_key(repo_url):
    for k, v in REPO_WHITELIST.iteritems():
        if v['url'] == repo_url:
            return k
    return None


