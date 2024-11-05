from backend.app.config import Config
from backend.app import login_manager, oauth, db
from flask import Flask

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)
    oauth.init_app(app)

    with app.app_context():
        db.create_all()

    from backend.app.routes.auth_routes import auth_bp
    #from backend.app.routes.oauth_routes import oauth_bp
    app.register_blueprint(auth_bp)
    #app.register_blueprint(oauth_bp)

    return app