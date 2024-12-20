from flask import Blueprint, request
from app.models import СurrentWeather, City, ForecastWeatherDay, ForecastWeatherHour

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weatherday/city', methods=['GET'])
def fetch_four_day_forecast():
    city_id = request.args.get('city')
    return ForecastWeatherDay.get_city_four_day_forecast(city_id)

@weather_bp.route('/suntimes/city', methods=['GET'])
def fetch_sunrise_sunset_times():
    city_id = request.args.get('city')
    return СurrentWeather.get_sun_times_for_city(city_id)

@weather_bp.route('/weather/city', methods=['GET'])
def fetch_weather_by_date_and_city():
    city_id = request.args.get('city')
    return ForecastWeatherHour.get_city_hourly_weather(city_id)

@weather_bp.route('/cities', methods=['GET'])
def get_cities():
    return City.get_all_cities_by_id()

@weather_bp.route('/city', methods=['GET'])
def get_city():
    city_id = request.args.get('city')
    return City.get_city_name_by_id(city_id)

@weather_bp.route('/airpollution/city', methods=['GET'])
def fetch_air_pollution_data():
    city_id = request.args.get('city')
    return СurrentWeather.get_air_pollution_data(city_id)