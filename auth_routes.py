from flask import Blueprint, request, jsonify, current_app
from models import db, User, Role, Comment, Post, Profile
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
from werkzeug.security import check_password_hash, generate_password_hash

auth_blueprint = Blueprint('app', __name__)


def encode_token(user_id, role):
    payload = {
        'user_id':user_id,
        'position': role,
        'iat': datetime.datetime.utcnow(),  # Issued At: The current timestamp when the token is generated
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) # Expiration Time: Set the token to expire in 1 hour
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm = 'HS256'  )
    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'] , algorithms = "HS256")
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired. Please log in again."}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token. Please log in again."}

@auth_blueprint.route("/signup", methods = ["POST"])
def signup():
    data = request.json

    username = data.get('username')
    password = data.get('password')
    role_name = data.get('role', 'user')
    bio = data.get('bio', "")
    location = data.get('location', "")
    
    if not username or not password or not role_name: 
        return jsonify({"error": "All Fields are required"}), 400
    
    if User.query.filter_by(username = username).first():
        return jsonify({"error": "Username already exists"}), 400
    
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"error": f"Role '{role_name}' not found"}), 400
   
    hashed_password = generate_password_hash(password)
    new_user = User(username= username, password_hash = hashed_password, role = role)
    db.session.add(new_user)
    db.session.commit()

    new_profile = Profile(bio=bio, location=location, user_id=new_user.id)
    db.session.add(new_profile)
    db.session.commit()

    return jsonify({"message": "User registered sucessfully"}), 201

@auth_blueprint.route("/login", methods = ['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username = username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "You do not have a signed in account"}, 400)
   
    token  = encode_token(user.id, user.role.name)
    return jsonify({"message": "User logged in sucessfully",
                    "token": token}), 201
    

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                return jsonify({"error": "Token is missing!"}), 401
            
            if auth_header.startswith("Bearer "):
                auth_header = auth_header[len("Bearer "):]
            
            payload = decode_token(auth_header)
            if not payload or "error" in payload:
                return jsonify({"error": "Token is invalid!"}), 401
            
            # Pass the payload to the decorated function as a kwarg
            return f(payload, *args, **kwargs)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return decorated_function

