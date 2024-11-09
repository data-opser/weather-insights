from app.models import User
from flask import jsonify, url_for, session, request
from flask_login import current_user
from datetime import date
from app import oauth, db, login_manager
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
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        if existing_user.google_id:
            existing_user.update_user(data['name'], data['surname'], data.get('birthday'), data['password'])
            return existing_user, 200, 'User data updated successfully.'
        return None, 400, 'User already exists.'

    user = User.create_user(
        name=data['name'],
        surname=data['surname'],
        birthday=data.get('birthday'),
        email=email,
        password=data['password'],
        role='user'
    )
    return user, 201, 'User registered successfully.'


def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if user:
        if not user.email_confirmed:
            send_email_confirmation(user)
            return None, 403, "Please confirm your email first."
        elif user.password is None:
            return None, 401, 'Please login via Google or complete regular registration.'
        elif user.password and user.check_password(data['password']):
            return user, 200, 'Logged in successfully.'

    return None, 401, 'Invalid credentials.'


def initiate_google_login():
    nonce = os.urandom(16).hex()
    session['nonce'] = nonce
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri, nonce=nonce)


def handle_google_callback():
    token = google.authorize_access_token()
    nonce = session.pop('nonce', None)
    if not token or not nonce:
        return None, 403, 'Authorization failed'

    user_info = google.parse_id_token(token, nonce=nonce)
    if not user_info:
        return None, 403, 'Failed to fetch user info'

    birthday = fetch_google_birthday(token.get('access_token'))

    user = User.query.filter_by(email=user_info['email']).first()

    if user:
        if not user.google_id:
            user.add_google_data(user_info['sub'], token['id_token'])
            user.verify_email()
        return user, 200, 'Logged in with Google successfully.'

    user = User.create_user(
        name=user_info.get('given_name'),
        surname=None,
        birthday=birthday,
        email=user_info['email'],
        password=None,
        role='user',
        google_id=user_info['sub'],
        google_token=token['id_token']
    )
    user.verify_email()

    return user, 200, 'Logged in with Google successfully.'


def fetch_google_birthday(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('https://people.googleapis.com/v1/people/me?personFields=birthdays', headers=headers)
    if response.status_code == 200:
        birthday_info = response.json().get('birthdays', [{}])[0].get('date', {})
        return date(birthday_info.get('year', 1900), birthday_info.get('month', 1), birthday_info.get('day', 1))
    return None
