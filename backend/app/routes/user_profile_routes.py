from flask import Blueprint, request, jsonify
from app.models import User
from app.services.password_reset_service import send_password_reset_email
from app.services import profile_service
from flask_login import login_required, current_user

user_profile_bp = Blueprint('user_profile', __name__)

@user_profile_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user:
        send_password_reset_email(user)
        return jsonify({'message': 'A new password has been sent to your email.'}), 200
    return jsonify({'message': 'Email not found.'}), 404

@user_profile_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    profile_data = profile_service.get_user_profile(current_user.user_id)
    if profile_data:
        return jsonify(profile_data), 200
    return jsonify({'message': 'Profile not found.'}), 404

@user_profile_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    success = profile_service.update_user_profile(current_user.user_id, data)
    if success:
        return jsonify({'message': 'Profile updated successfully.'}), 200
    return jsonify({'message': 'Profile update failed.'}), 400
