# TrafficLens Backend API Documentation

**Modern FastAPI Backend for AI-Powered Traffic Analysis**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Running the Backend](#running-the-backend)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Video Processing Pipeline](#video-processing-pipeline)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)

---

## Overview

TrafficLens Backend is a production-ready FastAPI application that handles:

- **Video Upload & Storage** - Secure handling of traffic video files
- **AI Video Processing** - YOLOv8 object detection and vehicle tracking
- **Traffic Analytics** - Movement classification and traffic pattern analysis
- **Asynchronous Processing** - Celery-based background job queue
- **RESTful API** - Comprehensive API for frontend integration
- **Database Management** - PostgreSQL with SQLAlchemy ORM

### Key Features

✅ **Scalable Architecture** - Production-ready FastAPI + Celery + Redis
✅ **Real-time Processing** - Background task queue for video analysis
✅ **Comprehensive Analytics** - Vehicle detection, tracking, and movement classification
✅ **RESTful API** - Well-documented OpenAPI/Swagger endpoints
✅ **Database Models** - Complete data persistence with relationships
✅ **Error Handling** - Robust error handling and logging
✅ **Configuration Management** - Environment-based configuration

---

## Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── config.py                    # Configuration management
├── models.py                    # SQLAlchemy database models
├── database.py                  # Database session management
├── schemas.py                   # Pydantic request/response schemas
├── tasks.py                     # Celery background tasks
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
│
├── services/                    # Business logic
│   ├── __init__.py
│   └── video_processor.py       # Video processing pipeline
│
├── routes/                      # API endpoint routes
│   ├── __init__.py
│   ├── videos.py               # Video management endpoints
│   ├── analytics.py            # Analytics & results endpoints
│   └── health.py               # Health check endpoints
│
├── uploads/                     # User uploaded videos (created at runtime)
├── processed/                   # Processed videos with annotations
│
└── docs/                        # Documentation
    └── backend-prompt.md        # Original requirements
```

---

## Technology Stack

### Core Framework
- **FastAPI** - Modern, fast web framework for Python APIs
- **Uvicorn** - ASGI server for running FastAPI

### Database
- **PostgreSQL** - Relational database for data persistence
- **SQLAlchemy** - ORM for database operations
- **psycopg2** - PostgreSQL adapter for Python

### Background Processing
- **Celery** - Distributed task queue
- **Redis** - Message broker and result backend
- **RabbitMQ** - Alternative message broker (optional)

### AI & Computer Vision
- **YOLOv8** - Object detection model (via Ultralytics)
- **OpenCV** - Video processing and frame extraction
- **PyTorch** - Deep learning framework
- **NumPy/Pandas** - Numerical computing

### Data Validation
- **Pydantic** - Data validation and serialization
- **Pydantic-Settings** - Configuration management

### Utilities
- **python-multipart** - File upload handling
- **Pillow** - Image processing
- **Requests** - HTTP client
- **aiofiles** - Async file I/O

---

## Installation & Setup

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Redis 6+
- Git

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd TrafficLens-ai/backend
```

### 2. Create Virtual Environment

```bash
# Using venv
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE trafficlens;
CREATE USER traffic_user WITH PASSWORD 'traffic_password';
ALTER ROLE traffic_user SET client_encoding TO 'utf8';
ALTER ROLE traffic_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE traffic_user SET default_transaction_deferrable TO on;
ALTER ROLE traffic_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE trafficlens TO traffic_user;
\q
```

### 5. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Update DATABASE_URL, REDIS_URL, etc.
```

### 6. Initialize Database

Tables are automatically created on first run via SQLAlchemy.

---

## Running the Backend

### Option 1: Development Server

```bash
# Start FastAPI development server
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server available at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Option 2: Production Server

```bash
# Using Gunicorn + Uvicorn workers
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Option 3: Docker (Optional)

```bash
# Build image
docker build -t trafficlens-backend .

# Run container
docker run -p 8000:8000 --env-file .env trafficlens-backend
```

### Start Celery Worker (Required for video processing)

In a separate terminal:

```bash
# Development
celery -A tasks worker --loglevel=info

# Production with concurrency
celery -A tasks worker --loglevel=info --concurrency=4
```

### Start Celery Beat (Optional - for scheduled tasks)

```bash
celery -A tasks beat --loglevel=info
```

---

## API Endpoints

### Health Checks

```
GET  /health                 - Basic health check
GET  /api/v1/health         - API health check with DB connection
GET  /config                - Get configuration info
```

### Video Management

```
POST   /api/v1/videos/upload         - Upload video file
GET    /api/v1/videos                - List all videos
GET    /api/v1/videos/{video_id}     - Get video details
DELETE /api/v1/videos/{video_id}     - Delete video
```

### Analytics & Results

```
GET /api/v1/analytics/video/{video_id}         - Get analysis results
GET /api/v1/analytics/summary/{video_id}       - Get analytics summary
GET /api/v1/analytics/dashboard                - Get dashboard metrics
GET /api/v1/analytics/detections/{video_id}    - Get video detections
GET /api/v1/analytics/tracks/{video_id}        - Get vehicle tracks
GET /api/v1/analytics/track/{track_id}         - Get track details
GET /api/v1/analytics/job/{video_id}           - Get processing job status
```

### Example Requests

#### Upload Video

```bash
curl -X POST "http://localhost:8000/api/v1/videos/upload" \
  -F "file=@video.mp4"
```

#### Get Analysis Results

```bash
curl -X GET "http://localhost:8000/api/v1/analytics/video/{video_id}"
```

#### Get Dashboard Metrics

```bash
curl -X GET "http://localhost:8000/api/v1/analytics/dashboard"
```

---

## Database Models

### User
- `id` - Unique identifier
- `email` - User email (unique)
- `username` - Username (unique)
- `full_name` - Full name
- `is_active` - Account status
- `created_at` - Account creation timestamp

### Video
- `id` - Video ID
- `user_id` - Owner user ID (FK)
- `filename` - Stored filename
- `original_filename` - Original filename
- `file_path` - Storage path
- `file_size` - File size in bytes
- `duration` - Video duration in seconds
- `fps` - Frames per second
- `resolution` - Video resolution
- `status` - Processing status (uploaded, processing, completed, failed)
- `created_at`, `updated_at` - Timestamps

### Analysis
- `id` - Analysis ID
- `video_id` - Video ID (FK, unique)
- `total_vehicles` - Total vehicles detected
- `left_turns`, `right_turns`, `straight_movements` - Movement counts
- `cars`, `buses`, `trucks`, `motorcycles` - Vehicle type counts
- `traffic_density` - Traffic density classification
- `annotated_video_path` - Path to processed video
- `detailed_metrics` - JSON metrics
- `created_at`, `updated_at` - Timestamps

### Detection
- `id` - Detection ID
- `video_id` - Video ID (FK)
- `track_id` - Track ID (FK)
- `frame_number` - Frame number
- `x_min`, `y_min`, `x_max`, `y_max` - Bounding box
- `confidence` - Detection confidence
- `vehicle_class` - Vehicle type
- `metadata` - Additional data (JSON)

### Track
- `id` - Track ID
- `video_id` - Video ID (FK)
- `track_id` - Tracking algorithm ID
- `vehicle_class` - Vehicle type
- `start_frame`, `end_frame` - Frame range
- `movement_type` - Classified movement (left_turn, right_turn, straight)
- `trajectory_points` - [x, y] coordinates (JSON)
- `average_speed` - Estimated speed

### ProcessingJob
- `id` - Job ID
- `video_id` - Video ID (FK)
- `celery_task_id` - Celery task ID
- `status` - Job status
- `progress` - Progress percentage (0-100)
- `error_message` - Error details if failed

---

## Video Processing Pipeline

### Step-by-Step Process

1. **Upload** → Video file uploaded via API
2. **Storage** → File saved to disk, database record created
3. **Queue** → Processing task queued in Redis
4. **Fetch** → Celery worker retrieves task
5. **Extract Frames** → Video decomposed into frames
6. **Detect** → YOLOv8 detects vehicles in each frame
7. **Track** → Multi-object tracking assigns IDs
8. **Classify** → Movement patterns analyzed
9. **Annotate** → Video annotated with overlays
10. **Store** → Results saved to database
11. **Complete** → Frontend notified of completion

### Processing Configuration

```python
# From config.py
YOLO_MODEL = "yolov8x.pt"           # Extra-large YOLOv8 model
CONFIDENCE_THRESHOLD = 0.5           # Detection confidence
IOU_THRESHOLD = 0.45                 # IoU threshold
TARGET_FPS = 30                       # Output frame rate
TRACK_METHOD = "bytetrack"           # Tracking algorithm
```

### Performance Considerations

- **GPU Acceleration** - CUDA support for faster processing
- **Batch Processing** - Process frames in batches
- **Frame Skipping** - Optional frame skipping for faster processing
- **Memory Management** - Optimized for large videos

---

## Configuration

### Environment Variables

See `.env.example` for all configuration options.

### Key Settings

```python
# Database
DATABASE_URL = "postgresql://user:pass@localhost/trafficlens"

# Redis/Celery
REDIS_URL = "redis://localhost:6379"
CELERY_BROKER_URL = "redis://localhost:6379/0"

# File Upload
MAX_UPLOAD_SIZE = 5 * 1024 * 1024 * 1024  # 5GB
ALLOWED_VIDEO_FORMATS = ["mp4", "mov", "avi"]

# AI Models
YOLO_MODEL = "yolov8x.pt"
CONFIDENCE_THRESHOLD = 0.5

# API
CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]
```

---

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run specific test
pytest tests/test_videos.py -v

# With coverage
pytest --cov=. tests/
```

### Code Quality

```bash
# Install dev dependencies
pip install black flake8 mypy

# Format code
black .

# Lint
flake8 .

# Type checking
mypy .
```

### Database Migrations (Alembic)

```bash
# Install Alembic
pip install alembic

# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

### Logging

Logging is configured in `main.py`. Adjust log level in `config.py`:

```python
logging.basicConfig(level=logging.INFO)
```

---

## Deployment

### Production Checklist

- [ ] Update `SECRET_KEY` in .env
- [ ] Set `DEBUG=False`
- [ ] Configure proper database backups
- [ ] Set up Redis persistence
- [ ] Configure CORS for your domain
- [ ] Use environment-specific .env files
- [ ] Set up SSL/HTTPS
- [ ] Configure logging and monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test video upload limits
- [ ] Monitor disk space for videos
- [ ] Set up rate limiting

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### AWS Deployment

- Use **RDS** for PostgreSQL
- Use **ElastiCache** for Redis
- Use **S3** for video storage
- Use **EC2** or **ECS** for application
- Use **Lambda** for async processing (alternative to Celery)
- Use **CloudFront** for static file delivery

---

## API Response Examples

### Video Upload Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "550e8400-e29b-41d4-a716-446655440000.mp4",
  "file_size": 1073741824,
  "status": "uploaded",
  "message": "Video uploaded successfully. Processing queued."
}
```

### Analysis Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_vehicles": 132,
  "total_frames_processed": 900,
  "left_turns": 41,
  "right_turns": 28,
  "straight_movements": 63,
  "cars": 96,
  "buses": 7,
  "trucks": 11,
  "motorcycles": 18,
  "average_vehicles_per_frame": 5.2,
  "peak_vehicles": 12,
  "traffic_density": "medium",
  "processing_time": 145.5,
  "annotated_video_path": "processed/550e8400-e29b-41d4-a716-446655440000_annotated.mp4",
  "created_at": "2024-03-14T10:30:00",
  "updated_at": "2024-03-14T10:35:00"
}
```

---

## Troubleshooting

### Issue: "Cannot connect to database"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists
- Check user permissions

### Issue: "Redis connection failed"
- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL in .env
- Ensure Redis port is accessible

### Issue: "Celery task not processing"
- Check Celery worker is running
- Check Redis broker status
- Review Celery logs for errors
- Verify task is queued: `redis-cli LLEN celery`

### Issue: "Out of memory during video processing"
- Reduce BATCH_SIZE in config
- Enable frame skipping
- Process smaller videos first
- Increase server RAM

---

## Support & Contributing

For issues, questions, or contributions:

1. Check existing issues on GitHub
2. Review API documentation at `/docs`
3. Check application logs
4. Submit detailed bug reports with logs

---

## License

This project is licensed under the MIT License.

---

**TrafficLens Backend** - Powering AI-driven traffic intelligence

*Last Updated: March 14, 2024*
