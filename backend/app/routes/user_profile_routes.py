from flask import Blueprint, request, jsonify
from werkzeug.exceptions import NotFound
from app.models import User
from app.services.password_reset_service import send_password_reset_email
from app.services import profile_service
from flask_login import login_required, current_user

user_profile_bp = Blueprint('user_profile', __name__)


@user_profile_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    if not data or not data.get('email'):
        raise ValueError("Email is required")

    user = User.get_user_by_email(data['email'])
    status, message = send_password_reset_email(user)
    return jsonify({'message': message}), status


@user_profile_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    profile_data = profile_service.get_user_profile(current_user.user_id)
    if profile_data:
        return jsonify(profile_data), 200
    else:
        raise NotFound("User not found.")


@user_profile_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    status, message = profile_service.update_user_profile(current_user.user_id, data)
    return jsonify({'message': message}), status
