from backend.app.models import User
from backend.app import db
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    surname = data.get('surname')
    birthday = data.get('birthday')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Перевіряємо наявність користувача з такою ж електронною поштою
    user = User.query.filter_by(email=email).first()

    if user:
        # Якщо користувач вже існує з Google ID, оновлюємо лише дані
        if user.google_id:
            user.name = name
            user.surname = surname
            user.birthday = birthday
            user.set_password(password)
            db.session.commit()
            return jsonify({'message': 'User data updated successfully.'}), 200
        return jsonify({'message': 'User already exists.'}), 400

    # Якщо користувача немає, створюємо нового
    user = User(name=name, surname=surname, birthday=birthday, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully.'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Logged in successfully.'}), 200
    return jsonify({'message': 'Invalid credentials.'}), 401


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully.'}), 200


@auth_bp.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        'name': current_user.name,
        'surname': current_user.surname,
        'email': current_user.email
    }), 200


from flask import redirect, url_for, session, jsonify
from datetime import date
from backend.app import oauth
import os, requests

google = oauth.register(
    name='google',
    client_id=  os.getenv('GOOGLE_CLIENT_ID'),
    client_secret= os.getenv('GOOGLE_CLIENT_SECRET'),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
    authorize_params=None,
    client_kwargs={
        'scope': 'openid email profile https://www.googleapis.com/auth/user.birthday.read'
    }
)

@auth_bp.route('/auth/google')
def google_login():
    # Генеруємо випадковий nonce
    nonce = os.urandom(16).hex()
    session['nonce'] = nonce  # Зберігаємо nonce у сесії

    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri, nonce=nonce)  # Додаємо nonce до запиту

@auth_bp.route('/auth/google/callback')
def google_callback():
    token = google.authorize_access_token()
    if not token:
        return jsonify({'error': 'Authorization failed, token not received'}), 403

    # Отримуємо nonce з сесії
    nonce = session.pop('nonce', None)  # Витягуємо nonce із сесії

    # Переконайтеся, що nonce існує
    if not nonce:
        return jsonify({'error': 'Nonce is missing'}), 400

    user_info = google.parse_id_token(token, nonce=nonce)  # Передаємо nonce тут
    if not user_info:
        return jsonify({'error': 'Failed to fetch user info'}), 403

        # Получаем дату рождения с Google People API
    access_token = token['access_token']
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get('https://people.googleapis.com/v1/people/me?personFields=birthdays', headers=headers)

    # Перевіряємо, чи є день народження в даних, отриманих від Google People API
    if response.status_code == 200:
        birthdays_info = response.json()
        birthday_dict = birthdays_info.get('birthdays', [{}])[0].get('date', None)

        # Конвертуємо словник дати в об'єкт datetime.date, якщо він існує
        if birthday_dict:
            birthday = date(
                birthday_dict.get('year', 1900),
                birthday_dict.get('month', 1),
                birthday_dict.get('day', 1)
            )
        else:
            birthday = None
    else:
        birthday = None

    # Перевіряємо, чи користувач вже існує
    user = User.query.filter_by(email=user_info['email']).first()

    if user:
        # Якщо користувач знайдений, але без Google ID, додаємо Google ID та Google Token
        if not user.google_id:
            user.google_id = user_info['sub']
            user.google_token = token['id_token']
            db.session.commit()
        return jsonify({'message': 'Logged in with Google successfully.'})

    # Створюємо нового користувача, якщо не знайдено
    user = User(
        name=user_info['given_name'],
        email=user_info['email'],
        google_id=user_info['sub'],
        google_token=token['id_token'],
        birthday=birthday,
        role='user'
    )
    db.session.add(user)
    db.session.commit()

    login_user(user)
    return jsonify({'message': 'Logged in with Google successfully.'})
