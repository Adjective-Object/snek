from flask import Flask
from config import config
from api.routes import apply_routes as apply_api_routes

app = Flask(__name__)
apply_api_routes(app)

app.run(**config.app_config)

