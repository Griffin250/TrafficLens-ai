"""
Database session and connection management
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

# Use synchronous psycopg2 driver (more compatible)
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql+asyncpg://"):
    database_url = database_url.replace("postgresql+asyncpg://", "postgresql://", 1)
elif not database_url.startswith("postgresql://"):
    database_url = f"postgresql://{database_url.split('://')[-1]}"

# Create database engine with error handling
try:
    engine = create_engine(
        database_url,
        echo=settings.DATABASE_ECHO,
        pool_pre_ping=True,
        pool_recycle=3600,
    )
    logger.info(f"Database engine created: {database_url.split('@')[0]}@...")
except Exception as e:
    logger.warning(f"Could not create database engine: {e}")
    logger.warning("Database operations will fail until PostgreSQL is available")
    engine = None

# Create session factory
if engine:
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
else:
    SessionLocal = None


def get_db() -> Session:
    """
    Dependency for getting database session.
    Usage in FastAPI routes:
    
    @router.get("/items/")
    def get_items(db: Session = Depends(get_db)):
        return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
