from app import db
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask import jsonify
from app.models.city_model import City
from app.utils import ErrorHandler


class UserScheduledWeatherNotification(db.Model):
    __tablename__ = 'user_scheduled_weather_notification'
    __table_args__ = {'schema': 'user_data'}

    notification_id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey('user_data.user.user_id', ondelete='CASCADE'),
        nullable=False
    )
    city_id = db.Column(db.BigInteger, nullable=False)

    notification_title = db.Column(db.String(128), nullable=False)
    notification_date = db.Column(db.Date, nullable=False)
    sending_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='scheduled_notifications')

    @classmethod
    def get_user_scheduled_notifications(cls, user_id):
        try:
            user_notifications = cls.query.filter_by(user_id=user_id).all()
            notifications = []
            for un in user_notifications:

                city_data = City.get_city_data_by_id(un.city_id)
                notifications.append({
                    "notification_id": un.notification_id,
                    "notification_title": un.notification_title,
                    "notification_date": un.notification_date,
                    "sending_date": un.sending_date,
                    "city": city_data.get('city'),
                    "iso2": city_data.get('iso2'),
                    "country": city_data.get('country'),
                })

            return jsonify({'notifications': notifications}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving scheduled notification for user",
                status_code=500
            )

    @classmethod
    def get_grouped_user_scheduled_notifications(cls, user_id):
        try:
            user_notifications = cls.query.filter_by(user_id=user_id).all()
            notifications = defaultdict(list)

            for un in user_notifications:
                # Grouped by notification_title, notification_date и city_id
                key = (un.notification_title, un.notification_date, un.city_id)
                notifications[key].append({
                    "sending_date": un.sending_date,
                    "notification_id": str(un.notification_id)
                })

            grouped_notifications = []
            for (notification_title, notification_date, city_id), notification_data in notifications.items():
                city_data = City.get_city_data_by_id(city_id)
                grouped_notifications.append({
                    "notification_title": notification_title,
                    "notification_date": notification_date,
                    "city": city_data.get('city'),
                    "iso2": city_data.get('iso2'),
                    "country": city_data.get('country'),
                    "notification_data": notification_data
                })

            return jsonify({'notifications': grouped_notifications}), 200

        except Exception as e:
            return ErrorHandler.handle_error(
                e,
                message="Database error while retrieving scheduled notification for user",
                status_code=500
            )

    @classmethod
    def add_user_scheduled_notifications(cls, user_id, data):
        try:
            notification_title = data.get('notification_title')
            notification_date_str = data.get('notification_date')
            notify_in_days_list = data.get('notify_in_days', [])
            city_id = data.get('city_id')

            if not notification_date_str or not city_id or not notify_in_days_list or not notification_title:
                raise ValueError("Data are required.")

            try:
                notification_date = datetime.strptime(notification_date_str, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError("Invalid date format. Use 'YYYY-MM-DD'.")

            if notification_date <= datetime.now(timezone.utc).date():
                raise ValueError("Scheduled time must be in the future.")

            if not all(isinstance(day, int) and 0 <= day <= 15 for day in notify_in_days_list):
                raise ValueError("Each item in 'notify_in_days' must be an integer between 0 and 15.")

            city = City.check_city_exists(city_id)
            if not city:
                return ErrorHandler.handle_error(
                    None,
                    message=f"City with ID '{city_id}' not found.",
                    status_code=404
                )

            notifications = []
            for notify_in_days in notify_in_days_list:
                sending_date = notification_date - timedelta(days=notify_in_days)

                if sending_date < datetime.now().date():
                    continue

                existing_notification = cls.query.filter_by(
                    user_id=user_id,
                    city_id=city_id,
                    notification_date=notification_date,
                    sending_date=sending_date
                ).first()
                if existing_notification:
                    continue

                new_notification = cls(
                    notification_title = notification_title,
                    user_id=user_id,
                    city_id=city_id,
                    notification_date=notification_date,
                    sending_date = sending_date,
                )
                db.session.add(new_notification)
                notifications.append(new_notification)

            db.session.commit()
            return jsonify({
                'message': f'{len(notifications)} scheduled notifications created successfully.',
                'ids': [str(notification.notification_id) for notification in notifications]
            }), 201

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while adding scheduled notification.",
                status_code=500
            )

    @classmethod
    def delete_user_scheduled_notification(cls, user_id, notification_id):
        try:
            notification = cls.query.filter_by(notification_id=notification_id, user_id=user_id).first()
            if not notification:
                return ErrorHandler.handle_error(
                    None,
                    message=f"Notification with ID '{notification_id}' not found.",
                    status_code=404
                )

            db.session.delete(notification)
            db.session.commit()
            return jsonify({'message': 'Scheduled notification deleted successfully.'}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while deleting scheduled_notification.",
                status_code=500
            )

    @classmethod
    def delete_user_scheduled_notifications(cls, user_id, data):
        try:
            notification_ids = data.get('notification_ids')

            if not notification_ids:
                raise ValueError("Notification ids are required.")

            notifications = cls.query.filter(
                cls.notification_id.in_(notification_ids), cls.user_id == user_id
            ).all()

            if not notifications:
                return ErrorHandler.handle_error(
                    None,
                    message="No notifications found with the provided IDs.",
                    status_code=404
                )

            for notification in notifications:
                db.session.delete(notification)

            db.session.commit()
            return jsonify({'message': 'Scheduled notifications deleted successfully.'}), 200

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(
                e,
                message="Database error while deleting scheduled notifications.",
                status_code=500
            )
