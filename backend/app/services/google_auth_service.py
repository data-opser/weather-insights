from app.models import User
from flask import url_for, session
from datetime import date, datetime, timedelta, timezone
from app import oauth, db
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
    client_kwargs={
        'scope': 'openid email profile https://www.googleapis.com/auth/user.birthday.read',
        'access_type': 'offline',
        'prompt': 'consent'
    }

)

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
        existing_user = User.get_user_by_email(user_info['email'])

        if existing_user:
            if not existing_user.google_id:
                existing_user.add_google_data(user_info['sub'], token.get('refresh_token'))
                existing_user.verify_email()
            if not existing_user.birthday:
                existing_user.update_profile({"birthday": birthday})

            flask_login.login_user(existing_user)
        else:
            data = {
                'name': user_info.get('given_name'),
                'email': user_info['email'],
                'birthday': birthday,
                'google_id': user_info['sub'],
                'refresh_token': token.get('refresh_token'),
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


def get_fresh_google_access_token(user):

    if not user.google_refresh_token:
        raise ValueError("Refresh token not available for the user.")

    refresh_token = user.get_refresh_token()

    try:
        data = {
            "client_id": google.client_id,
            "client_secret": google.client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }

        response = requests.post(google.access_token_url, data=data)
        response.raise_for_status()

        token_data = response.json()
        access_token = token_data.get('access_token')

        if not access_token:
            return ErrorHandler.handle_error(None, message="Failed to obtain a new access token.",
                                             status_code=500)

        return access_token

    except ValueError as ve:
        return ErrorHandler.handle_validation_error(str(ve))
    except requests.exceptions.RequestException as e:
        return ErrorHandler.handle_error(e, message="Request failed while fetching google token", status_code=500)
