from app import db
from datetime import date
from app.models import UserScheduledWeatherNotification, City, ForecastWeatherDay
from app.services.email_notifications_service import send_email_notification
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

                db.session.delete(notification)

            db.session.commit()

    except Exception as e:
        db.session.rollback()
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending scheduled notifications.",
            status_code=500
        )
