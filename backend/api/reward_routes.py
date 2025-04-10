import uuid
from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from database import db
from models.reward import Reward, Redemption, RewardSuggestion
from models.user import User

# 创建奖励相关路由的蓝图
reward_bp = Blueprint('reward', __name__, url_prefix='/api/rewards')

@reward_bp.route('/', methods=['GET'])
def get_rewards():
    """获取所有奖励"""
    # 获取分页参数
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # 查询奖励
    pagination = Reward.query.filter_by(available=True).paginate(page=page, per_page=per_page)
    rewards = pagination.items
    
    return jsonify({
        "rewards": [reward.to_dict() for reward in rewards],
        "total": pagination.total,
        "page": page,
        "per_page": per_page
    })

@reward_bp.route('/rewards/<reward_id>', methods=['GET'])
def get_reward(reward_id):
    """获取特定奖励"""
    reward = Reward.query.get(reward_id)
    
    if not reward:
        return jsonify({"error": "找不到奖励"}), 404
        
    return jsonify(reward.to_dict())

@reward_bp.route('/rewards', methods=['POST'])
def create_reward():
    """创建新奖励"""
    data = request.json
    
    # 创建新奖励
    reward_id = str(uuid.uuid4())
    new_reward = Reward(
        id=reward_id,
        name=data.get('name'),
        description=data.get('description'),
        cost=int(data.get('cost', 0)),
        icon=data.get('icon'),
        available=data.get('available', True)
    )
    
    # 保存到数据库
    db.session.add(new_reward)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "reward": new_reward.to_dict()
    })

@reward_bp.route('/rewards/<reward_id>/redeem', methods=['POST'])
def redeem_reward(reward_id):
    """兑换奖励"""
    data = request.json
    user_id = data.get('user_id')
    
    # 查找用户和奖励
    user = User.query.get(user_id)
    reward = Reward.query.get(reward_id)
    
    if not user:
        return jsonify({"error": "找不到用户"}), 404
        
    if not reward:
        return jsonify({"error": "找不到奖励"}), 404
        
    if not reward.available:
        return jsonify({"error": "该奖励不可用"}), 400
        
    # 检查用户积分是否足够
    if user.points < reward.cost:
        return jsonify({
            "success": False,
            "message": "积分不足"
        }), 400
    
    # 扣除用户积分
    user.points -= reward.cost
    
    # 创建兑换记录
    redemption_id = str(uuid.uuid4())
    redemption = Redemption(
        id=redemption_id,
        user_id=user_id,
        reward_id=reward_id,
        timestamp=datetime.utcnow(),
        status="pending"
    )
    
    # 保存更改
    db.session.add(redemption)
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "奖励兑换成功",
        "redemption": redemption.to_dict()
    })

@reward_bp.route('/rewards/redemptions', methods=['GET'])
def get_redemptions():
    """获取兑换记录"""
    user_id = request.args.get('user_id')
    
    # 如果指定了用户ID，只获取该用户的兑换记录
    if user_id:
        redemptions = Redemption.query.filter_by(user_id=user_id).order_by(Redemption.timestamp.desc()).all()
    else:
        redemptions = Redemption.query.order_by(Redemption.timestamp.desc()).all()
    
    return jsonify([redemption.to_dict() for redemption in redemptions])

@reward_bp.route('/rewards/<reward_id>/like', methods=['POST'])
def like_reward(reward_id):
    """为奖励点赞"""
    reward = Reward.query.get(reward_id)
    
    if not reward:
        return jsonify({"error": "找不到奖励"}), 404
    
    # 在实际应用中，应该记录用户的点赞，避免重复点赞
    # 这里简化处理，直接增加likes计数
    if not hasattr(reward, 'likes') or reward.likes is None:
        reward.likes = 0
    
    reward.likes += 1
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "点赞成功",
        "likes": reward.likes
    })

@reward_bp.route('/rewards/<reward_id>/suggest', methods=['POST'])
def suggest_reward_change(reward_id):
    """为现有奖励提出修改建议"""
    data = request.json
    user_id = data.get('user_id', 'anonymous')
    suggestion_text = data.get('suggestion', '')
    suggested_value = data.get('suggested_value')
    
    reward = Reward.query.get(reward_id)
    if not reward and reward_id != 'new':
        return jsonify({"error": "找不到奖励"}), 404
    
    # 创建建议记录
    suggestion_id = str(uuid.uuid4())
    suggestion = RewardSuggestion(
        id=suggestion_id,
        user_id=user_id,
        reward_id=reward_id if reward_id != 'new' else None,
        suggestion_text=suggestion_text,
        suggested_value=suggested_value,
        timestamp=datetime.utcnow(),
        status="pending"
    )
    
    db.session.add(suggestion)
    db.session.commit()
    
    # 记录日志
    current_app.logger.info(f"New reward suggestion: {suggestion_id} for reward {reward_id}")
    
    return jsonify({
        "success": True,
        "message": "建议已提交，感谢您的反馈！",
        "suggestion_id": suggestion_id
    })

@reward_bp.route('/rewards/suggest-new', methods=['POST'])
def suggest_new_reward():
    """提出新奖励建议"""
    data = request.json
    user_id = data.get('user_id', 'anonymous')
    name = data.get('name', '')
    description = data.get('description', '')
    category = data.get('category', '')
    suggested_value = data.get('suggested_value')
    suggestion_text = data.get('suggestion', '')
    
    # 创建建议记录
    suggestion_id = str(uuid.uuid4())
    suggestion = RewardSuggestion(
        id=suggestion_id,
        user_id=user_id,
        reward_id=None,  # 新奖励没有关联的现有奖励ID
        suggestion_text=suggestion_text,
        name=name,
        description=description,
        category=category,
        suggested_value=suggested_value,
        timestamp=datetime.utcnow(),
        status="pending",
        is_new_reward=True
    )
    
    db.session.add(suggestion)
    db.session.commit()
    
    # 记录日志
    current_app.logger.info(f"New reward suggestion for a new reward: {suggestion_id}")
    
    return jsonify({
        "success": True,
        "message": "新奖励建议已提交，感谢您的反馈！",
        "suggestion_id": suggestion_id
    })
