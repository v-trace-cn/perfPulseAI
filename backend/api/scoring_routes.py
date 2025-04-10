import uuid
from datetime import datetime
from flask import Blueprint, jsonify, request

from database import db
from models.scoring import ScoringCriteria, ScoringFactor, ScoreEntry, GovernanceMetric
from models.user import User
from models.activity import Activity


# 创建评分相关路由的蓝图
scoring_bp = Blueprint('scoring', __name__, url_prefix='/api/scoring')

# Sample scoring criteria
scoring_criteria = [
    {
        "id": "1", 
        "category": "代码提交", 
        "description": "提交高质量的代码到仓库", 
        "base_points": 10, 
        "weight": 1.0
    },
    {
        "id": "2", 
        "category": "代码审查", 
        "description": "对他人代码进行有效审查", 
        "base_points": 5, 
        "weight": 0.8
    },
    {
        "id": "3", 
        "category": "文档贡献", 
        "description": "编写或更新项目文档", 
        "base_points": 8, 
        "weight": 0.7
    },
    {
        "id": "4", 
        "category": "问题解决", 
        "description": "解决项目中的bug或技术问题", 
        "base_points": 15, 
        "weight": 1.2
    },
    {
        "id": "5", 
        "category": "知识分享", 
        "description": "分享技术文章或举办培训", 
        "base_points": 20, 
        "weight": 1.5
    }
]

# Sample scoring factors
scoring_factors = [
    {
        "id": "1",
        "label": "代码质量",
        "description": "代码的质量和可维护性",
        "type": "select",
        "options": [
            {"label": "低", "value": "low"},
            {"label": "中", "value": "medium"},
            {"label": "高", "value": "high"}
        ]
    },
    {
        "id": "2",
        "label": "完成时间",
        "description": "任务完成所需的时间",
        "type": "number",
        "min": 1,
        "max": 100
    },
    {
        "id": "3",
        "label": "创新程度",
        "description": "解决方案的创新程度",
        "type": "select",
        "options": [
            {"label": "常规", "value": "standard"},
            {"label": "改进", "value": "improved"},
            {"label": "创新", "value": "innovative"}
        ]
    },
    {
        "id": "4",
        "label": "团队协作",
        "description": "是否促进了团队协作",
        "type": "checkbox"
    }
]

@scoring_bp.route('/criteria', methods=['GET'])
def get_scoring_criteria():
    """获取所有积分评分标准"""
    criteria = ScoringCriteria.query.all()
    return jsonify([criterion.to_dict() for criterion in criteria])

@scoring_bp.route('/factors', methods=['GET'])
def get_scoring_factors():
    """获取所有评分因素"""
    factors = ScoringFactor.query.all()
    return jsonify([factor.to_dict() for factor in factors])

@scoring_bp.route('/calculate', methods=['POST'])
def calculate_score():
    """根据输入因素计算得分"""
    data = request.json
    user_id = data.get('user_id')
    activity_id = data.get('activity_id')
    factor_values = {k: v for k, v in data.items() if k not in ['user_id', 'activity_id', 'notes']}
    notes = data.get('notes', '')
    
    # 计算基础分数
    base_score = 50
    
    # 应用因素调整
    if factor_values.get('1') == 'high':
        base_score += 20
    elif factor_values.get('1') == 'medium':
        base_score += 10
    
    if factor_values.get('2'):
        time_factor = int(factor_values.get('2'))
        if time_factor < 30:
            base_score += 15
        elif time_factor < 60:
            base_score += 5
    
    if factor_values.get('3') == 'innovative':
        base_score += 25
    elif factor_values.get('3') == 'improved':
        base_score += 10
    
    if factor_values.get('4') == 1:
        base_score += 15
    
    # 创建分数明细
    breakdown = [
        {
            "category": "基础评分",
            "raw_score": 50,
            "weight": 1.0,
            "weighted_score": 50
        },
        {
            "category": "质量调整",
            "raw_score": 20 if factor_values.get('1') == 'high' else (10 if factor_values.get('1') == 'medium' else 0),
            "weight": 1.2,
            "weighted_score": 24 if factor_values.get('1') == 'high' else (12 if factor_values.get('1') == 'medium' else 0)
        },
        {
            "category": "时间效率",
            "raw_score": 15 if factor_values.get('2') and int(factor_values.get('2')) < 30 else (5 if factor_values.get('2') and int(factor_values.get('2')) < 60 else 0),
            "weight": 0.8,
            "weighted_score": 12 if factor_values.get('2') and int(factor_values.get('2')) < 30 else (4 if factor_values.get('2') and int(factor_values.get('2')) < 60 else 0)
        },
        {
            "category": "创新加分",
            "raw_score": 25 if factor_values.get('3') == 'innovative' else (10 if factor_values.get('3') == 'improved' else 0),
            "weight": 1.5,
            "weighted_score": 37.5 if factor_values.get('3') == 'innovative' else (15 if factor_values.get('3') == 'improved' else 0)
        },
        {
            "category": "团队协作",
            "raw_score": 15 if factor_values.get('4') == 1 else 0,
            "weight": 1.0,
            "weighted_score": 15 if factor_values.get('4') == 1 else 0
        }
    ]
    
    # 计算最终得分
    final_score = sum(item["weighted_score"] for item in breakdown)
    rounded_score = round(final_score)
    
    # 如果提供了用户ID和活动ID，保存评分记录到数据库
    if user_id and activity_id:
        # 检查用户和活动是否存在
        user = User.query.get(user_id)
        activity = Activity.query.get(activity_id)
        
        if user and activity:
            # 创建评分记录
            score_entry = ScoreEntry(
                id=str(uuid.uuid4()),
                user_id=user_id,
                activity_id=activity_id,
                score=rounded_score,
                factors=factor_values,
                notes=notes
            )
            
            # 更新用户积分
            user.points += rounded_score
            
            # 保存到数据库
            db.session.add(score_entry)
            db.session.commit()
    
    return jsonify({
        "success": True,
        "score": rounded_score,
        "breakdown": breakdown
    })

@scoring_bp.route('/entries', methods=['GET'])
def get_score_entries():
    """获取评分记录"""
    user_id = request.args.get('user_id')
    activity_id = request.args.get('activity_id')
    
    # 构建查询
    query = ScoreEntry.query
    
    if user_id:
        query = query.filter_by(user_id=user_id)
    
    if activity_id:
        query = query.filter_by(activity_id=activity_id)
    
    # 获取结果
    entries = query.order_by(ScoreEntry.created_at.desc()).all()
    
    return jsonify([entry.to_dict() for entry in entries])

@scoring_bp.route('/governance-metrics', methods=['GET'])
def get_governance_metrics():
    """获取治理指标用于分析图表"""
    dimension = request.args.get('dimension', 'department')
    
    # 查询数据库中的指标
    metrics = GovernanceMetric.query.filter_by(dimension=dimension).all()
    
    # 如果没有找到指标，返回示例数据
    if not metrics:
        sample_metrics = {
            "department": {
                "labels": ['代码质量', '文档完整性', '安全合规', '性能效率', '可维护性', '可扩展性'],
                "values": [85, 92, 88, 76, 90, 82],
                "governance_index": 89.5
            },
            "global": {
                "labels": ['代码质量', '文档完整性', '安全合规', '性能效率', '可维护性', '可扩展性'],
                "values": [80, 85, 92, 88, 78, 86],
                "governance_index": 86.3
            }
        }
        
        return jsonify(sample_metrics.get(dimension, sample_metrics["department"]))
    
    # 处理从数据库查询的指标
    metric_dict = {}
    metric_dict["labels"] = []
    metric_dict["values"] = []
    
    for metric in metrics:
        metric_dict["labels"].append(metric.metric_name)
        metric_dict["values"].append(metric.value)
    
    # 计算治理指数
    if metric_dict["values"]:
        metric_dict["governance_index"] = round(sum(metric_dict["values"]) / len(metric_dict["values"]), 1)
    else:
        metric_dict["governance_index"] = 0
    
    return jsonify(metric_dict)

@scoring_bp.route('/governance-metrics', methods=['POST'])
def create_governance_metric():
    """创建或更新治理指标"""
    data = request.json
    dimension = data.get('dimension')
    metric_name = data.get('metric_name')
    value = data.get('value')
    
    if not all([dimension, metric_name, value]):
        return jsonify({
            "success": False,
            "message": "缺少必填字段"
        }), 400
    
    # 查找现有指标
    existing_metric = GovernanceMetric.query.filter_by(
        dimension=dimension,
        metric_name=metric_name
    ).first()
    
    if existing_metric:
        # 更新现有指标
        existing_metric.value = value
        existing_metric.timestamp = datetime.utcnow()
    else:
        # 创建新指标
        new_metric = GovernanceMetric(
            id=str(uuid.uuid4()),
            dimension=dimension,
            metric_name=metric_name,
            value=value
        )
        db.session.add(new_metric)
    
    db.session.commit()
    
    return jsonify({
        "success": True,
        "message": "指标已保存"
    })
