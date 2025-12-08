from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSync AI"
    API_V1_STR: str = "/api/v1"
    
    # Defaults for Local Docker
    POSTGRES_SERVER: str = "db"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "skillsync"
    POSTGRES_PORT: str = "5432"

    # Override for Render
    DATABASE_URL: Optional[str] = None

    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # PRIORITY: If Render provides DATABASE_URL, use it directly.
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # Fallback for local
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        case_sensitive = True

settings = Settings()