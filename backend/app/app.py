from backend.app.config import Config
from flask import Flask
from flask_login import LoginManager
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail

db = SQLAlchemy()
login_manager = LoginManager()
oauth = OAuth()
mail = Mail()

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)
    oauth.init_app(app)
    mail.init_app(app)

    with app.app_context():
        db.create_all()

    from backend.app.routes import auth_bp, user_profile_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_profile_bp)

    return app