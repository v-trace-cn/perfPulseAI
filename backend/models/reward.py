"""
Reward model for the PerfPulseAI application.
"""
from datetime import datetime
from database import db

class Reward(db.Model):
    """Reward model representing a reward in the system."""
    __tablename__ = 'rewards'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    cost = db.Column(db.Integer, nullable=False)
    icon = db.Column(db.String(200))
    available = db.Column(db.Boolean, default=True)
    category = db.Column(db.String(50))
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联关系
    redemptions = db.relationship('Redemption', backref='reward', lazy=True)
    suggestions = db.relationship('RewardSuggestion', backref='reward', lazy=True)
    
    def __init__(self, id, name, description, cost, icon=None, available=True):
        """
        Initialize a new Reward.
        """
        self.id = id
        self.name = name
        self.description = description
        self.cost = cost
        self.icon = icon
        self.available = available
        
    def to_dict(self):
        """
        Convert the reward object to a dictionary.
        
        Returns:
            dict: Dictionary representation of the reward
        """
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "cost": self.cost,
            "icon": self.icon,
            "available": self.available,
            "category": self.category,
            "likes": self.likes or 0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class Redemption(db.Model):
    """Redemption model representing a reward redemption in the system."""
    __tablename__ = 'redemptions'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    reward_id = db.Column(db.String(36), db.ForeignKey('rewards.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, id, user_id, reward_id, timestamp=None, status="pending"):
        """
        Initialize a new Redemption.
        """
        self.id = id
        self.user_id = user_id
        self.reward_id = reward_id
        
        # 处理日期字段
        if isinstance(timestamp, str):
            try:
                self.timestamp = datetime.fromisoformat(timestamp)
            except ValueError:
                self.timestamp = datetime.utcnow()
        elif timestamp is None:
            self.timestamp = datetime.utcnow()
        else:
            self.timestamp = timestamp
            
        self.status = status
        
    def to_dict(self):
        """
        Convert the redemption object to a dictionary.
        
        Returns:
            dict: Dictionary representation of the redemption
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "reward_id": self.reward_id,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class RewardSuggestion(db.Model):
    """Model for user suggestions about rewards."""
    __tablename__ = 'reward_suggestions'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)  # Nullable to allow anonymous suggestions
    reward_id = db.Column(db.String(36), db.ForeignKey('rewards.id'), nullable=True)  # Nullable for new reward suggestions
    suggestion_text = db.Column(db.Text, nullable=False)
    suggested_value = db.Column(db.Integer, nullable=True)
    name = db.Column(db.String(100), nullable=True)  # For new reward suggestions
    description = db.Column(db.Text, nullable=True)  # For new reward suggestions
    category = db.Column(db.String(50), nullable=True)  # For new reward suggestions
    is_new_reward = db.Column(db.Boolean, default=False)  # Flag to indicate if this is a suggestion for a new reward
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, id, user_id, reward_id=None, suggestion_text='', suggested_value=None, 
                 name=None, description=None, category=None, is_new_reward=False, 
                 timestamp=None, status="pending"):
        """
        Initialize a new RewardSuggestion.
        """
        self.id = id
        self.user_id = user_id
        self.reward_id = reward_id
        self.suggestion_text = suggestion_text
        self.suggested_value = suggested_value
        self.name = name
        self.description = description
        self.category = category
        self.is_new_reward = is_new_reward
        
        # 处理日期字段
        if isinstance(timestamp, str):
            try:
                self.timestamp = datetime.fromisoformat(timestamp)
            except ValueError:
                self.timestamp = datetime.utcnow()
        elif timestamp is None:
            self.timestamp = datetime.utcnow()
        else:
            self.timestamp = timestamp
            
        self.status = status
        
    def to_dict(self):
        """
        Convert the suggestion object to a dictionary.
        
        Returns:
            dict: Dictionary representation of the suggestion
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "reward_id": self.reward_id,
            "suggestion_text": self.suggestion_text,
            "suggested_value": self.suggested_value,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "is_new_reward": self.is_new_reward,
            "status": self.status,
            "timestamp": self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
