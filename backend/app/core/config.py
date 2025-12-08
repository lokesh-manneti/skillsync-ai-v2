from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSync AI"
    API_V1_STR: str = "/api/v1"
    
    # 1. Database Variables (Individual parts - Defaults for Local Docker)
    POSTGRES_SERVER: str = "db"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "skillsync"
    POSTGRES_PORT: str = "5432"

    # 2. Database URL Override (For Render/Production)
    # We make this Optional so it doesn't crash locally if missing
    DATABASE_URL: Optional[str] = None

    # 3. Security
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_TO_A_REAL_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 4. Google Cloud (Optional defaults to prevent crash if missing)
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # PRIORITY 1: If a full DATABASE_URL is provided (like in Render), use it.
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # PRIORITY 2: Build it from parts (like in Docker Compose / Local)
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True

settings = Settings()