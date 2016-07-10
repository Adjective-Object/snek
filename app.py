from flask import Flask, send_from_directory
from config import config
from api.routes import blueprint as api_blueprint

# init application
app = Flask(__name__)

# register api blueprints
app.register_blueprint(api_blueprint, url_prefix='/api') # api

# Routes for serving static files
@app.route('/', methods=['GET'])
def send_static_site():
    return send_from_directory('site', 'index.html')

@app.route('/cache/<path:path>', methods=['GET'])
def send_from_cache(path):
    return send_from_directory(config.paths.cache, path)

# run the app
app.run(**config.app_config)

