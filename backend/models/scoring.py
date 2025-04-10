import uuid
from datetime import datetime
from database import db

class ScoringCriteria(db.Model):
    """积分评分标准模型"""
    __tablename__ = 'scoring_criteria'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    base_points = db.Column(db.Integer, default=0)
    weight = db.Column(db.Float, default=1.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "description": self.description,
            "base_points": self.base_points,
            "weight": self.weight
        }

class ScoringFactor(db.Model):
    """评分因素模型"""
    __tablename__ = 'scoring_factors'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    label = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # select, number, checkbox, etc.
    options = db.Column(db.JSON, nullable=True)  # 存储选项的JSON数据
    min_value = db.Column(db.Integer, nullable=True)
    max_value = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        result = {
            "id": self.id,
            "label": self.label,
            "description": self.description,
            "type": self.type
        }
        
        if self.options:
            result["options"] = self.options
            
        if self.type == "number":
            if self.min_value is not None:
                result["min"] = self.min_value
            if self.max_value is not None:
                result["max"] = self.max_value
                
        return result

class ScoreEntry(db.Model):
    """评分记录模型"""
    __tablename__ = 'score_entries'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    activity_id = db.Column(db.String(36), db.ForeignKey('activities.id'), nullable=True)
    criteria_id = db.Column(db.String(36), db.ForeignKey('scoring_criteria.id'), nullable=True)
    score = db.Column(db.Integer, nullable=False)
    factors = db.Column(db.JSON, nullable=True)  # 存储评分因素的JSON数据
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关联关系
    user = db.relationship('User', backref=db.backref('scores', lazy=True))
    activity = db.relationship('Activity', backref=db.backref('scores', lazy=True))
    criteria = db.relationship('ScoringCriteria', backref=db.backref('score_entries', lazy=True))
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "activity_id": self.activity_id,
            "criteria_id": self.criteria_id,
            "score": self.score,
            "factors": self.factors,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        }

class GovernanceMetric(db.Model):
    """治理指标模型"""
    __tablename__ = 'governance_metrics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dimension = db.Column(db.String(50), nullable=False)  # department, global, etc.
    metric_name = db.Column(db.String(50), nullable=False)  # 代码质量, 文档完整性, etc.
    value = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "dimension": self.dimension,
            "metric_name": self.metric_name,
            "value": self.value,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }
