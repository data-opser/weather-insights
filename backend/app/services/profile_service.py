from app.models import User
from flask import jsonify
from app.utils import ErrorHandler


def get_user_profile(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return jsonify(user.get_profile_data())
        else:
            return ErrorHandler.handle_error_2(None, message="User not found.", status_code=404)
    except Exception as e:
        return ErrorHandler.handle_error_2(e, message="Internal server error while retrieving the user profile.",
                                           status_code=500)


def update_user_profile(user_id, data):
    try:
        user = User.query.get(user_id)
        if user:
            user.update_user(data)
            return jsonify({'message': 'Profile updated successfully.'}), 200
        else:
            return ErrorHandler.handle_error_2(None, message="User not found.", status_code=404)
    except Exception as e:
        return ErrorHandler.handle_error_2(e, message="Internal server error while updating the user profile.",
                                           status_code=500)
