from app.models import User
from app import oauth
from app.utils import ErrorHandler, GoogleUtils, JwtUtils
from flask import request, session, jsonify
import os

google_android = oauth.register(
    name='google_android',
    client_id=os.getenv('GOOGLE_ANDROID_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_ANDROID_CLIENT_SECRET'),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
    client_kwargs={'scope': 'openid email profile https://www.googleapis.com/auth/user.birthday.read'}
)


def initiate_google_android_login():
    try:
        nonce = os.urandom(16).hex()
        session['nonce'] = nonce
        redirect_uri = request.json.get('redirect_uri')
        return google_android.authorize_redirect(redirect_uri, nonce=nonce)

    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="An error occurred during Google login initiation for Android",
            status_code=500
        )


def handle_google_android_callback():
    try:
        token = google_android.authorize_access_token()
        nonce = session.pop('nonce', None)
        if not token or not nonce:
            raise PermissionError('Authorization failed.')

        user_info = google_android.parse_id_token(token, nonce=nonce)
        if not user_info:
            raise PermissionError('Failed to fetch user info.')

        birthday = GoogleUtils.fetch_google_birthday(token.get('access_token'))
        existing_user = User.get_user_by_email(user_info['email'])

        if existing_user:
            if not existing_user.google_id:
                existing_user.add_google_data(user_info['sub'], token.get('refresh_token'))
                existing_user.verify_email()
            if not existing_user.birthday:
                existing_user.update_profile({"birthday": birthday})

            token = JwtUtils.generate_jwt({'user_id': str(existing_user.user_id)})

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

            token = JwtUtils.generate_jwt({'user_id': str(user.user_id)})

        return jsonify({'message': 'Logged in successfully.', 'token': token}), 200

    except PermissionError as pe:
        return ErrorHandler.handle_error(pe, message=str(pe), status_code=403)
    except Exception as e:
        return ErrorHandler.handle_error(
            e,
            message="Internal server error during Google login",
            status_code=500
        )
