from flask import Blueprint, request, jsonify
from backend.app.models import User
from backend.app.services.password_reset_service import send_password_reset_email

password_reset_bp = Blueprint('password_reset', __name__)

@password_reset_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user:
        send_password_reset_email(user)
        return jsonify({'message': 'A new password has been sent to your email.'}), 200
    return jsonify({'message': 'Email not found.'}), 404

