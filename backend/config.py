"""
TrafficLens Backend Configuration
Modern FastAPI backend for AI-powered traffic analysis
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TrafficLens"
    PROJECT_DESCRIPTION: str = "AI-Powered Traffic Video Analytics Platform"
    VERSION: str = "1.0.0"
    
    # Server Configuration
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # Database Configuration (using Supabase - see below)
    # DATABASE_URL: str = "postgresql://traffic_user:traffic_password@localhost:5432/trafficlens"
    # DATABASE_ECHO: bool = False
    
    # Supabase Configuration
    SUPABASE_URL: str = "https://bfbfuuoctzfaaanknaih.supabase.co"
    SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYmZ1dW9jdHpmYWFhbmtuYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjEyMjcsImV4cCI6MjA4OTEzNzIyN30.c1WDlNCMH9LxcQYG7Ut3nKcRoj_n4V4PgiLraLmZKgU"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # File Upload Configuration
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024 * 1024  # 5GB
    ALLOWED_VIDEO_FORMATS: list = ["mp4", "mov", "avi", "mkv"]
    UPLOAD_DIRECTORY: str = "uploads"
    PROCESSED_DIRECTORY: str = "processed"
    
    # AI Model Configuration
    YOLO_MODEL: str = "yolov8x.pt"  # Extra large YOLOv8 model
    CONFIDENCE_THRESHOLD: float = 0.5
    IOU_THRESHOLD: float = 0.45
    
    # Video Processing
    TARGET_FPS: int = 30
    FRAME_SKIP: int = 1  # Process every frame
    VIDEO_CODEC: str = "mp4v"
    FAST_PROCESSING: bool = True  # Skip frames for faster testing (5 frame skip)
    
    # CORS Configuration
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Tracking Configuration
    TRACK_METHOD: str = "bytetrack"  # bytetrack or sort
    MAX_AGE: int = 30
    MIN_HITS: int = 3
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
