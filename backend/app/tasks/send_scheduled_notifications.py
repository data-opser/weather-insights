from app import db
from datetime import date
from app.models import UserScheduledWeatherNotification, City, ForecastWeatherDay, UserDevice
from app.services.email_notifications_service import send_email_notification
from app.services.mobile_notifications_service import send_mobile_notification
from app.utils import ErrorHandler


def send_scheduled_notifications(app):
    try:
        with app.app_context():
            today = date.today()

            notifications = UserScheduledWeatherNotification.query.filter_by(sending_date=today).all()

            for notification in notifications:
                user = notification.user

                city_data = City.get_city_data_by_id(notification.city_id)
                weather_data = ForecastWeatherDay.get_forecast_by_city_date(notification.city_id,
                                                                            notification.notification_date)
                if user.email_confirmed:
                    send_email_notification(notification, user, city_data, weather_data)

                devices = UserDevice.query.filter_by(user_id=user.user_id).all()
                for device in devices:
                    device_token = device.get_device_token()
                    if device_token:
                        send_mobile_notification(device_token, notification, user, city_data, weather_data)

                db.session.delete(notification)

            db.session.commit()

    except Exception as e:
        with app.app_context():
            db.session.rollback()
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending scheduled notifications.",
            status_code=500
        )
