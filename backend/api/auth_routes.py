import uuid
from flask import Blueprint, request, jsonify, session, render_template, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from models.user import User

# u521bu5efaAPIu8defu7531

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # 查找用户
    user = User.query.filter_by(email=email).first()
    
    # 验证用户和密码
    if user and user.check_password(password):
        return jsonify({
            "success": True,
            "userId": user.id,
            "message": "登录成功"
        })
    
    return jsonify({
        "success": False,
        "message": "无效的邮箱或密码"
    }), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    """注册新用户"""
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # 确保所有必填字段都存在
    if not all([name, email, password]):
        return jsonify({
            "success": False,
            "message": "缺少必填字段"
        }), 400
    
    # 检查邮箱是否已注册
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({
            "success": False,
            "message": "该邮箱已被注册"
        }), 400
    
    # 创建新用户
    user_id = str(uuid.uuid4())
    new_user = User(
        id=user_id,
        name=name,
        email=email,
        password=password  # User 模型中会进行哈希处理
    )
    
    # 保存到数据库
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "userId": user_id,
        "message": "注册成功"
    })

@auth_bp.route('/logout', methods=['GET'])
def logout_page():
    """用户登出路由"""
    # 清除会话
    session.pop('user_id', None)
    
    # 重定向到登录页面
    return redirect(url_for('auth.login_page'))

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """u7528u6237u767bu51fau8defu7531"""
    # u6e05u9664u4f1au8bdd
    session.pop('user_id', None)
    
    return jsonify({
        'success': True,
        'message': 'u767bu51fau6210u529f'
    })

@auth_bp.route('/api/session', methods=['GET'])
def get_session():
    """u68c0u67e5u5f53u524du4f1au8bddu72b6u6001"""
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({
            'authenticated': False
        })
    
    user = User.query.get(user_id)
    
    if not user:
        # u5982u679cu7528u6237IDu5b58u5728u4f46u627eu4e0du5230u7528u6237uff0cu6e05u9664u4f1au8bdd
        session.pop('user_id', None)
        return jsonify({
            'authenticated': False
        })
    
    return jsonify({
        'authenticated': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    })

# u52a0u8f7du6d4bu8bd5u6570u636eu7684u8defu7531
@auth_bp.route('/setup', methods=['POST'])
def setup_test_user():
    """u4ec5u7528u4e8eu521du59cbu5316u6d4bu8bd5u7528u6237uff0cu975eu751fu4ea7u73afu5883u4f7fu7528"""
    if User.query.filter_by(username='admin').first():
        return jsonify({
            'success': False,
            'message': 'u6d4bu8bd5u7528u6237u5df2u5b58u5728'
        })
    
    test_user = User(
        id=str(uuid.uuid4()),
        username='admin',
        password_hash=generate_password_hash('password'),
        email='admin@example.com',
        name='u7ba1u7406u5458',
        role='admin'
    )
    
    db.session.add(test_user)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'u6d4bu8bd5u7528u6237u521bu5efau6210u529f',
        'user': {
            'id': test_user.id,
            'username': test_user.username,
            'name': test_user.name,
            'email': test_user.email
        }
    })
