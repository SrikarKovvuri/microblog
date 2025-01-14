from models import db, Role
from app import app

with app.app_context():
    user_role = Role(name="user")
    db.session.add(user_role)
    db.session.commit()
    print("User role added successfully.")
