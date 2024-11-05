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
        return check_password_hash(self.password, password)

    def get_id(self):
        return self.user_id