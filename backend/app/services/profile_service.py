from app.models import User

def get_user_profile(user_id):
    user = User.query.get(user_id)
    return user.get_profile_data() if user else None

def update_user_profile(user_id, data):
    user = User.query.get(user_id)
    if user:
        user.update_user(data['name'], data['surname'], data.get('birthday'), data['password'])
        return True
    return False
