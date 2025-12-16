import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Integer, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Career Goals
    target_role = Column(String, nullable=False)
    experience_level = Column(String, nullable=False) # e.g., "Fresher", "2+ Years"
    
    # The Parsed Data (We store the raw text for the AI to read)
    resume_text_content = Column(Text, nullable=False)
    # NEW: AI Analysis Result
    ai_analysis_json = Column(JSON, nullable=True)
    
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


    daily_upload_count = Column(Integer, default=0)
    daily_optimize_count = Column(Integer, default=0)
    last_activity_date = Column(Date, default=datetime.date.today)

    # Relationship back to User
    user = relationship("User", backref="profile")