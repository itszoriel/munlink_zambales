"""
MunLink Zambales - Announcement Model
Database model for municipality announcements
"""
try:
    from apps.api import db
except ImportError:
    from __init__ import db
from datetime import datetime
from sqlalchemy import Index

class Announcement(db.Model):
    """Announcement model for municipality communications."""
    
    __tablename__ = 'announcements'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    municipality_id = db.Column(db.Integer, db.ForeignKey('municipalities.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    priority = db.Column(db.String(20), nullable=False, default='medium')  # high, medium, low
    images = db.Column(db.JSON, nullable=True)
    external_url = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    municipality = db.relationship('Municipality', backref='announcements')
    creator = db.relationship('User', backref='created_announcements')
    
    # Indexes
    __table_args__ = (
        Index('idx_announcement_municipality', 'municipality_id'),
        Index('idx_announcement_active', 'is_active'),
        Index('idx_announcement_priority', 'priority'),
        Index('idx_announcement_created', 'created_at'),
    )
    
    def __repr__(self):
        return f'<Announcement {self.title}>'
    
    def to_dict(self):
        """Convert announcement to dictionary."""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'municipality_id': self.municipality_id,
            'municipality_name': self.municipality.name if self.municipality else None,
            'created_by': self.created_by,
            'creator_name': f"{self.creator.first_name} {self.creator.last_name}" if self.creator else None,
            'priority': self.priority,
            'images': self.images or [],
            'external_url': self.external_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
