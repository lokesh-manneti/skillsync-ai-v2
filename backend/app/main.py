from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, profile, chat


app = FastAPI(
    title="SkillSync AI API",
    version="2.0.0",
    description="Clean Architecture Backend for SkillSync AI"
)

# ---------------------------------------------------------
# NEW: CORS Configuration
# This tells the browser: "Allow requests from localhost:3000"
# ---------------------------------------------------------
# ...
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://skillsync-ai.in",           # Your Custom Domain
    "https://www.skillsync-ai.in",       # Your Custom Domain (www)
    "https://skillsync-ai-v2.vercel.app", # Your Vercel URL (guessing based on repo name)
    "*"                                  # Fallback: Allow ALL (Easiest for debugging)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TEMPORARY: Allow all to ensure it works immediately
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ...

# Register the Auth Router
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

# Register the Profile Router
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Profile"])

app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "SkillSync AI System Operational", "status": "active"}