from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from backend.app import mail
from backend.app.models import User
from flask import url_for
from backend.app.config import Config

s = URLSafeTimedSerializer(Config.SECRET_KEY)


def send_email_confirmation(user):
    token = s.dumps(user.email, salt='email-confirm-salt')
    confirmation_url = url_for('email_confirm.confirm_email', token=token, _external=True)

    html_body = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                color: #333;
                padding: 20px;
            }}
            .email-container {{
                background-color: white;
                border-radius: 8px;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                padding: 30px;
                text-align: center;
            }}
            .button {{
                background-color: #4CAF50;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                border-radius: 5px;
                margin-top: 20px;
            }}
            .footer {{
                font-size: 12px;
                color: #888;
                margin-top: 30px;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <h2>Welcome to Our Service!</h2>
            <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
            <a href="{confirmation_url}" class="button">Confirm Email</a>
            <p class="footer">If you did not request this, please ignore this email.</p>
        </div>
    </body>
    </html>
    """

    msg = Message("Email Confirmation",
                  recipients=[user.email],
                  body=f"To confirm your email address, visit the following link: {confirmation_url}",
                  html=html_body)  # Добавляем HTML контент в письмо

    mail.send(msg)


def verify_email_token(token):
    try:
        email = s.loads(token, salt='email-confirm-salt', max_age=3600)
        return User.query.filter_by(email=email).first()
    except:
        return None
