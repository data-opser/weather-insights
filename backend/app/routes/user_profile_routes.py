from flask import Blueprint, request
from app.models import UserCity
from app.services.password_reset_service import send_password_reset_email
from app.services import profile_service
from app.utils.auth_decorator import auth_required

user_profile_bp = Blueprint('user_profile', __name__)


@user_profile_bp.route('/profile', methods=['GET'])
@auth_required
def get_profile():
    user = request.current_user
    return profile_service.get_user_profile(user.user_id)


@user_profile_bp.route('/update_profile', methods=['PUT'])
@auth_required
def update_profile():
    user = request.current_user
    data = request.get_json()
    return profile_service.update_user_profile(user.user_id, data)


@user_profile_bp.route('/update_password', methods=['PUT'])
@auth_required
def update_password():
    user = request.current_user
    data = request.get_json()
    return profile_service.update_user_password(user.user_id, data)


@user_profile_bp.route('/reset_password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    return send_password_reset_email(data)


@user_profile_bp.route('/user_cities', methods=['Get'])
@auth_required
def get_user_cities():
    user = request.current_user
    return UserCity.get_user_cities(user.user_id)


@user_profile_bp.route('/user_city_ids', methods=['Get'])
@auth_required
def get_user_city_ids():
    user = request.current_user
    return UserCity.get_user_city_ids(user.user_id)


@user_profile_bp.route('/add_user_city/city', methods=['Post'])
@auth_required
def add_user_city():
    user = request.current_user
    city_id = request.args.get('city')
    return UserCity.add_user_city(user.user_id, city_id)


@user_profile_bp.route('/delete_user_city/city', methods=['Post'])
@auth_required
def delete_user_city():
    user = request.current_user
    city_id = request.args.get('city')
    return UserCity.delete_user_city(user.user_id, city_id)


@user_profile_bp.route('/set_main_user_city/city', methods=['Put'])
@auth_required
def set_main_user_city():
    user = request.current_user
    city_id = request.args.get('city')
    return UserCity.set_main_user_city(user.user_id, city_id)
