"""
Activity model for the PerfPulseAI application.
"""

from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Activity(Base):
    """Activity model representing an activity in the system."""
    __tablename__ = 'activities'
    
    id = Column(String(36), primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    points = Column(Integer, default=0)
    user_id = Column(String(36), ForeignKey('users.id'))
    status = Column(String(20), default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, id, title, description, points, user_id=None, 
                 status="pending", created_at=None, completed_at=None):
        """
        Initialize a new Activity.
        """
        self.id = id
        self.title = title
        self.description = description
        self.points = points
        self.user_id = user_id
        self.status = status
        
        # 处理日期字段
        if isinstance(created_at, str):
            try:
                self.created_at = datetime.fromisoformat(created_at)
            except ValueError:
                self.created_at = datetime.utcnow()
        elif created_at is None:
            self.created_at = datetime.utcnow()
        else:
            self.created_at = created_at
            
        if isinstance(completed_at, str):
            try:
                self.completed_at = datetime.fromisoformat(completed_at)
            except ValueError:
                self.completed_at = None
        else:
            self.completed_at = completed_at
        
    def to_dict(self):
        """
        Convert the activity object to a dictionary.
        
        Returns:
            dict: Dictionary representation of the activity
        """
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "points": self.points,
            "user_id": self.user_id,
            "status": self.status,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            "completed_at": self.completed_at.isoformat() if isinstance(self.completed_at, datetime) else self.completed_at,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """
        Create an activity object from a dictionary.
        
        Args:
            data (dict): Dictionary containing activity data
            
        Returns:
            Activity: New activity object
        """
        return cls(
            id=data.get("id"),
            title=data.get("title"),
            description=data.get("description"),
            points=data.get("points", 0),
            user_id=data.get("user_id"),
            status=data.get("status", "pending"),
            created_at=data.get("created_at"),
            completed_at=data.get("completed_at")
        )
