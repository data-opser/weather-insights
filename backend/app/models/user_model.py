from app import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils import ErrorHandler


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'user_data'}

    user_id = db.Column(UUID(as_uuid=True), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.Date)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256))
    google_id = db.Column(db.String(128), unique=True)
    google_token = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    email_confirmed = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        if self.password is None:
            return False
        return check_password_hash(self.password, password)

    def get_id(self):
        return self.user_id

    @classmethod
    def register_user(cls, data):
        try:
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not name or not email:
                raise ValueError("Name and email are required for registration.")

            user = cls(name=name, email=email)

            if password:
                user.set_password(password)

            db.session.add(user)
            db.session.commit()
            return user

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while user register", status_code=500)

    @classmethod
    def google_register_user(cls, data):
        try:
            name = data.get('name')
            email = data.get('email')
            birthday = data.get('birthday')
            google_id = data.get('google_id')
            google_token = data.get('google_token')

            if not name or not email:
                raise ValueError("Name and email are required for Google registration.")

            user = cls(
                name=name,
                email=email,
                birthday=birthday,
                google_id=google_id,
                google_token=google_token
            )

            db.session.add(user)
            db.session.commit()
            return user

        except ValueError as ve:
            return ErrorHandler.handle_validation_error(str(ve))
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while google register", status_code=500)

    def update_user(self, data):
        name = data.get('name')
        birthday = data.get('birthday')
        password = data.get('password')

        if name:
            self.name = name
        if birthday:
            self.birthday = birthday
        if password:
            self.set_password(password)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while user updating", status_code=500)

    def add_google_data(self, google_id, google_token):
        self.google_id = google_id
        self.google_token = google_token

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while adding google data", status_code=500)

    def verify_email(self):
        self.email_confirmed = True
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return ErrorHandler.handle_error(e, message="Database error while verifying email", status_code=500)

    @staticmethod
    def get_user_by_email(email):
        user = User.query.filter_by(email=email).first()
        if not user:
            return ErrorHandler.handle_error(None, message=f"User with email '{email}' not found.", status_code=404)
        return user

    def get_profile_data(self):
        return {
            "name": self.name,
            "email": self.email,
            "birthday": self.birthday,
            "email_confirmed": self.email_confirmed,
            "created_at": self.created_at,
        }
