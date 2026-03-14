"""
Health check and utility endpoints
"""

from fastapi import APIRouter, Depends
from datetime import datetime
from sqlalchemy.orm import Session

from database import get_db
from config import get_settings

router = APIRouter(tags=["health"])
settings = get_settings()


@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }


@router.get("/api/v1/health")
def api_health_check(db: Session = Depends(get_db)):
    """API health check with database connectivity"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status
    }


@router.get("/config")
def get_config():
    """Get non-sensitive configuration"""
    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "max_upload_size_gb": settings.MAX_UPLOAD_SIZE / (1024**3),
        "allowed_video_formats": settings.ALLOWED_VIDEO_FORMATS,
        "yolo_model": settings.YOLO_MODEL,
        "confidence_threshold": settings.CONFIDENCE_THRESHOLD,
        "target_fps": settings.TARGET_FPS
    }
