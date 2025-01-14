from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db
from auth_routes import auth_blueprint as routes_blueprint
from operations import operations as operations_blueprint
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)

# Register Blueprints
app.register_blueprint(routes_blueprint)
app.register_blueprint(operations_blueprint)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)