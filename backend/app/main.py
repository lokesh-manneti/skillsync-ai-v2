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
origins = [
    "http://localhost:3000",  # Next.js Frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)

# Register the Auth Router
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

# Register the Profile Router
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Profile"])

app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "SkillSync AI System Operational", "status": "active"}