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


@router.post("/process/{video_id}")
async def process_video(
    video_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Trigger video processing for Supabase uploads.
    This endpoint is called by the Supabase edge function.
    """
    logger.info(f"[PROCESS_ENDPOINT] Received processing request for video: {video_id}")
    
    try:
        # First check local database
        video = None
        if db:
            try:
                logger.info(f"[PROCESS_ENDPOINT] Checking local database for video...")
                video = db.query(Video).filter(Video.id == video_id).first()
                if video:
                    logger.info(f"[PROCESS_ENDPOINT] Found video in local database")
                else:
                    logger.info(f"[PROCESS_ENDPOINT] Video not found in local database (OK for Supabase)")
            except Exception as e:
                logger.warning(f"[PROCESS_ENDPOINT] Could not query local database: {e}")
        
        # Start processing in background
        logger.info(f"[PROCESS_ENDPOINT] Adding processing task to background queue...")
        # File path will be resolved from Supabase storage in the processor
        background_tasks.add_task(
            process_video_task_sync,
            video_id,
            video.file_path if video else video_id,  # Use video_id as key for Supabase storage
            db
        )
        
        logger.info(f"[PROCESS_ENDPOINT] Background task added successfully, returning response...")
        
        return {
            "status": "processing",
            "message": "Processing started",
            "video_id": video_id
        }
    
    except Exception as e:
        logger.error(f"[PROCESS_ENDPOINT_ERROR] Error triggering processing: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to start processing: {str(e)}")



def process_video_task_sync(video_id: str, file_path: str, db: Session):
    """Process video synchronously (works with or without Celery)"""
    import json
    from datetime import datetime
    from services.video_processor import VideoProcessor
    from config import get_settings
    from supabase import create_client
    
    settings = get_settings()
    
    logger.info(f"[PROCESS_START] Processing video: {video_id}")
    logger.info(f"[PROCESS_CONFIG] SUPABASE_URL: {settings.SUPABASE_URL}")
    
    try:
        # Initialize Supabase client for updates
        logger.info(f"[SUPABASE_INIT] Initializing Supabase client...")
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info(f"[SUPABASE_INIT] Supabase client initialized")
        
        # Update processing job status to processing
        logger.info(f"[JOB_UPDATE_1] Updating job to processing status...")
        supabase.table("processing_jobs").update({
            "status": "processing",
            "started_at": datetime.utcnow().isoformat()
        }).eq("video_id", video_id).execute()
        logger.info(f"[JOB_UPDATE_1] Job updated to processing")
        
        # Update video status to processing
        logger.info(f"[VIDEO_UPDATE_1] Updating video to processing status...")
        supabase.table("videos").update({
            "status": "processing",
            "processing_started_at": datetime.utcnow().isoformat()
        }).eq("id", video_id).execute()
        logger.info(f"[VIDEO_UPDATE_1] Video updated to processing")
        
        logger.info(f"[FILE_CHECK] Checking file path: {file_path}")
        logger.info(f"[FILE_CHECK] File exists: {os.path.exists(file_path)}")
        
        # For Supabase uploads, download the file first
        if not file_path.startswith(settings.UPLOAD_DIRECTORY) and not os.path.exists(file_path):
            logger.info(f"[DOWNLOAD_START] Downloading video from Supabase: {file_path}")
            
            # Create uploads directory
            os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
            
            # Download from Supabase storage
            local_file_path = os.path.join(settings.UPLOAD_DIRECTORY, f"{video_id}_temp")
            try:
                logger.info(f"[DOWNLOAD_REQUEST] Requesting file from Supabase storage: {file_path}")
                response = supabase.storage.from_("videos").download(file_path)
                logger.info(f"[DOWNLOAD_RECEIVED] Received {len(response)} bytes")
                
                with open(local_file_path, "wb") as f:
                    f.write(response)
                file_path = local_file_path
                logger.info(f"[DOWNLOAD_COMPLETE] Downloaded video to: {file_path}")
            except Exception as e:
                logger.warning(f"[DOWNLOAD_ERROR] Could not download from Supabase storage: {e}")
                # File might be on local disk, continue anyway
        
        # Initialize and run processor
        logger.info(f"[PROCESSOR_INIT] Initializing VideoProcessor for {file_path}")
        processor = VideoProcessor(
            video_path=file_path,
            video_id=video_id,
        )
        logger.info(f"[PROCESSOR_INIT] VideoProcessor initialized")
        
        logger.info(f"[PROCESSING_START] Starting video analysis...")
        results = processor.process()
        logger.info(f"[PROCESSING_COMPLETE] Video processing completed")
        
        logger.info(f"[RESULTS] {json.dumps(results, default=str)}")
        
        # Create analysis record
        logger.info(f"[ANALYSIS_PREP] Preparing analysis record...")
        analysis_data = {
            "video_id": video_id,
            "total_vehicles": results.get("total_vehicles", 0),
            "total_frames_processed": results.get("total_frames_processed", 0),
            "cars": results.get("cars", 0),
            "buses": results.get("buses", 0),
            "trucks": results.get("trucks", 0),
            "motorcycles": results.get("motorcycles", 0),
            "left_turns": results.get("left_turns", 0),
            "right_turns": results.get("right_turns", 0),
            "straight_movements": results.get("straight_movements", 0),
            "traffic_density": results.get("traffic_density", "low"),
            "processing_time": results.get("processing_time", 0),
            "annotated_video_path": results.get("annotated_video_path", ""),
        }
        logger.info(f"[ANALYSIS_PREP] Analysis data prepared")
        
        # Upsert analysis record
        logger.info(f"[ANALYSIS_SAVE] Saving analysis to Supabase...")
        supabase.table("analyses").upsert(analysis_data).execute()
        logger.info(f"[ANALYSIS_SAVE] Analysis saved successfully")
        
        # Update processing job status to completed
        logger.info(f"[JOB_UPDATE_2] Updating job to completed...")
        supabase.table("processing_jobs").update({
            "status": "completed",
            "progress": 100,
            "completed_at": datetime.utcnow().isoformat()
        }).eq("video_id", video_id).execute()
        logger.info(f"[JOB_UPDATE_2] Job marked as completed")
        
        # Update video status to completed
        logger.info(f"[VIDEO_UPDATE_2] Updating video to completed...")
        supabase.table("videos").update({
            "status": "completed",
            "processing_completed_at": datetime.utcnow().isoformat()
        }).eq("id", video_id).execute()
        logger.info(f"[VIDEO_UPDATE_2] Video marked as completed")
        
        logger.info(f"[PROCESS_COMPLETE] Successfully processed video {video_id}")
        
    except Exception as e:
        logger.error(f"[PROCESS_ERROR] Error processing video {video_id}: {str(e)}", exc_info=True)
        
        try:
            logger.info(f"[ERROR_UPDATE] Updating job to failed status...")
            # Update job with error
            supabase.table("processing_jobs").update({
                "status": "failed",
                "error_message": str(e),
                "completed_at": datetime.utcnow().isoformat()
            }).eq("video_id", video_id).execute()
            
            # Update video with error
            supabase.table("videos").update({
                "status": "failed",
                "error_message": str(e)
            }).eq("id", video_id).execute()
            logger.info(f"[ERROR_UPDATE] Error status updated in Supabase")
        except Exception as db_error:
            logger.error(f"[ERROR_UPDATE_FAILED] Failed to update error status: {db_error}")
