"""
Database models for TrafficLens
"""

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Boolean, Enum, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum
import uuid

Base = declarative_base()


class VideoStatusEnum(str, enum.Enum):
    """Video processing status"""
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    videos = relationship("Video", back_populates="user", cascade="all, delete-orphan")
    

class Video(Base):
    """Video model"""
    __tablename__ = "videos"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), index=True)
    filename = Column(String, index=True)
    original_filename = Column(String)
    file_path = Column(String)
    file_size = Column(Integer)  # in bytes
    duration = Column(Float)  # in seconds
    fps = Column(Integer)
    resolution = Column(String)  # e.g., "1920x1080"
    
    status = Column(Enum(VideoStatusEnum), default=VideoStatusEnum.UPLOADED, index=True)
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    processing_started_at = Column(DateTime, nullable=True)
    processing_completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="videos")
    analysis = relationship("Analysis", back_populates="video", uselist=False, cascade="all, delete-orphan")
    detections = relationship("Detection", back_populates="video", cascade="all, delete-orphan")
    tracks = relationship("Track", back_populates="video", cascade="all, delete-orphan")


class Analysis(Base):
    """Video analysis results model"""
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_id = Column(String, ForeignKey("videos.id"), unique=True, index=True)
    
    # Total counts
    total_vehicles = Column(Integer, default=0)
    total_frames_processed = Column(Integer, default=0)
    
    # Movement classification
    left_turns = Column(Integer, default=0)
    right_turns = Column(Integer, default=0)
    straight_movements = Column(Integer, default=0)
    
    # Vehicle type breakdown
    cars = Column(Integer, default=0)
    buses = Column(Integer, default=0)
    trucks = Column(Integer, default=0)
    motorcycles = Column(Integer, default=0)
    
    # Traffic metrics
    average_vehicles_per_frame = Column(Float, default=0.0)
    peak_vehicles = Column(Integer, default=0)
    traffic_density = Column(String, default="low")  # low, medium, high, critical
    
    # Additional metrics
    average_speed = Column(Float, nullable=True)  # km/h
    processing_time = Column(Float, nullable=True)  # seconds
    
    # Processed video paths
    annotated_video_path = Column(String, nullable=True)
    
    # Raw analytics data as JSON
    detailed_metrics = Column(JSON, nullable=True)
    movement_distribution = Column(JSON, nullable=True)
    vehicle_type_distribution = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    video = relationship("Video", back_populates="analysis")


class Detection(Base):
    """Vehicle detection in a frame"""
    __tablename__ = "detections"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_id = Column(String, ForeignKey("videos.id"), index=True)
    track_id = Column(String, ForeignKey("tracks.id"), nullable=True, index=True)
    
    frame_number = Column(Integer, index=True)
    timestamp = Column(Float)  # seconds from start of video
    
    # Bounding box coordinates
    x_min = Column(Float)
    y_min = Column(Float)
    x_max = Column(Float)
    y_max = Column(Float)
    
    # Detection confidence
    confidence = Column(Float)
    
    # Vehicle classification
    vehicle_class = Column(String)  # car, bus, truck, motorcycle, etc.
    
    # Optional: additional metadata
    extra_metadata = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    video = relationship("Video", back_populates="detections")
    track = relationship("Track", back_populates="detections")


class Track(Base):
    """Vehicle track across multiple frames"""
    __tablename__ = "tracks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_id = Column(String, ForeignKey("videos.id"), index=True)
    
    track_id = Column(Integer, index=True)  # Track ID assigned by tracking algorithm
    vehicle_class = Column(String)
    
    # Track lifecycle
    start_frame = Column(Integer)
    end_frame = Column(Integer)
    total_detections = Column(Integer, default=0)
    
    # Movement classification
    movement_type = Column(String, nullable=True)  # left_turn, right_turn, straight, etc.
    movement_confidence = Column(Float, nullable=True)
    
    # Trajectory data
    trajectory_points = Column(JSON)  # List of [x, y] coordinates
    start_position = Column(JSON)  # [x, y]
    end_position = Column(JSON)  # [x, y]
    
    # Speed estimation (if available)
    average_speed = Column(Float, nullable=True)  # km/h
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    video = relationship("Video", back_populates="tracks")
    detections = relationship("Detection", back_populates="track", cascade="all, delete-orphan")


class ProcessingJob(Base):
    """Background processing job tracking"""
    __tablename__ = "processing_jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_id = Column(String, ForeignKey("videos.id"), unique=True, index=True)
    
    celery_task_id = Column(String, unique=True, nullable=True)
    
    status = Column(String, default="pending")  # pending, processing, completed, failed
    progress = Column(Integer, default=0)  # 0-100
    error_message = Column(Text, nullable=True)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
