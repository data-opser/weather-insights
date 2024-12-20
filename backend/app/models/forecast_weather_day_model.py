from app import db
from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger
from datetime import datetime
from app.responses import WeatherResponse
from app.utils import ErrorHandler
from app.models import City


class ForecastWeatherDay(db.Model):
    __tablename__ = 'forecast_weather_report_day'
    __table_args__ = {'schema': 'prod_dbt'}

    row_id = Column(BigInteger, primary_key=True)

    weather = Column(String)
    weather_description = Column(String)
    weather_time = Column(DateTime)
    city_id = Column(db.BigInteger)
    city = Column(String)
    country_iso = Column(String)
    longitude = Column(Float)
    latitude = Column(Float)
    temperature_max = Column(Float)
    temperature_min = Column(Float)
    daily_temperature_feels_like = Column(Float)
    pressure = Column(Integer)
    humidity = Column(Integer)
    wind_speed = Column(Float)
    wind_degree = Column(Integer)
    wind_gust = Column(Float)
    clouds_percent = Column(Integer)
    rain_precipitation = Column(Float)
    snow_precipitation = Column(Float)
    air_pollution_co = Column(Float)
    air_pollution_no = Column(Float)
    air_pollution_no2 = Column(Float)
    air_pollution_o3 = Column(Float)
    air_pollution_so2 = Column(Float)
    air_pollution_pm2_5 = Column(Float)
    air_pollution_pm10 = Column(Float)
    air_pollution_nh3 = Column(Float)
    sunrise_time_local = Column(DateTime)
    sunset_time_local = Column(DateTime)
    sunrise_time_utc = Column(DateTime)
    sunset_time_utc = Column(DateTime)

    @classmethod
    def get_city_four_day_forecast(cls, city_id):
        try:
            if not City.check_city_exists(city_id):
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )

            list_weather = cls.query.filter_by(city_id=city_id).order_by(cls.weather_time).all()
            return WeatherResponse.response_weather_days(list_weather)
        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Iternal server error while getting daily weather forecast.",
                status_code=500
            )

    @classmethod
    def get_forecast_by_city_date(cls, city_id, date):
        try:
            if not City.check_city_exists(city_id):
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )

            notification_datetime = datetime.combine(date, datetime.min.time())

            weather_record = cls.query.filter(cls.weather_time == notification_datetime).first()

            if not weather_record:
                return ErrorHandler.handle_error(
                    None,
                    message=f"No weather forecast found for city ID '{city_id}' on {date}.",
                    status_code=404
                )

            return WeatherResponse.response_weather_day(weather_record)
        except Exception as e:
            print(e)
            return ErrorHandler.handle_error(
                e,
                message="Internal server error while getting weather forecast by date and city.",
                status_code=500
            )
