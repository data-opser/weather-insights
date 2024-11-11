from flask_mail import Message
from app import mail, db
import random, string
from flask import render_template_string

def send_password_reset_email(user):
    try:
        new_password = generate_random_password()
        update_password(user, new_password)

        with open("app/emails_templates/password_reset_email.html", "r") as html_file:
            html_template = html_file.read()

        html_body = render_template_string(
            html_template,
            name=user.name,
            new_password=new_password
        )

        msg = Message(
            "Your New Password",
            recipients=[user.email],
            body=f"Your new password is: {new_password}\nYou can log in using this password. Please change it after logging in.",
            html=html_body
        )

        mail.send(msg)
        return 200, 'A new password has been sent to your email.'

    except FileNotFoundError as e:
        raise ValueError("Password reset email template not found.") from e
    except Exception as e:
        raise RuntimeError("An error occurred while sending the password reset email.") from e

def generate_random_password(length=8):
    try:
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for _ in range(length))
    except Exception as e:
        raise RuntimeError("An error occurred while generating the random password.") from e

def update_password(user, new_password):
    try:
        user.set_password(new_password)
        db.session.commit()
    except Exception as e:
        raise RuntimeError("An error occurred while updating the user's password.") from e
