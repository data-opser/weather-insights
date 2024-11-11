from app.models import User
from flask import url_for, session
from flask_login import current_user
from datetime import date
from app import oauth, login_manager
from app.services.email_confirm_service import send_email_confirmation
import os, requests

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
    email = data.get('email')
    existing_user = User.get_user_by_email(data['email'])

    if existing_user:
        if existing_user.google_id:
            existing_user.update_user(data)
            return existing_user, 200, 'User data updated successfully.'
        raise ValueError('User already exists.')

    try:
        user = User.register_user(data)
        return user, 201, 'User registered successfully.'
    except ValueError as ve:
        raise ve
    except Exception as e:
        raise RuntimeError("Internal server error during registration") from e

def login_user(data):
    try:
        user = User.get_user_by_email(data['email'])
        if user:
            if not user.email_confirmed:
                send_email_confirmation(user)
                raise PermissionError("Please confirm your email first.")
            elif user.password is None:
                raise PermissionError('Please login via Google or complete regular registration.')
            elif user.password and user.check_password(data['password']):
                return user, 200, 'Logged in successfully.'
        raise PermissionError('Invalid credentials.')

    except PermissionError as pe:
        raise pe
    except Exception as e:
        raise RuntimeError("Internal server error during login") from e

def initiate_google_login():
    try:
        nonce = os.urandom(16).hex()
        session['nonce'] = nonce
        redirect_uri = url_for('auth.google_callback', _external=True)
        return google.authorize_redirect(redirect_uri, nonce=nonce)
    except Exception as e:
        raise RuntimeError("An error occurred during Google login initiation") from e

def handle_google_callback():
    try:
        token = google.authorize_access_token()
        nonce = session.pop('nonce', None)
        if not token or not nonce:
            raise PermissionError('Authorization failed')

        user_info = google.parse_id_token(token, nonce=nonce)
        if not user_info:
            raise PermissionError('Failed to fetch user info')

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

        return user, 200, 'Logged in with Google successfully.'
    except PermissionError as pe:
        raise pe
    except Exception as e:
        raise RuntimeError("Internal server error during Google login") from e

def fetch_google_birthday(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        response = requests.get('https://people.googleapis.com/v1/people/me?personFields=birthdays', headers=headers)
        response.raise_for_status()

        birthday_info = response.json().get('birthdays', [{}])[0].get('date', {})

        return date(
            birthday_info.get('year', 1900),
            birthday_info.get('month', 1),
            birthday_info.get('day', 1)
        )

    except requests.exceptions.RequestException as e:
        raise RuntimeError("Request failed while fetching birthday") from e
    except (KeyError, TypeError, ValueError) as e:
        raise ValueError("Error parsing birthday data") from e
    return None
