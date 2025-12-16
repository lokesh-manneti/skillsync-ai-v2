import copy 
import datetime 
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.profile import ProfileResponse, RoadmapItemUpdate, ResumeOptimizationResponse
from app.services import resume_service
from app.api.v1.endpoints.auth import get_current_user
from app.services import ai_service
from fastapi.encoders import jsonable_encoder

router = APIRouter()

# --- HELPER: Rate Limiting Logic ---
def check_and_update_limit(profile: Profile, action: str):
    today = datetime.date.today()
    
    # 1. Reset counters if it's a new day
    if profile.last_activity_date != today:
        profile.daily_upload_count = 0
        profile.daily_optimize_count = 0
        profile.last_activity_date = today
    
    # 2. Define Limits
    LIMITS = {
        "upload": 2,
        "optimize": 3
    }
    
    # 3. Check specific limit
    if action == "upload":
        if profile.daily_upload_count >= LIMITS["upload"]:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Daily upload limit reached ({LIMITS['upload']}/day). Please try again tomorrow."
            )
        profile.daily_upload_count += 1
        
    elif action == "optimize":
        if profile.daily_optimize_count >= LIMITS["optimize"]:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Daily optimization limit reached ({LIMITS['optimize']}/day). Please try again tomorrow."
            )
        profile.daily_optimize_count += 1
    
    return profile
# -----------------------------------

@router.post("/upload", response_model=ProfileResponse)
async def upload_resume(
    target_role: str = Form(...),
    experience_level: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Validate File Type first (Cheap check)
    if file.content_type != "application/pdf":
        raise HTTPException(400, detail="Only PDF files are supported")

    # 2. Fetch existing profile EARLY to check limits
    result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    existing_profile = result.scalars().first()

    # 3. Check Rate Limit (If profile exists)
    if existing_profile:
        # This will raise HTTP 429 if limit exceeded
        check_and_update_limit(existing_profile, "upload") 

    # 4. Parse PDF (Expensive Operation)
    text_content = await resume_service.parse_pdf(file)
    
    if len(text_content) < 50:
        raise HTTPException(400, detail="Resume content is too short or unreadable.")

    # 5. Call Gemini AI (Expensive Operation)
    try:
        ai_result = await ai_service.generate_career_analysis(
            resume_text=text_content,
            target_role=target_role,
            experience_level=experience_level
        )
    except Exception as e:
        print(f"CRITICAL AI ERROR: {e}")
        ai_result = {"error": "AI analysis failed", "details": str(e)}

    # 6. Save/Update Profile
    if existing_profile:
        existing_profile.target_role = target_role
        existing_profile.experience_level = experience_level
        existing_profile.resume_text_content = text_content
        existing_profile.ai_analysis_json = ai_result
        # Note: count was already incremented in step 3
        
        db.add(existing_profile)
        await db.commit()
        await db.refresh(existing_profile)
        return existing_profile
    else:
        # First time upload
        new_profile = Profile(
            user_id=current_user.id,
            target_role=target_role,
            experience_level=experience_level,
            resume_text_content=text_content,
            ai_analysis_json=ai_result,
            daily_upload_count=1, # Start at 1
            last_activity_date=datetime.date.today()
        )
        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)
        return new_profile

@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Profile)
        .options(selectinload(Profile.user))
        .filter(Profile.user_id == current_user.id)
    )
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    response_data = jsonable_encoder(profile)
    response_data["full_name"] = profile.user.full_name if profile.user else "Unknown"
    response_data["email"] = profile.user.email if profile.user else "Unknown"
        
    return response_data

@router.patch("/roadmap/toggle")
async def toggle_roadmap_item(
    update_data: RoadmapItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(404, "Profile not found")

    ai_data = copy.deepcopy(profile.ai_analysis_json)
    
    try:
        target_phase = ai_data['roadmap'][update_data.phase_index]
        target_item = target_phase['action_items'][update_data.item_index]
        target_item['completed'] = update_data.completed
        
        profile.ai_analysis_json = ai_data
        
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(profile, "ai_analysis_json")
        
        db.add(profile)
        await db.commit()
        
        return {"status": "success", "updated_roadmap": ai_data['roadmap']}
        
    except (IndexError, KeyError, TypeError) as e:
        print(f"Update Error: {e}")
        raise HTTPException(400, detail=f"Invalid roadmap index or structure: {str(e)}")


@router.post("/optimize_resume", response_model=ResumeOptimizationResponse)
async def optimize_resume(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch Profile
    result = await db.execute(select(Profile).filter(Profile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(404, "Profile not found")

    # 2. Check Rate Limit
    # This raises 429 if blocked
    check_and_update_limit(profile, "optimize")

    # 3. Save the incremented count IMMEDIATELY
    # We do this before calling AI to prevent "race condition" spamming
    db.add(profile)
    await db.commit() 
    
    # 4. Extract Completed Tasks
    completed_tasks = []
    roadmap = profile.ai_analysis_json.get("roadmap", [])
    
    for phase in roadmap:
        for item in phase.get("action_items", []):
            if isinstance(item, dict) and item.get("completed") is True:
                completed_tasks.append(item.get("task"))

    # 5. Call AI Service
    optimized_text = await ai_service.generate_optimized_resume(
        original_text=profile.resume_text_content,
        target_role=profile.target_role,
        completed_tasks=completed_tasks
    )
    
    return {"optimized_content": optimized_text}