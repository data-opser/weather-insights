from backend.app.models import User
from backend.app.services import auth_service
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user, status, message = auth_service.register_user(data)
    return jsonify({'message': message}), status

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user, status, message = auth_service.login_user(data)
    if user:
        login_user(user)
    return jsonify({'message': message}), status

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully.'}), 200

@auth_bp.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        'name': current_user.name,
        'surname': current_user.surname,
        'email': current_user.email
    }), 200

@auth_bp.route('/auth/google')
def google_login():
    return auth_service.initiate_google_login()

@auth_bp.route('/auth/google/callback')
def google_callback():
    user, status, message = auth_service.handle_google_callback()
    if user:
        login_user(user)
    return jsonify({'message': message}), status
