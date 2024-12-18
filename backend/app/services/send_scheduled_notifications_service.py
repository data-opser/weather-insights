from flask_mail import Message
from app import mail, db
from datetime import date, timedelta
from app.models import UserScheduledWeatherNotification, User, UserDevice
from flask import render_template_string, jsonify
from app.utils import ErrorHandler


def send_scheduled_notifications(app):
    try:
        with app.app_context():
            today = date.today()

            notifications = UserScheduledWeatherNotification.query.filter_by(sending_date=today).all()

            for notification in notifications:
                user = notification.user
                if user.email_confirmed:
                    send_email_notification(user.email, notification.city_id, notification.notification_date)
                    db.session.delete(notification)

            db.session.commit()

    except Exception as e:
        db.session.rollback()
        return ErrorHandler.handle_error(
            e,
            message="Internal server error while sending scheduled notifications.",
            status_code=500
        )

def send_email_notification(email, city_id, notification_date):

    subject = f"Напоминание о погоде на {notification_date}"
    body = f"Привет! Напоминаем, что завтра ({notification_date}) у вас запланирован прогноз погоды для города с ID {city_id}."

    msg = Message(subject=subject, recipients=[email], body=body)
    mail.send(msg)
