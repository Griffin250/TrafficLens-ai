"""
API routes for analytics and results
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import logging

from database import get_db
from models import Video, Analysis, Detection, Track, ProcessingJob
from schemas import (
    AnalysisResponse,
    AnalyticsSummary,
    DashboardMetrics,
    ProcessingJobResponse,
    DetectionResponse,
    TrackResponse
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.get("/video/{video_id}", response_model=Optional[AnalysisResponse])
def get_video_analysis(video_id: str, db: Session = Depends(get_db)):
    """Get analysis results for a video"""
    analysis = db.query(Analysis).filter(Analysis.video_id == video_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis


@router.get("/summary/{video_id}", response_model=AnalyticsSummary)
def get_analytics_summary(video_id: str, db: Session = Depends(get_db)):
    """Get analytics summary for a video"""
    analysis = db.query(Analysis).filter(Analysis.video_id == video_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return AnalyticsSummary(
        video_id=video_id,
        total_vehicles=analysis.total_vehicles,
        movement_distribution={
            "left_turns": (analysis.left_turns / max(analysis.total_vehicles, 1)) * 100,
            "right_turns": (analysis.right_turns / max(analysis.total_vehicles, 1)) * 100,
            "straight": (analysis.straight_movements / max(analysis.total_vehicles, 1)) * 100,
        },
        vehicle_type_distribution={
            "cars": (analysis.cars / max(analysis.total_vehicles, 1)) * 100,
            "buses": (analysis.buses / max(analysis.total_vehicles, 1)) * 100,
            "trucks": (analysis.trucks / max(analysis.total_vehicles, 1)) * 100,
            "motorcycles": (analysis.motorcycles / max(analysis.total_vehicles, 1)) * 100,
        },
        traffic_density=analysis.traffic_density,
        processing_time=analysis.processing_time or 0,
        created_at=analysis.created_at
    )


@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get overall dashboard metrics"""
    
    # Get all analyses
    all_analyses = db.query(Analysis).all()
    
    # Calculate metrics
    total_videos_processed = len(all_analyses)
    total_vehicles = sum(a.total_vehicles for a in all_analyses)
    total_time = sum(a.processing_time or 0 for a in all_analyses)
    avg_vehicles = total_vehicles / max(total_videos_processed, 1)
    
    # Get recent videos
    recent_videos = db.query(Video).order_by(Video.created_at.desc()).limit(5).all()
    
    return DashboardMetrics(
        total_videos_processed=total_videos_processed,
        total_vehicles_detected=total_vehicles,
        total_analysis_time=total_time / 60,  # Convert to minutes
        average_vehicles_per_video=avg_vehicles,
        recent_videos=recent_videos
    )


@router.get("/detections/{video_id}")
def get_video_detections(video_id: str, frame_number: Optional[int] = None, db: Session = Depends(get_db)):
    """Get detections for a video, optionally filtered by frame"""
    query = db.query(Detection).filter(Detection.video_id == video_id)
    
    if frame_number is not None:
        query = query.filter(Detection.frame_number == frame_number)
    
    detections = query.all()
    if not detections:
        raise HTTPException(status_code=404, detail="No detections found")
    
    return detections


@router.get("/tracks/{video_id}")
def get_video_tracks(video_id: str, db: Session = Depends(get_db)):
    """Get all vehicle tracks for a video"""
    tracks = db.query(Track).filter(Track.video_id == video_id).all()
    if not tracks:
        raise HTTPException(status_code=404, detail="No tracks found")
    
    return tracks


@router.get("/track/{track_id}", response_model=TrackResponse)
def get_track_details(track_id: str, db: Session = Depends(get_db)):
    """Get detailed information about a specific track"""
    track = db.query(Track).filter(Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    
    return track


@router.get("/job/{video_id}", response_model=ProcessingJobResponse)
def get_processing_job(video_id: str, db: Session = Depends(get_db)):
    """Get processing job status"""
    job = db.query(ProcessingJob).filter(ProcessingJob.video_id == video_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job
