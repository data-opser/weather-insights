from app.models import User
from flask import url_for, session
from datetime import date
from app import oauth, login_manager, db
from app.services.email_confirm_service import send_email_confirmation
from app.utils import ErrorHandler
from flask import jsonify
import flask_login
import os
import requests

google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
    client_kwargs={'scope': 'openid email profile https://www.googleapis.com/auth/user.birthday.read'}
)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def register_user(data):
    try:
        email = data.get('email')
        if not email:
            raise ValueError("Email is required for registration.")

        existing_user = User.get_user_by_email(email)

        if existing_user:
            if existing_user.google_id:
                existing_user.update_user(data)
                return jsonify({'message': 'User data updated successfully.'}), 200
            raise ValueError('User already exists.')

        User.register_user(data)
        return jsonify({'message': 'User registered successfully.'}), 201

    except ValueError as ve:
        return ErrorHandler.handle_validation_error(str(ve))
    except Exception as e:
        db.session.rollback()
        return ErrorHandler.handle_error(e, message="Internal Server Error while register", status_code=500)


def login_user(data):
    try:
        email = data.get('email')
        if not email:
            raise ValueError("Email is required for login.")

        user = User.get_user_by_email(email)
        if not user:
            raise PermissionError('Invalid credentials.')

        if not user.email_confirmed:
            send_email_confirmation(user)
            raise PermissionError("Please confirm your email first.")

        if user.password is None:
            raise PermissionError('Please login via Google or complete regular registration.')

        if user.check_password(data.get('password')):
            flask_login.login_user(user)
            return jsonify({'message': 'Logged in successfully.'}), 200

        raise PermissionError('Invalid credentials.')

    except ValueError as ve:
        return ErrorHandler.handle_validation_error(str(ve))
    except PermissionError as pe:
        return ErrorHandler.handle_error(pe, message=str(pe), status_code=403)
    except Exception as e:
        return ErrorHandler.handle_error(e, message="Internal server error during login", status_code=500)


def initiate_google_login():
    try:
        nonce = os.urandom(16).hex()
        session['nonce'] = nonce
        redirect_uri = url_for('auth.google_callback', _external=True)
        return google.authorize_redirect(redirect_uri, nonce=nonce)

    except Exception as e:
        return ErrorHandler.handle_error(e, message="An error occurred during Google login initiation", status_code=500)


def handle_google_callback():
    try:
        token = google.authorize_access_token()
        nonce = session.pop('nonce', None)
        if not token or not nonce:
            raise PermissionError('Authorization failed.')

        user_info = google.parse_id_token(token, nonce=nonce)
        if not user_info:
            raise PermissionError('Failed to fetch user info.')

        birthday = fetch_google_birthday(token.get('access_token'))
        user = User.get_user_by_email(user_info['email'])

        if user:
            if not user.google_id:
                user.add_google_data(user_info['sub'], token['id_token'])
                user.verify_email()
            return user, 200, 'Logged in with Google successfully.'

        data = {
            'name': user_info.get('given_name'),
            'email': user_info['email'],
            'birthday': birthday,
            'google_id': user_info['sub'],
            'google_token': token['id_token']
        }
        user = User.google_register_user(data)
        user.verify_email()

        flask_login.login_user(user)
        return jsonify({'message': 'Logged in with Google successfully.'}), 200

    except PermissionError as pe:
        return ErrorHandler.handle_error(pe, message=str(pe), status_code=403)
    except Exception as e:
        return ErrorHandler.handle_error(e, message="Internal server error during Google login", status_code=500)


def fetch_google_birthday(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        response = requests.get('https://people.googleapis.com/v1/people/me?personFields=birthdays',
                                headers=headers)
        response.raise_for_status()

        birthday_info = response.json().get('birthdays', [{}])[0].get('date', {})

        return date(
            birthday_info.get('year', 1900),
            birthday_info.get('month', 1),
            birthday_info.get('day', 1)
        )

    except requests.exceptions.RequestException as e:
        return ErrorHandler.handle_error(e, message="Request failed while fetching birthday",
                                         status_code=500)


def logout_user():
    try:
        if flask_login.current_user.is_authenticated:
            flask_login.logout_user()
            return jsonify({'message': 'Logged out successfully.'}), 200
        else:
            return ErrorHandler.handle_error(None, message="No user logged in", status_code=401)
    except Exception as e:
        return ErrorHandler.handle_error(e, message="Internal server error while logout", status_code=500)