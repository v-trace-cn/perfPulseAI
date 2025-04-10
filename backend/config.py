import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class."""
    DEBUG = False
    TESTING = False
    API_PREFIX = '/api'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key_please_change_in_production')
    current_dir = os.path.dirname(os.path.abspath(__file__))
    db_dir = os.path.join(current_dir, 'instance')
    os.makedirs(db_dir, exist_ok=True)
    db_path = os.path.join(db_dir, 'perfpulse.db')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{db_path}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    
class TestingConfig(DevelopmentConfig):
    """Testing configuration."""
    TESTING = True

class ProductionConfig(Config):
    """Production configuration."""
    # In production, ensure SECRET_KEY is set in environment variables
    SECRET_KEY = os.environ.get('SECRET_KEY')

# 不同的环境配置
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# 根据环境获取配置
def get_config():
    env = os.environ.get('FLASK_ENV', 'default')
    return config.get(env, config['default'])
