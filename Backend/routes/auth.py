from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from models import db,Users

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data=request.get_json() or {}
    email=data.get('email')
    password=data.get('password')
    if not email or not password:
        return jsonify({'message':"email and password required"}),400
    if Users.query.filter_by(email=email).first():
        return jsonify({"message":"email already exists!!"}),400
    user=Users(name=data.get('name'),phone=data.get('phone'),email=email,password_hash=generate_password_hash(password),role=data.get('role'))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message":"User created successfully"}),201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = Users.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Wrong Credentials"}), 401

    token = create_access_token(
        identity=str(user.id),  # MUST be string
        additional_claims={'role': user.role}
    )

    return jsonify({
        'access_token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role
        }
    }), 200


@auth_bp.route('/me',methods=['GET'])
@jwt_required()
def me():
    identity = int(get_jwt_identity())
    user=Users.query.get(identity)
    if not user:
        return jsonify({"message":"Not Found"}),404
    return jsonify(user.to_dict())

@auth_bp.route('/users',methods=['GET'])
@jwt_required()
def list_users():
    claims = get_jwt()
    role = claims.get('role')
    if role !='admin':
        return jsonify({"message":"admin only"}),403
    user=Users.query.all()

    return jsonify([u.to_dict() for u in user])

@auth_bp.route('/update/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    claims = get_jwt()
    role = claims.get('role')
    if role !='admin':
        return jsonify({'message':'Admin access only'}),403
    user = Users.query.get_or_404(user_id)
    data = request.get_json() or {}

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.role = data.get('role', user.role)

    # Password update optional
    if data.get('password'):
        user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User updated successfully'})


# ---------------- DELETE USER ----------------
@auth_bp.route('/delete/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    claims = get_jwt()
    role = claims.get('role')
    if role !='admin':
        return jsonify({'message': 'Admin access only'}), 403

    admin_id = int(get_jwt_identity())

    # Prevent admin from deleting themselves
    if admin_id == user_id:
        return jsonify({'message': 'Cannot delete your own account'}), 400

    user = Users.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'})



