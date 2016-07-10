from flask import Blueprint, send_from_directory
import os.path
blueprint = Blueprint('site', __name__)

public_dir = os.path.join(
        os.path.dirname(__file__),
        'public'
        )

@blueprint.route('/', methods=['GET'], defaults={'approute': ''})
@blueprint.route('/<approute>', methods=['GET'])
def get_index(approute=None):
    print approute
    return send_from_directory(public_dir, 'index.html')


