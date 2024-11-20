from flask import jsonify

class WeatherResponse:
    @staticmethod
    def response_weather_days(records):
        weather_data = [
            {
                "weather": record.weather,
                "date": record.weather_time.strftime('%Y-%m-%d'),
                "temperature_max": round(record.temperature_max, 2),
                "temperature_min": round(record.temperature_min, 2),
                "daily_temperature_feels_like": round(record.daily_temperature_feels_like, 2),
                "humidity": round(record.humidity, 2),
                "wind_speed": round(record.wind_speed, 2)
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
                "temperature": round(record.temperature, 2),
                "temperature_feels_like": round(record.temperature_feels_like, 2),
                "humidity": round(record.humidity, 2),
                "wind_speed": round(record.wind_speed, 2),
                "wind_degree": round(record.wind_degree, 2),
                "wind_gust": round(record.wind_gust, 2),
                "clouds_percent": record.clouds_percent
            } for record in records
        ]
        return jsonify(weather_data)
