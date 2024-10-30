from ..models import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
import uuid

class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'user_data'}

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    google_id = db.Column(db.String(128), unique=True)
    google_token = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    email_confirmed = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(20), nullable=False)