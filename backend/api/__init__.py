# API package initialization
from .user_routes import user_bp
from .auth_routes import auth_bp
from .reward_routes import reward_bp
from .scoring_routes import scoring_bp
from .activity_routes import activity_bp

def init_app(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(reward_bp)
    app.register_blueprint(scoring_bp)
    app.register_blueprint(activity_bp)


__all__ = [user_bp, activity_bp, reward_bp, scoring_bp, auth_bp]