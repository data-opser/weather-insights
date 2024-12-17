from celery import shared_task
from flask_mail import Message
from app import mail
from datetime import date, timedelta
from app.models import UserScheduledWeatherNotification, User, UserDevice

@shared_task(ignore_result=False)
def send_scheduled_notifications():
    """
    Отправляет запланированные уведомления на следующий день.
    """
    # Получаем дату следующего дня
    tomorrow = date.today() + timedelta(days=1)

    # Получаем все уведомления на следующий день
    notifications = UserScheduledWeatherNotification.query.filter_by(notification_date=tomorrow).all()

    for notification in notifications:
        user = notification.user
        if user.email_confirmed:  # Проверяем, что email пользователя подтверждён
            send_email_notification(user.email, notification.city_id, notification.notification_date)

def send_email_notification(email, city_id, notification_date):
    """
    Отправляет email уведомление.
    """
    subject = f"Напоминание о погоде на {notification_date}"
    body = f"Привет! Напоминаем, что завтра ({notification_date}) у вас запланирован прогноз погоды для города с ID {city_id}."

    msg = Message(subject=subject, recipients=[email], body=body)
    mail.send(msg)


