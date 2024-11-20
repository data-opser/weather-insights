from app.models import User
from app import mail
from app.config import Config
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from flask import url_for, render_template_string, jsonify
from app.utils import ErrorHandler

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
        return jsonify({'message': 'The email confirmation was sent successfully.'}), 200

    except Exception as e:
        return ErrorHandler.handle_error(e, message="Internal server error while sending the email confirmation.",
                                         status_code=500)


def verify_email_token(token):
    try:
        email = s.loads(token, salt='email-confirm-salt', max_age=3600)
        user = User.query.filter_by(email=email).first()

        if user is None:
            raise PermissionError('The token is invalid or expired.')

        user.verify_email()
        return jsonify({'message': 'Email was confirmed successfully.'}), 200

    except PermissionError as pe:
        return ErrorHandler.handle_error(pe, message=str(pe), status_code=403)
    except Exception as e:
        return ErrorHandler.handle_error(e, message="Internal server error while email confirmation",
                                         status_code=500)
