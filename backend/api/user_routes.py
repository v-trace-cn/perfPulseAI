import uuid
from flask import Blueprint, jsonify, request
from database import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

# 创建用户相关路由的蓝图
user_bp = Blueprint('user', __name__, url_prefix='/api/users')

@user_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """根据用户ID获取用户详情"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "找不到用户"}), 404
        
    return jsonify(user.to_dict())

@user_bp.route('/<user_id>/achievements', methods=['GET'])
def get_achievements(user_id):
    """获取用户成就"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "找不到用户"}), 404
    
    # 这里可以查询用户的成就数据表
    # 目前使用示例数据
    achievements = [
        {"id": 1, "name": "首次贡献", "date": "2022-04-01", "points": 50},
        {"id": 2, "name": "连续贡献30天", "date": "2022-05-15", "points": 200},
        {"id": 3, "name": "高质量代码审查", "date": "2022-06-22", "points": 150}
    ]
    
    return jsonify(achievements)

@user_bp.route('/<user_id>/updateInfo', methods=['POST'])
def update_user(user_id):
    """更新用户信息"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "找不到用户"}), 404

    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    department = data.get('department')
    position = data.get('position')
    phone = data.get('phone')
    updated_at = data.get("updatedAt")
    if name:
        user.name = name
    if email:
        user.email = email
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({
                "success": False,
                "message": "该邮箱已被注册"
            }), 400
    if password:
        user.set_password(password)
    if department:
        user.department = department
    if position:
        user.position = position
    if phone:
        user.phone = phone
    if updated_at:
        user.updated_at = updated_at
    db.session.commit()
    db.session.close()
    return jsonify({
        "success": True,
        "message": "用户信息更新成功",
        "data": user.to_dict()
    })
