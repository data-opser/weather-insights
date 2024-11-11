from app.config import Config
from flask import Flask
from flask_login import LoginManager
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
from app.utils.error_handler import ErrorHandler

db = SQLAlchemy()
login_manager = LoginManager()
oauth = OAuth()
mail = Mail()


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

    with app.app_context():
        db.create_all()

    @app.errorhandler(Exception)
    def handle_exception(error):
        return ErrorHandler.handle_error(error)

    @app.errorhandler(ValueError)
    def handle_validation_exception(error):
        return ErrorHandler.handle_validation_error(str(error))

    from app.routes import auth_bp, user_profile_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_profile_bp)

    return app
