from app.models import User
from werkzeug.exceptions import NotFound


def get_user_profile(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            return user.get_profile_data()
        else:
            raise NotFound("User not found.")
    except Exception as e:
        raise RuntimeError("An error occurred while retrieving the user profile.") from e


def update_user_profile(user_id, data):
    try:
        user = User.query.get(user_id)
        if user:
            user.update_user(data)
            return 200, 'Profile updated successfully.'
        else:
            raise NotFound("User not found.")
    except Exception as e:
        raise RuntimeError("An error occurred while updating the user profile.") from e
