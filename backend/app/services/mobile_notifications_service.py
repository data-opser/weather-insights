from app.utils import ErrorHandler
from firebase_admin import messaging


def send_mobile_notification(device_token, notification, user, city_data, weather_data):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=f'Weather forecast notification "{notification.notification_title}"',
                body=f'In {city_data.get("city")} temperature {weather_data.get("temperature_max")}°C / {weather_data.get("temperature_min")}°C. '
                     f'Feels like {weather_data.get("daily_temperature_feels_like")}°C.'
            ),
            data={
                'title': f'{notification.notification_title}',
                'city': f'{city_data.get("city")}',
                'date': f'{notification.notification_date}',
                'user_name': f'{user.name}',
                'temperature_max': f'{weather_data.get("temperature_max")}',
                'temperature_min': f'{weather_data.get("temperature_min")}',
                'feels_like': f'{weather_data.get("daily_temperature_feels_like")}',
                'wind_speed': f'{weather_data.get("wind_speed")}',
                'humidity': f'{weather_data.get("humidity")}',
                'pressure': f'{weather_data.get("pressure")}',
                'cloud_cover': f'{weather_data.get("clouds_percent")}',
                'rain_precipitation': f'{weather_data.get("rain_precipitation")}',
                'snow_precipitation': f'{weather_data.get("snow_precipitation")}',
                'sunrise_time': f'{weather_data.get("sunrise_local_time")}',
                'sunset_time': f'{weather_data.get("sunset_local_time")}',
            },
            token=device_token
        )
        response = messaging.send(message)
        print('Successfully sent message:', response)

    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending mobile notification.",
            status_code=500
        )
