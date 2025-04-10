import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, request, render_template, send_from_directory

from config import config
from database import init_db
from api import init_app as init_blueprints

def create_app(config_name='default'):
    """创建并配置Flask应用"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # 初始化CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ], 
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]  # 添加Authorization
        }
    })
    
    init_db(app)            # 初始化数据库
    init_blueprints(app)    # 注册蓝图
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    # 健康检查端点
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "ok", "code": 200, "message": "API服务器运行正常"})
    return app


if __name__ == '__main__':
    load_dotenv()
    app = create_app(os.getenv('FLASK_ENV', 'default'))
    app.run(debug=True, port=5000, host='0.0.0.0')
