from app import db
from sqlalchemy import Column, Integer, String, Float, DateTime, BigInteger
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
            coordinates = City.get_lat_lng_by_id(city_id)
            if "latitude" in coordinates and "longitude" in coordinates:
                latitude = coordinates["latitude"]
                longitude = coordinates["longitude"]

                list_weather = cls.query.filter(
                    cls.latitude == latitude,
                    cls.longitude == longitude
                ).all()
                return WeatherResponse.response_weather_days(list_weather)

        except Exception as e:
            return ErrorHandler.handle_error(e, message="Internal Server Error", status_code=500)
