from flask_mail import Message
from app import mail
from flask import render_template_string
from app.utils import ErrorHandler

def send_email_notification(notification, user, city_data, weather_data):
    try:
        print("send")

        with open("app/templates/email_notification.html", "r") as html_file:
            html_template = html_file.read()

        html_body = render_template_string(
            html_template,
            title=notification.notification_title,
            city=city_data.get('city'),
            date=notification.notification_date,
            user_name=user.name,
            temperature_max=weather_data.get('temperature_max'),
            temperature_min=weather_data.get('temperature_min'),
            feels_like=weather_data.get('daily_temperature_feels_like'),
            wind_speed=weather_data.get('wind_speed'),
            humidity=weather_data.get('humidity'),
            pressure=weather_data.get('pressure'),
            cloud_cover=weather_data.get('clouds_percent'),
            rain_precipitation=weather_data.get('rain_precipitation'),
            snow_precipitation=weather_data.get('snow_precipitation'),
            sunrise_time=weather_data.get('sunrise_local_time'),
            sunset_time=weather_data.get('sunset_local_time')
        )

        msg = Message(
            subject=f"Weather Notification for {notification.notification_date}",
            recipients=[user.email],
            body=f"""
                Weather Forecast for {notification.notification_title} in {city_data.get('city')} on {notification.notification_date}:
                
                Hello, {user.name}!

                Here is the weather forecast you requested:

                Temperature:
                - Max: {weather_data.get('temperature_max')}°C
                - Min: {weather_data.get('temperature_min')}°C
                - Feels like: {weather_data.get('daily_temperature_feels_like')}°C

                Air Details:
                - Wind: {weather_data.get('wind_speed')} m/s
                - Humidity: {weather_data.get('humidity')}%
                - Pressure: {weather_data.get('pressure')} hPa

                Additional Details:
                - Cloud Cover: {weather_data.get('clouds_percent')}%
                - Rain: {weather_data.get('rain_precipitation')} mm
                - Snow: {weather_data.get('snow_precipitation')} mm

                Daylight Hours:
                - Sunrise: {weather_data.get('sunrise_local_time')}
                - Sunset: {weather_data.get('sunset_local_time')}

                Thank you for using our service!

                Best regards,
                The Weather Insights Team
                """,
            html=html_body
        )

        mail.send(msg)

    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending notification email.",
            status_code=500
        )
