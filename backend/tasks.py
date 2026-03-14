"""
Celery configuration and task definitions for background video processing
"""

from celery import Celery
from config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

# Initialize Celery app
celery_app = Celery(
    "trafficlens",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes hard limit
    task_soft_time_limit=28 * 60,  # 28 minutes soft limit
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)


@celery_app.task(bind=True, name="process_video_task")
def process_video_task(self, video_id: str, file_path: str):
    """
    Celery task for processing video: detection, tracking, and analysis
    
    Args:
        self: Task instance
        video_id: ID of video to process
        file_path: Path to video file
    
    Returns:
        dict with processing results
    """
    from database import SessionLocal
    from models import Video, VideoStatusEnum, ProcessingJob, Analysis, Detection, Track
    from services.video_processor import VideoProcessor
    
    db = SessionLocal()
    
    try:
        # Update video and job status to processing
        video = db.query(Video).filter(Video.id == video_id).first()
        job = db.query(ProcessingJob).filter(ProcessingJob.video_id == video_id).first()
        
        if not video:
            raise Exception(f"Video {video_id} not found")
        
        # Update status
        video.status = VideoStatusEnum.PROCESSING
        if job:
            job.status = "processing"
            job.celery_task_id = self.request.id
        
        db.commit()
        
        logger.info(f"Starting video processing for {video_id}")
        
        # Initialize video processor
        processor = VideoProcessor(
            video_path=file_path,
            video_id=video_id,
            task=self
        )
        
        # Run processing pipeline
        results = processor.process()
        
        logger.info(f"Video processing completed for {video_id}")
        logger.info(f"Results: {results}")
        
        # Update video status
        video.status = VideoStatusEnum.COMPLETED
        if job:
            job.status = "completed"
        
        db.commit()
        
        return {
            "status": "success",
            "video_id": video_id,
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error processing video {video_id}: {str(e)}", exc_info=True)
        
        # Update status to failed
        video = db.query(Video).filter(Video.id == video_id).first()
        job = db.query(ProcessingJob).filter(ProcessingJob.video_id == video_id).first()
        
        if video:
            video.status = VideoStatusEnum.FAILED
            video.error_message = str(e)
        
        if job:
            job.status = "failed"
            job.error_message = str(e)
        
        db.commit()
        
        return {
            "status": "failed",
            "video_id": video_id,
            "error": str(e)
        }
    
    finally:
        db.close()


@celery_app.task(bind=True, name="update_processing_progress")
def update_processing_progress(self, video_id: str, progress: int, message: str = ""):
    """
    Update processing progress in database
    
    Args:
        self: Task instance
        video_id: ID of video being processed
        progress: Progress percentage (0-100)
        message: Status message
    """
    from database import SessionLocal
    from models import ProcessingJob
    
    db = SessionLocal()
    try:
        job = db.query(ProcessingJob).filter(ProcessingJob.video_id == video_id).first()
        if job:
            job.progress = progress
            db.commit()
            logger.info(f"Updated progress for {video_id}: {progress}% - {message}")
    finally:
        db.close()


# For local development
if __name__ == "__main__":
    celery_app.start()
