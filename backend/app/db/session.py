from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    future=True,
    echo=True,
    connect_args={
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
        "ssl": "require",  # <--- FORCE SSL CONNECTION
    }
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session