from flask import Blueprint, jsonify
from backend.app.services.email_confirm_service import verify_email_token
from backend.app.models import User

email_confirm_bp = Blueprint('email_confirmation', __name__)

@email_confirm_bp.route('/confirm_email/<token>', methods=['GET'])
def confirm_email(token):
    user = verify_email_token(token)
    if not user:
        return jsonify({'message': 'The token is invalid or expired.'}), 400

    user.verify_email()

    return jsonify({'message': 'Your email has been confirmed.'}), 200
