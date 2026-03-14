"""
API routes for video management
"""

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import shutil
from pathlib import Path
import logging

from database import get_db
from models import Video, VideoStatusEnum, ProcessingJob, Analysis
from schemas import VideoResponse, VideoDetailResponse, VideoUploadResponse, ProcessingJobResponse
from config import get_settings
from tasks import process_video_task

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/videos", tags=["videos"])
settings = get_settings()


@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """
    Upload a video file for processing
    
    Args:
        file: Video file to upload
        db: Database session
        background_tasks: FastAPI background tasks
    
    Returns:
        VideoUploadResponse with video details
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in settings.ALLOWED_VIDEO_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"File type .{file_ext} not allowed. Allowed: {', '.join(settings.ALLOWED_VIDEO_FORMATS)}"
            )
        
        # Create upload directory
        os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
        
        # Generate unique filename
        video_id = str(uuid.uuid4())
        file_ext = file.filename.split(".")[-1]
        saved_filename = f"{video_id}.{file_ext}"
        file_path = os.path.join(settings.UPLOAD_DIRECTORY, saved_filename)
        
        # Save file
        try:
            file_size = 0
            with open(file_path, "wb") as buffer:
                while chunk := await file.read(1024 * 1024):  # 1MB chunks
                    buffer.write(chunk)
                    file_size += len(chunk)
            
            if file_size == 0:
                raise HTTPException(status_code=400, detail="Uploaded file is empty")
            
            if file_size > settings.MAX_UPLOAD_SIZE:
                os.remove(file_path)
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / (1024**3):.1f} GB"
                )
        
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
        
        # Create video record
        db_video = Video(
            id=video_id,
            filename=saved_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=file_size,
            status=VideoStatusEnum.UPLOADED
        )
        db.add(db_video)
        db.flush()
        
        # Create processing job
        db_job = ProcessingJob(
            video_id=video_id,
            status="pending"
        )
        db.add(db_job)
        db.commit()
        
        logger.info(f"Video uploaded: {video_id}, size: {file_size} bytes")
        
        # Queue background processing task
        if background_tasks:
            background_tasks.add_task(start_video_processing, video_id, file_path, db)
        
        return VideoUploadResponse(
            id=video_id,
            filename=saved_filename,
            file_size=file_size,
            status=VideoStatusEnum.UPLOADED,
            message="Video uploaded successfully. Processing queued."
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Video upload error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/{video_id}", response_model=VideoDetailResponse)
def get_video(video_id: str, db: Session = Depends(get_db)):
    """Get video details by ID"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@router.get("/", response_model=List[VideoResponse])
def list_videos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all videos"""
    videos = db.query(Video).offset(skip).limit(limit).all()
    return videos


@router.delete("/{video_id}")
def delete_video(video_id: str, db: Session = Depends(get_db)):
    """Delete a video and its data"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Delete files
    if video.file_path and os.path.exists(video.file_path):
        try:
            os.remove(video.file_path)
        except Exception as e:
            logger.error(f"Failed to delete file {video.file_path}: {e}")
    
    # Delete database record (cascades to related records)
    db.delete(video)
    db.commit()
    
    return {"message": "Video deleted successfully"}


def start_video_processing(video_id: str, file_path: str, db: Session):
    """Start video processing task"""
    try:
        # Send Celery task
        task = process_video_task.delay(video_id, file_path)
        
        # Update job with task ID
        job = db.query(ProcessingJob).filter(ProcessingJob.video_id == video_id).first()
        if job:
            job.celery_task_id = task.id
            job.status = "processing"
            db.commit()
        
        logger.info(f"Video processing task started: {task.id}")
    except Exception as e:
        logger.error(f"Failed to queue processing task: {e}")
        # Update job status
        job = db.query(ProcessingJob).filter(ProcessingJob.video_id == video_id).first()
        if job:
            job.status = "failed"
            job.error_message = str(e)
            db.commit()
