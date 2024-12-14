from flask import jsonify

class WeatherResponse:
    @staticmethod
    def response_weather_days(records):
        weather_data = [
            {
                "weather": record.weather,
                "date": record.weather_time.strftime('%Y-%m-%d'),
                "temperature_max": round(record.temperature_max, 2) if record.temperature_max is not None else 0,
                "temperature_min": round(record.temperature_min, 2) if record.temperature_min is not None else 0,
                "daily_temperature_feels_like": round(record.daily_temperature_feels_like, 2) if record.daily_temperature_feels_like is not None else 0,
                "humidity": round(record.humidity, 2) if record.humidity is not None else 0,
                "wind_speed": round(record.wind_speed, 2) if record.wind_speed is not None else 0
            } for record in records
        ]
        return jsonify(weather_data)

    @staticmethod
    def response_sun_times(record):
        sun_times = {
            "sunrise_local_time": record.sunrise_time_local.strftime("%H:%M"),
            "sunset_local_time": record.sunset_time_local.strftime("%H:%M"),
        }
        return jsonify(sun_times)

    @staticmethod
    def response_weather_hours(records):
        weather_data = [
            {
                "weather": record.weather,
                "time": record.weather_time.strftime("%H:%M"),
                "temperature": round(record.temperature, 2) if record.temperature is not None else 0,
                "temperature_feels_like": round(record.temperature_feels_like, 2) if record.temperature_feels_like is not None else 0,
                "humidity": round(record.humidity, 2) if record.humidity is not None else 0,
                "wind_speed": round(record.wind_speed, 2) if record.wind_speed is not None else 0,
                "wind_degree": round(record.wind_degree, 2) if record.wind_degree is not None else 0,
                "wind_gust": round(record.wind_gust, 2) if record.wind_gust is not None else 0,
                "clouds_percent": round(record.clouds_percent, 2) if record.clouds_percent is not None else 0,
                "rain_precipitation":round(record.rain_precipitation, 2) if record.rain_precipitation is not None else 0,
                "snow_precipitation":round(record.snow_precipitation, 2) if record.snow_precipitation is not None else 0,
                "pressure_ground_level":round(record.pressure_ground_level, 3) if record.pressure_ground_level is not None else 0
            } for record in records
        ]
        return jsonify(weather_data)
