import uuid
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from database import db
from models.activity import Activity

# 创建活动相关路由的蓝图
activity_bp = Blueprint('activity', __name__, url_prefix='/api/activity')

@activity_bp.route('/activities', methods=['GET'])
def get_activities():
    """获取所有活动"""
    # 获取分页和搜索参数
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    search = request.args.get('search', '')
    
    # 查询活动
    query = Activity.query
    
    # 如果有搜索参数，过滤结果
    if search:
        query = query.filter(Activity.title.ilike(f'%{search}%') | 
                            Activity.description.ilike(f'%{search}%'))
    
    # 分页
    pagination = query.order_by(Activity.created_at.desc()).paginate(page=page, per_page=per_page)
    activities = pagination.items
    
    return jsonify({
        "activities": [activity.to_dict() for activity in activities],
        "total": pagination.total,
        "page": page,
        "per_page": per_page
    })

@activity_bp.route('/activities/recent', methods=['GET'])
def get_recent_activities():
    """获取最近活动"""
    # 获取最近的5个活动
    recent_activities = Activity.query.order_by(Activity.created_at.desc()).limit(5).all()
    
    # 格式化活动数据
    activities_data = []
    for activity in recent_activities:
        activity_dict = activity.to_dict()
        # 添加用户信息 (在实际应用中应从用户数据库获取)
        activity_dict['user'] = {
            "id": activity.user_id,
            "name": "张明"  # 实际应用中需查询用户数据库
        }
        activities_data.append(activity_dict)
    
    return jsonify(activities_data)

@activity_bp.route('/activities', methods=['POST'])
def create_activity():
    """创建新活动"""
    data = request.json
    
    # 生成唯一ID
    activity_id = str(uuid.uuid4())
    
    # 创建新活动对象
    new_activity = Activity(
        id=activity_id,
        title=data.get('title'),
        description=data.get('description'),
        points=int(data.get('points', 0)),
        user_id=data.get('user_id', 'user1'),
        status="pending",
        created_at=datetime.utcnow().isoformat()
    )
    
    # 保存到数据库
    db.session.add(new_activity)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "activity": new_activity.to_dict()
    })

@activity_bp.route('/activities/<activity_id>', methods=['GET'])
def get_activity(activity_id):
    """根据ID获取活动"""
    activity = Activity.query.get(activity_id)
    
    if not activity:
        return jsonify({"error": "找不到活动"}), 404
        
    return jsonify(activity.to_dict())

@activity_bp.route('/activities/<activity_id>', methods=['PUT'])
def update_activity(activity_id):
    """更新活动"""
    activity = Activity.query.get(activity_id)
    
    if not activity:
        return jsonify({"error": "找不到活动"}), 404
    
    data = request.json
    
    # 更新活动信息
    if 'title' in data:
        activity.title = data['title']
    if 'description' in data:
        activity.description = data['description']
    if 'points' in data:
        activity.points = int(data['points'])
    if 'status' in data:
        activity.status = data['status']
        if data['status'] == 'completed' and not activity.completed_at:
            activity.completed_at = datetime.utcnow().isoformat()
    
    # 保存更改
    db.session.commit()
    
    return jsonify({
        "success": True,
        "activity": activity.to_dict()
    })

@activity_bp.route('/activities/<activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    """删除活动"""
    activity = Activity.query.get(activity_id)
    
    if not activity:
        return jsonify({"error": "找不到活动"}), 404
    
    # 删除活动
    db.session.delete(activity)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "活动已成功删除"
    })
