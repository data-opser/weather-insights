from backend.app import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
import uuid
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'user_data'}

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50))
    birthday = db.Column(db.Date)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256))
    google_id = db.Column(db.String(128), unique=True)
    google_token = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    email_confirmed = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(20), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        if self.password is None:
            return False
        return check_password_hash(self.password, password)

    def get_id(self):
        return self.user_id

    @classmethod
    def create_user(cls, name, email, role, surname=None, birthday=None, password=None, google_id=None,
                    google_token=None):
        user = cls(
            name=name,
            surname=surname,
            birthday=birthday,
            email=email,
            role=role,
            google_id=google_id,
            google_token=google_token
        )

        if password:
            user.set_password(password)

        db.session.add(user)
        db.session.commit()
        return user

    def update_user(self, name=None, surname=None, birthday=None, password=None):
        if name:
            self.name = name
        if surname:
            self.surname = surname
        if birthday:
            self.birthday = birthday
        if password:
            self.set_password(password)
        db.session.commit()

    def get_profile_data(self):
        return {
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
            "birthday": self.birthday,
            "email_confirmed": self.email_confirmed,
            "created_at": self.created_at,
            "role": self.role
        }

    def add_google_data(self, google_id, google_token):
        self.google_id = google_id
        self.google_token = google_token
        db.session.commit()

    def verify_email(self):
        self.email_confirmed = True
        db.session.commit()

