from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from backend.app import mail, db
from backend.app.models import User
from flask import current_app, url_for
from backend.app.config import Config
import os

s = URLSafeTimedSerializer(Config.SECRET_KEY)


def send_password_reset_email(user):
    token = s.dumps(user.email, salt='password-reset-salt')
    reset_url = url_for('mail_auth.reset_password', token=token, _external=True)

    msg = Message("Password Reset Request",
                  recipients=[user.email],
                  body=f"To reset your password, visit the following link: {reset_url}")
    mail.send(msg)


def verify_reset_token(token):
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
        return User.query.filter_by(email=email).first()
    except:
        return None


def update_password(user, new_password):
    user.set_password(new_password)
    db.session.commit()

