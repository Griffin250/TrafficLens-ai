"""
Main FastAPI application
TrafficLens Backend - AI-Powered Traffic Analysis
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from contextlib import asynccontextmanager

from config import get_settings
from models import Base
from database import engine
from routes import videos, analytics, health

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


# ==================== Lifespan events ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context manager"""
    # Startup
    logger.info("Starting TrafficLens Backend...")
    
    # Create database tables (only if engine is available)
    if engine:
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Failed to create database tables: {e}")
    else:
        logger.warning("Database engine not available - skipping table creation")
    
    # Create required directories
    os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
    os.makedirs(settings.PROCESSED_DIRECTORY, exist_ok=True)
    logger.info(f"Created upload directory: {settings.UPLOAD_DIRECTORY}")
    logger.info(f"Created processed directory: {settings.PROCESSED_DIRECTORY}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down TrafficLens Backend...")


# ==================== FastAPI Application ====================

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)


# ==================== CORS Middleware ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Static Files ====================

# Serve processed videos
os.makedirs(settings.PROCESSED_DIRECTORY, exist_ok=True)
app.mount("/processed", StaticFiles(directory=settings.PROCESSED_DIRECTORY), name="processed")

# Serve uploads (if needed)
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
# Note: Don't typically expose uploads, but available if needed
# app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIRECTORY), name="uploads")


# ==================== API Routes ====================

# Health check routes
app.include_router(health.router)

# API v1 routes
app.include_router(videos.router)
app.include_router(analytics.router)


# ==================== Root Endpoint ====================

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} Backend",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }


# ==================== Startup and Shutdown ====================

@app.on_event("startup")
async def startup_event():
    """On startup event"""
    logger.info(f"{settings.PROJECT_NAME} v{settings.VERSION} started")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Database: {settings.DATABASE_URL}")


@app.on_event("shutdown")
async def shutdown_event():
    """On shutdown event"""
    logger.info(f"{settings.PROJECT_NAME} shutting down")


# ==================== Error Handlers ====================

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return {
        "status_code": 500,
        "detail": "Internal server error",
        "message": str(exc) if settings.DEBUG else "An error occurred"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level="info"
    )
