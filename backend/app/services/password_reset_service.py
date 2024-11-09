from flask_mail import Message
from backend.app import mail, db
import random, string
from flask import render_template_string

def send_password_reset_email(user):
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

def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def update_password(user, new_password):
    user.set_password(new_password)
    db.session.commit()
