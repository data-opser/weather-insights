from app.config import Config
from flask import Flask
from flask_login import LoginManager
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
from flask_apscheduler import APScheduler

db = SQLAlchemy()
login_manager = LoginManager()
oauth = OAuth()
mail = Mail()
scheduler = APScheduler()

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app,
         origins=app.config['CORS_ALLOW_ORIGINS'],
         methods=app.config['CORS_ALLOW_METHODS'],
         supports_credentials=app.config['CORS_SUPPORTS_CREDENTIALS'],
         allow_headers=app.config['CORS_ALLOW_HEADERS'],
         max_age=app.config['CORS_MAX_AGE'])

    db.init_app(app)
    login_manager.init_app(app)
    oauth.init_app(app)
    mail.init_app(app)
    scheduler.init_app(app)

    with app.app_context():
        db.create_all()

    from app.routes import auth_bp, user_profile_bp, weather_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_profile_bp)
    app.register_blueprint(weather_bp)

    from app.services.send_scheduled_notifications_service import send_scheduled_notifications
    scheduler.add_job(
        id='scheduled_notifications',
        func=lambda: send_scheduled_notifications(app),
        trigger='interval',
        seconds=60,
        max_instances = 1
    )
    scheduler.start()

    return app
