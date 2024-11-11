from app.models import User
from app import mail
from app.config import Config
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from flask import url_for, render_template_string
from werkzeug.exceptions import NotFound

s = URLSafeTimedSerializer(Config.SECRET_KEY)


def send_email_confirmation(user):
    try:
        token = s.dumps(user.email, salt='email-confirm-salt')
        confirmation_url = url_for('auth.confirm_email', token=token, _external=True)

        with open("app/emails_templates/email_confirmation.html", "r") as html_file:
            html_template = html_file.read()

        html_body = render_template_string(
            html_template,
            name=user.name,
            confirmation_url=confirmation_url
        )

        msg = Message(
            "Email Confirmation",
            recipients=[user.email],
            body=f"To confirm your email address, "
                 f"visit the following link: {confirmation_url}",
            html=html_body)

        mail.send(msg)
        return 200, 'Your email has been confirmed.'

    except FileNotFoundError as e:
        raise ValueError("Email template not found.") from e
    except Exception as e:
        raise RuntimeError("An error occurred while sending the email confirmation.") from e


def verify_email_token(token):
    try:
        email = s.loads(token, salt='email-confirm-salt', max_age=3600)
        user = User.query.filter_by(email=email).first()

        if user is None:
            raise NotFound("User not found for the given token.")

        return user

    except Exception as e:
        raise ValueError("Invalid or expired token.") from e
