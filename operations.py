from flask import Blueprint, request, jsonify
from auth_routes import token_required
from models import db, Post, Comment, Profile, User

operations = Blueprint("operations", __name__)  # Use a clear blueprint name

# Helper function to check if the user is an admin
def check_admin(payload):
    return payload.get('position') == "admin"

# Create a new post
@operations.route("/posts", methods=['POST'])
@token_required
def create_post(payload):
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({"error": "Post content is required"}), 400

    new_post = Post(content=content, author_id=payload['user_id'])
    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        "id": new_post.id,
        "content": new_post.content,
        "author_id": new_post.author_id
    }), 201

# Edit an existing post
@operations.route("/posts/<int:post_id>", methods=['PUT'])
@token_required
def edit_post(payload, post_id):
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({"error": "New post content is required"}), 400

    old_post = Post.query.get(post_id)
    if not old_post:
        return jsonify({"error": "Post not found"}), 404

    if old_post.author_id != payload['user_id']:
        return jsonify({"error": "You do not have permission to edit this post"}), 403

    old_post.content = content
    db.session.commit()

    return jsonify({"message": "Post updated successfully"}), 200

# Delete a post (Admin only)
@operations.route("/posts/<int:post_id>", methods=['DELETE'])
@token_required
def delete_post(payload, post_id):
    if not check_admin(payload):
        return jsonify({"error": "You are not allowed to complete this operation"}), 403

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post has been successfully removed"}), 200

@operations.route("/posts", methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "content": post.content,
            "author_id": post.author_id
        })
        
    return jsonify(result), 200

@operations.route("/profile/<int:user_id>/posts", methods = ['GET'])
@token_required
def get_all_user_posts(payload, user_id):
    posts = Post.query.filter_by(author_id = user_id).all()

    if not posts:
        return jsonify({"error": "No posts found for this user"}, 400)
    
    result = []
    for post in posts:
        result.append({
            "id":post.id,
            "content": post.content,
            "author_id": post.author_id

        })

    return jsonify(result)

@operations.route("/profile/<int:user_id>/comments", methods=['GET'])
@token_required
def get_all_user_comments(payload, user_id):
    # Fetch comments for the specified user
    comments = Comment.query.filter_by(author_id=user_id).all()
    
    if not comments:
        return jsonify({"message": "No comments found for this user"}), 404

    result = []
    for comment in comments:
        result.append({
            "id": comment.id,
            "content": comment.text,
            "post_id": comment.post_id,
        })

    return jsonify(result), 200

@operations.route("/posts/<int:post_id>/comments", methods = ['GET'])
@token_required
def get_all_comments_under_post(payload, post_id):
    comments = Comment.query.filter_by(post_id = post_id).all()
    res = []
    for comment in comments: 
        res.append({
            "id": comment.id,
            "content": comment.text,
            "author_id": comment.author_id,
            "post_id": comment.post_id,
        })

    return jsonify(res), 200


    
# Create a comment for a specific post
@operations.route("/posts/<int:post_id>/comments", methods=['POST'])
@token_required
def create_comment(payload, post_id):
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({"error": "Comment content is required"}), 400

    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    new_comment = Comment(text=content, post_id=post_id, author_id=payload['user_id'])
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"message": "Comment has been successfully created"}), 201

# Edit a comment
@operations.route("/comments/<int:comment_id>", methods=['PUT'])
@token_required
def edit_comment(payload, comment_id):
    data = request.json
    content = data.get('content')

    if not content:
        return jsonify({"error": "New comment content is required"}), 400

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    if comment.author_id != payload['user_id']:
        return jsonify({"error": "You do not have permission to edit this comment"}), 403

    comment.text = content
    db.session.commit()

    return jsonify({"message": "Comment updated successfully"}), 200


@operations.route("/comments/<int:comment_id>", methods=['DELETE'])
@token_required
def delete_comment(payload, comment_id):
    if not check_admin(payload):
        return jsonify({"error": "You are not allowed to complete this operation"}), 403

    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment has been successfully removed"}), 200

# Create a profile
@operations.route("/profile", methods=['POST'])
@token_required
def create_profile(payload):
    data = request.json
    bio = data.get('bio')
    location = data.get('location')

    user_id = payload['user_id']

    # Check if the user already has a profile
    if Profile.query.filter_by(user_id=user_id).first():
        return jsonify({"error": "Profile already exists"}), 400

    new_profile = Profile(bio=bio, location=location, user_id=user_id)
    db.session.add(new_profile)
    db.session.commit()

    return jsonify({"message": "Profile created successfully"}), 201

# Get a profile
@operations.route("/profile/<int:user_id>", methods=['GET'])
@token_required
def get_profile(payload, user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}, 404)
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "username": user.username,
        "bio": profile.bio,
        "location": profile.location
    }), 200

# Update a profile
@operations.route("/profile", methods=['PUT'])
@token_required
def update_profile(payload):
    data = request.json
    bio = data.get('bio')
    location = data.get('location')

    user_id = payload['user_id']
    profile = Profile.query.filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    if bio:
        profile.bio = bio
    if location:
        profile.location = location

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200

# Delete a profile (Admin only)
@operations.route("/profile/<int:user_id>", methods=['DELETE'])
@token_required
def delete_profile(payload, user_id):
    if not check_admin(payload):
        return jsonify({"error": "You are not allowed to complete this operation"}), 403

    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    db.session.delete(profile)
    db.session.commit()

    return jsonify({"message": "Profile deleted successfully"}), 200
