from backend.app.models import User
from backend.app import mail
from backend.app.config import Config
from backend.app.services.email_styles import common_style
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from flask import url_for

s = URLSafeTimedSerializer(Config.SECRET_KEY)

def send_email_confirmation(user):
    token = s.dumps(user.email, salt='email-confirm-salt')
    confirmation_url = url_for('auth.confirm_email', token=token, _external=True)

    html_body = f"""
    {common_style}
        <div class="container">
            <div class="header">Email Confirmation</div>
            <div class="content">
                <p>Hello {user.name},</p>
                <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
                <a href="{confirmation_url}" class="button">Confirm Email</a>
                <p class="footer">If you did not request this, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """

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
