from pydantic import BaseModel
from datetime import datetime
from typing import Any

class ProfileBase(BaseModel):
    target_role: str
    experience_level: str

# What we return to the frontend
class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    resume_text_content: str
    ai_analysis_json: Any | None = None # <--- Add this field
    updated_at: datetime | None

    class Config:
        from_attributes = True


class RoadmapItemUpdate(BaseModel):
    phase_index: int
    item_index: int
    completed: bool

class ResumeOptimizationResponse(BaseModel):
    optimized_content: str
