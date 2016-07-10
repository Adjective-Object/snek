from flask import Flask, send_from_directory, url_for
from config import config
from api.routes import blueprint as api_blueprint
from website.routes import blueprint as site_blueprint
import json, urllib

# init application
app = Flask(__name__, 
        static_url_path='/static',
        static_folder='website/public'
        )

# register api blueprints
app.register_blueprint(api_blueprint, url_prefix='/api')
app.register_blueprint(site_blueprint)

@app.route('/cache/<path:path>', methods=['GET'])
def send_from_cache(path):
    return send_from_directory(config.paths.cache, path)

@app.route("/site-map")
def list_routes():
    output = []
    for rule in app.url_map.iter_rules():

        options = {}
        for arg in rule.arguments:
            options[arg] = "[{0}]".format(arg)

        methods = ','.join(rule.methods)
        url = url_for(rule.endpoint, **options)
        line = urllib.unquote("{:50s} {:20s} {}".format(
                rule.endpoint, methods, url))
        output.append(line)

    return json.dumps(sorted(output), indent=2)

# run the app
if __name__ == "__main__":
    app.run(**config.app_config)

