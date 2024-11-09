from app.models import User
from app.services import auth_service, email_confirm_service
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
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'message': 'Logged out successfully.'}), 200
    else:
        return jsonify({'message': 'No user logged in.'}), 400

@auth_bp.route('/auth/google')
def google_login():
    return auth_service.initiate_google_login()

@auth_bp.route('/auth/google/callback')
def google_callback():
    user, status, message = auth_service.handle_google_callback()
    if user:
        login_user(user)
    return jsonify({'message': message}), status

@auth_bp.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    user = email_confirm_service.verify_email_token(token)
    if not user:
        return jsonify({'message': 'The token is invalid or expired.'}), 400

    user.verify_email()

    return jsonify({'message': 'Your email has been confirmed.'}), 200

