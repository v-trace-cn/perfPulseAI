from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# 创建 SQLAlchemy 实例
db = SQLAlchemy()

# 初始化迁移管理器
migrate = Migrate()

def init_db(app):
    """初始化数据库"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    # 导入所有模型以确保它们注册到 SQLAlchemy
    from models.user import User
    from models.activity import Activity
    from models.reward import Reward
    
    # 在应用上下文中创建所有表
    with app.app_context():
        db.create_all()
