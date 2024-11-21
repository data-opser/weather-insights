from flask import Blueprint, request
from app.models import User, UserCity
from app.services.password_reset_service import send_password_reset_email
from app.services import profile_service
from flask_login import login_required, current_user
from app.utils import ErrorHandler

user_profile_bp = Blueprint('user_profile', __name__)


@user_profile_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    try:
        data = request.get_json()
        if not data or not data.get('email'):
            raise ValueError("Email is required")

        user = User.get_user_by_email(data['email'])
        if not user:
            return ErrorHandler.handle_error(None, message=f"User with email '{data['email']}' not found.",
                                             status_code=404)
        return send_password_reset_email(user)

    except ValueError as ve:
        return ErrorHandler.handle_validation_error(str(ve))


@user_profile_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    return profile_service.get_user_profile(current_user.user_id)


@user_profile_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    return profile_service.update_user_profile(current_user.user_id, data)


@user_profile_bp.route('/user_cities', methods=['Get'])
@login_required
def get_user_cities():
    return UserCity.get_user_cities(current_user.user_id)


@user_profile_bp.route('/add_user_city/city', methods=['Post'])
@login_required
def add_user_city():
    city_id = request.args.get('city')
    return UserCity.add_user_city(current_user.user_id, city_id)


@user_profile_bp.route('/delete_user_city/city', methods=['Post'])
@login_required
def delete_user_city():
    city_id = request.args.get('city')
    return UserCity.delete_user_city(current_user.user_id, city_id)


@user_profile_bp.route('/set_main_user_city/city', methods=['Put'])
@login_required
def set_main_user_city():
    city_id = request.args.get('city')
    return UserCity.set_main_user_city(current_user.user_id, city_id)