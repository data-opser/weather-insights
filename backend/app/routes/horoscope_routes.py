from flask import Blueprint, request
from app.models import Horoscope

horoscope_bp = Blueprint('horoscope', __name__)

@horoscope_bp.route('/horoscope', methods=['GET'])
def get_horoscope():
    return Horoscope.get_all_predictions()