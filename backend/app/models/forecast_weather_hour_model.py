from app import db
from datetime import datetime, timedelta
from sqlalchemy import cast, Date
from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger
from app.responses import WeatherResponse
from app.utils import ErrorHandler
from app.models import City


class ForecastWeatherHour(db.Model):
    __tablename__ = 'forecast_weather_report_hour'
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
    temperature = Column(Float)
    temperature_feels_like = Column(Float)
    pressure_sea_level = Column(Integer)
    pressure_ground_level = Column(Integer)
    humidity = Column(Integer)
    visibility = Column(Integer)
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
    def get_city_hourly_weather(cls, city_id, date):
        try:
            if not City.check_city_exists(city_id):
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )

            input_date = datetime.strptime(date, '%Y-%m-%d').date()
            current_date = datetime.now().date()

            if input_date == current_date:
                current_time = datetime.now().replace(minute=0, second=0, microsecond=0)
            else:
                current_time = datetime.combine(input_date, datetime.min.time())

            end_time = current_time + timedelta(hours=24)

            records = cls.query.filter(
                cls.city_id == city_id,
                cls.weather_time >= current_time,
                cls.weather_time < end_time
            ).order_by(cls.weather_time).all()

            return WeatherResponse.response_weather_hours(records)

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Internal server error while getting weather hourly forecast.",
                status_code=500
            )

