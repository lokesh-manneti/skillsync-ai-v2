from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User
from app.models.profile import Profile
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import chat_service

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_with_mentor(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch User Profile to get Context
    result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=400, detail="Please upload a resume first to start chatting.")
        
    # 2. Convert Profile to Dict for Context
    profile_context = {
        "target_role": profile.target_role,
        "experience_level": profile.experience_level,
        "ai_analysis_json": profile.ai_analysis_json
    }

    # 3. Generate Answer
    response_text = await chat_service.generate_chat_response(request.message, profile_context)
    
    return {"response": response_text}