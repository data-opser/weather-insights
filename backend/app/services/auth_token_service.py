from backend.app import db
from backend.app.models import User
from sqlalchemy.exc import IntegrityError
import jwt, os
from datetime import datetime, timedelta

class AuthService:
    @staticmethod
    def register_user(name, surname, birthday, email, password):
        new_user = User(name=name, surname=surname, birthday=birthday, email=email)
        new_user.set_password(password)

        try:
            db.session.add(new_user)
            db.session.commit()
            return new_user
        except IntegrityError:
            db.session.rollback()
            return None

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            token = jwt.encode({
                'user_id': str(user.user_id),
                'exp': datetime.utcnow() + timedelta(days=1)
            }, os.environ.get('SECRET_KEY'), algorithm='HS256')
            return token
        return None
