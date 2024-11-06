from flask_mail import Message
from backend.app import mail, db
from backend.app.services.email_styles import common_style
import random, string
from backend.app.models import User
from backend.app.config import Config


def send_password_reset_email(user):
    new_password = generate_random_password()  # Генерація нового пароля
    update_password(user, new_password)  # Обновлення пароля в базі даних

    html_body = f"""
    {common_style}
        <div class="container">
            <div class="header">Your New Password</div>
            <div class="content">
                <p>Hello {user.name},</p>
                <p>We have reset your password. Your new password is:</p>
                <p><strong>{new_password}</strong></p>
                <p>Please use this password to log in. We recommend changing it once you are logged in to keep your account secure.</p>
                <p class="footer">If you did not request a password reset, please ignore this email or contact support.</p>
                <p class="footer">Thank you for using our service!</p>
            </div>
        </div>
    </body>
    </html>
    """

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

