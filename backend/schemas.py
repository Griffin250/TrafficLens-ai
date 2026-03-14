"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum


# ==================== User Schemas ====================

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Video Schemas ====================

class VideoBase(BaseModel):
    filename: str
    original_filename: str


class VideoCreate(VideoBase):
    pass


class VideoResponse(VideoBase):
    id: str
    user_id: str
    file_size: int
    duration: Optional[float] = None
    fps: Optional[int] = None
    resolution: Optional[str] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class VideoDetailResponse(VideoResponse):
    error_message: Optional[str] = None
    processing_started_at: Optional[datetime] = None
    processing_completed_at: Optional[datetime] = None
    updated_at: datetime


# ==================== Analysis Schemas ====================

class AnalysisBase(BaseModel):
    total_vehicles: int = 0
    left_turns: int = 0
    right_turns: int = 0
    straight_movements: int = 0
    cars: int = 0
    buses: int = 0
    trucks: int = 0
    motorcycles: int = 0
    average_vehicles_per_frame: float = 0.0
    traffic_density: str = "low"


class AnalysisResponse(AnalysisBase):
    id: str
    video_id: str
    total_frames_processed: int
    peak_vehicles: int
    processing_time: Optional[float] = None
    annotated_video_path: Optional[str] = None
    detailed_metrics: Optional[Dict[str, Any]] = None
    movement_distribution: Optional[Dict[str, Any]] = None
    vehicle_type_distribution: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Detection Schemas ====================

class BoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float


class DetectionResponse(BoundingBox):
    id: str
    frame_number: int
    timestamp: float
    confidence: float
    vehicle_class: str
    extra_metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


# ==================== Track Schemas ====================

class TrajectoryPoint(BaseModel):
    x: float
    y: float


class TrackResponse(BaseModel):
    id: str
    track_id: int
    vehicle_class: str
    start_frame: int
    end_frame: int
    total_detections: int
    movement_type: Optional[str] = None
    movement_confidence: Optional[float] = None
    trajectory_points: List[List[float]]
    start_position: List[float]
    end_position: List[float]
    average_speed: Optional[float] = None
    
    class Config:
        from_attributes = True


# ==================== Upload Schemas ====================

class VideoUploadResponse(BaseModel):
    id: str
    filename: str
    file_size: int
    status: str
    message: str


class VideoUploadProgress(BaseModel):
    video_id: str
    status: str
    progress: int  # 0-100
    message: str


# ==================== Processing Schemas ====================

class ProcessingJobResponse(BaseModel):
    id: str
    video_id: str
    celery_task_id: Optional[str] = None
    status: str
    progress: int
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ==================== Statistics Schemas ====================

class TrafficStatistics(BaseModel):
    total_vehicles: int
    left_turns: int
    right_turns: int
    straight: int
    vehicles_by_type: Dict[str, int]
    traffic_density: str
    average_vehicles_per_frame: float
    peak_vehicles: int


class MovementDistribution(BaseModel):
    left_turns: float  # percentage
    right_turns: float
    straight: float


class VehicleTypeDistribution(BaseModel):
    cars: float  # percentage
    buses: float
    trucks: float
    motorcycles: float


# ==================== Dashboard Schemas ====================

class DashboardMetrics(BaseModel):
    total_videos_processed: int
    total_vehicles_detected: int
    total_analysis_time: float  # minutes
    average_vehicles_per_video: float
    recent_videos: List[VideoResponse]


class AnalyticsSummary(BaseModel):
    video_id: str
    total_vehicles: int
    movement_distribution: MovementDistribution
    vehicle_type_distribution: VehicleTypeDistribution
    traffic_density: str
    processing_time: float  # seconds
    created_at: datetime


# ==================== Error Schemas ====================

class ErrorResponse(BaseModel):
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ==================== Pagination ====================

class PaginationParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100)


class PaginatedResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: List[Any]
