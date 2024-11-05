from flask_login import LoginManager
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
oauth = OAuth()
login_manager = LoginManager()