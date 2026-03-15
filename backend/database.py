"""
Database session and connection management
Using Supabase for all data storage
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

logger.info("Using Supabase for database operations")
logger.info(f"Supabase URL: {settings.SUPABASE_URL}")

# Database engine (optional - not used with Supabase)
engine = None
SessionLocal = None


def get_db() -> Session:
    """
    Dependency for getting database session.
    Note: Currently using Supabase - this is kept for compatibility only.
    
    Usage in FastAPI routes:
    
    @router.get("/items/")
    def get_items(db: Session = Depends(get_db)):
        # Use Supabase client instead
        return db
    """
    # Return None since we're using Supabase
    return None
