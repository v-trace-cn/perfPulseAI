"""
User model for the PerfPulseAI application.
"""
from database import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """User model representing a user in the system."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    department = db.Column(db.String(100))
    position = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    join_date = db.Column(db.Date, default=datetime.utcnow)
    points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    completed_tasks = db.Column(db.Integer, default=0)
    pending_tasks = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联关系
    activities = db.relationship('Activity', backref='user', lazy=True)
    
    def __init__(self, name, email, password=None, department=None, position=None, 
                 phone=None, join_date=None, points=0, level=1):
        """
        Initialize a new User.
        """
        self.name = name
        self.email = email
        if password:
            self.set_password(password)
        self.department = department
        self.position = position
        self.phone = phone
        self.join_date = join_date if join_date else datetime.utcnow()
        self.points = points
        self.level = level
        self.completed_tasks = 0
        self.pending_tasks = 0
    
    def set_password(self, password):
        """设置密码哈希"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """验证密码"""
        return check_password_hash(self.password_hash, password)
        
    def to_dict(self):
        """
        Convert the user object to a dictionary.
        
        Returns:
            dict: Dictionary representation of the user
        """
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "position": self.position,
            "phone": self.phone,
            "joinDate": self.join_date.isoformat() if isinstance(self.join_date, datetime) else self.join_date,
            "points": self.points,
            "level": self.level,
            "completedTasks": self.completed_tasks,
            "pendingTasks": self.pending_tasks,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }
