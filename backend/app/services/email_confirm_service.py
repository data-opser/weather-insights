from app.models import User
from app import mail
from app.config import Config
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from flask import url_for
from flask import render_template_string

s = URLSafeTimedSerializer(Config.SECRET_KEY)

def send_email_confirmation(user):
    token = s.dumps(user.email, salt='email-confirm-salt')
    confirmation_url = url_for('auth.confirm_email', token=token, _external=True)

    with open("app/emails_templates/email_confirmation.html", "r") as html_file:
        html_template = html_file.read()

    html_body = render_template_string(
        html_template,
        name=user.name,
        confirmation_url=confirmation_url
    )

    msg = Message("Email Confirmation",
        recipients=[user.email],
        body=f"To confirm your email address, visit the following link: {confirmation_url}",
        html=html_body)

    mail.send(msg)


def verify_email_token(token):
    try:
        email = s.loads(token, salt='email-confirm-salt', max_age=3600)
        return User.query.filter_by(email=email).first()
    except:
        return None
