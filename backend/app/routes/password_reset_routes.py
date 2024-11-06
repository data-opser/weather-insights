from flask import Blueprint, request, jsonify
from backend.app.services import password_reset_service
from backend.app.models import User

password_reset_bp = Blueprint('password_reset', __name__)

@password_reset_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user:
        password_reset_service.send_password_reset_email(user)
        return jsonify({'message': 'Password reset email sent.'}), 200
    return jsonify({'message': 'Email not found.'}), 404

@password_reset_bp.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    user = password_reset_service.verify_reset_token(token)
    if not user:
        return jsonify({'message': 'The token is invalid or expired.'}), 400

    data = request.get_json()
    new_password = data.get('password')
    if new_password:
        password_reset_service.update_password(user, new_password)
        return jsonify({'message': 'Your password has been updated.'}), 200
    return jsonify({'message': 'Password is required.'}), 400
