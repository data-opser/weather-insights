from app.services import auth_service, email_confirm_service
from flask import Blueprint, request, jsonify
from flask_login import logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return auth_service.register_user(data)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return auth_service.login_user(data)


@auth_bp.route('/auth/google')
def google_login():
    return auth_service.initiate_google_login()


@auth_bp.route('/auth/google/callback')
def google_callback():
    return auth_service.handle_google_callback()


@auth_bp.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    return email_confirm_service.verify_email_token(token)


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    return auth_service.logout_user()
