# TrafficLens Backend 🚗🎯

**Production-Ready FastAPI Backend for AI-Powered Traffic Analysis**

[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6%2B-red.svg)](https://redis.io/)
[![Celery](https://img.shields.io/badge/Celery-5.3%2B-green.svg)](https://docs.celeryproject.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Overview

The TrafficLens backend is a modern, scalable API for processing traffic videos and extracting actionable insights using AI-powered computer vision.

### Key Capabilities

✅ **Video Processing** - Upload traffic videos and automatic processing  
✅ **AI Detection** - YOLOv8-based vehicle detection and tracking  
✅ **Traffic Analytics** - Movement classification and traffic pattern analysis  
✅ **Async Processing** - Celery-based background job queue  
✅ **RESTful API** - Comprehensive OpenAPI/Swagger documentation  
✅ **Database** - PostgreSQL with SQLAlchemy ORM  
✅ **Scalable** - Docker and docker-compose ready  

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React/TypeScript)             │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────────────────┐
│         FastAPI Backend (main.py)                   │
│  - Video Upload Handler                            │
│  - Analytics API                                    │
│  - Health Checks                                    │
└────────────────┬────────────────────────────────────┘
        ┌────────┼────────┐
        │        │        │
    ┌───▼──┐  ┌──▼──┐  ┌──▼──────┐
    │  Db  │  │Redis│  │ Celery  │
    │ PgSQL│  │     │  │ Workers │
    └──────┘  └─────┘  └─────────┘
               │
         ┌─────▼──────┐
         │ Video      │
         │ Processing │
         │ Pipeline   │
         │ - YOLO     │
         │ - Tracking │
         │ - Analytics│
         └────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Redis 6+

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd TrafficLens-ai/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings

# 5. Setup PostgreSQL database
createdb -U postgres trafficlens
psql -U postgres trafficlens < schema.sql  # If provided

# 6. Run backend
python main.py
```

### Running with Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## 📡 API Endpoints

### Health & Status

```
GET  /health                    - Health check
GET  /api/v1/health            - API health with DB check
GET  /config                    - Configuration info
```

### Video Management

```
POST   /api/v1/videos/upload         - Upload video
GET    /api/v1/videos                - List videos
GET    /api/v1/videos/{video_id}     - Get video details
DELETE /api/v1/videos/{video_id}     - Delete video
```

### Analytics

```
GET /api/v1/analytics/video/{video_id}      - Analysis results
GET /api/v1/analytics/summary/{video_id}    - Analytics summary
GET /api/v1/analytics/dashboard             - Dashboard metrics
GET /api/v1/analytics/detections/{video_id} - Detections
GET /api/v1/analytics/tracks/{video_id}     - Vehicle tracks
GET /api/v1/analytics/job/{video_id}        - Job status
```

### Interactive Documentation

Open in browser: **http://localhost:8000/docs** (Swagger UI)

---

## 📚 Project Structure

```
backend/
├── main.py                  # FastAPI application
├── config.py               # Configuration management
├── models.py               # SQLAlchemy models
├── database.py             # Database session
├── schemas.py              # Pydantic schemas
├── tasks.py                # Celery tasks
│
├── routes/                 # API endpoints
│   ├── videos.py          # Video management
│   ├── analytics.py       # Analysis results
│   └── health.py          # Health checks
│
├── services/               # Business logic
│   └── video_processor.py # Video processing pipeline
│
├── requirements.txt        # Dependencies
├── .env.example           # Environment template
├── Dockerfile             # Docker image
├── docker-compose.yml     # Docker services
├── SETUP_GUIDE.md         # Detailed setup
├── API_DOCUMENTATION.md   # Full API docs
└── README.md              # This file
```

---

## 🛠️ Tech Stack

### Framework & Server
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Database & Cache
- **PostgreSQL** - Primary database
- **SQLAlchemy** - ORM
- **Redis** - Caching and message broker

### Background Processing
- **Celery** - Task queue
- **Redis** - Broker and result backend

### AI & Computer Vision
- **YOLOv8** - Object detection
- **OpenCV** - Video processing
- **PyTorch** - Deep learning framework
- **NumPy/Pandas** - Data processing

### Additional Libraries
- **Requests** - HTTP client
- **aiofiles** - Async file I/O
- **Pillow** - Image processing

---

## 🔄 Video Processing Pipeline

### Step-by-Step Process

1. **Upload** - Video uploaded via API endpoint
2. **Store** - Video saved to disk, record created in DB
3. **Queue** - Processing task queued in Redis
4. **Extract** - Video frames extracted
5. **Detect** - YOLOv8 detects vehicles in each frame
6. **Track** - Multi-object tracking assigns IDs
7. **Classify** - Movement patterns analyzed (left/right/straight)
8. **Annotate** - Bounding boxes and labels added to video
9. **Analyze** - Traffic statistics computed
10. **Store Results** - Results saved to database
11. **Complete** - Frontend notified

### Processing Configuration

From `config.py`:

```python
YOLO_MODEL = "yolov8x.pt"         # Detection model
CONFIDENCE_THRESHOLD = 0.5         # Min confidence
IOU_THRESHOLD = 0.45              # Intersection over union
TARGET_FPS = 30                   # Output frame rate
TRACK_METHOD = "bytetrack"        # Tracking algorithm
```

---

## 💾 Database Models

### Key Tables

**Videos**
- Video metadata, status, file paths
- Relationships: User (owns), Analysis (results), Detections, Tracks

**Analysis**
- Aggregated results: vehicle counts, movements, densities
- One-to-one with Video

**Detections**
- Vehicle detections per frame
- Bounding boxes, confidence, class

**Tracks**
- Vehicle trajectories across frames
- Movement classification results

**ProcessingJobs**
- Background task status tracking
- Progress monitoring

---

## 🔧 Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens

# Redis
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Upload
MAX_UPLOAD_SIZE=5368709120  # 5GB
ALLOWED_VIDEO_FORMATS=["mp4", "mov", "avi"]

# AI Models
YOLO_MODEL=yolov8x.pt
CONFIDENCE_THRESHOLD=0.5

# API
DEBUG=False
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

---

## 🧪 Testing

### Install Test Dependencies

```bash
pip install pytest pytest-asyncio httpx
```

### Run Tests

```bash
# All tests
pytest

# Specific test file
pytest tests/test_videos.py -v

# With coverage
pytest --cov=. tests/
```

---

## 📊 Example API Usage

### Upload Video

```bash
curl -X POST http://localhost:8000/api/v1/videos/upload \
  -F "file=@traffic_video.mp4"
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "550e8400-e29b-41d4-a716-446655440000.mp4",
  "file_size": 1073741824,
  "status": "uploaded",
  "message": "Video uploaded successfully. Processing queued."
}
```

### Check Processing Status

```bash
curl http://localhost:8000/api/v1/analytics/job/{video_id}
```

### Get Analysis Results

```bash
curl http://localhost:8000/api/v1/analytics/video/{video_id}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_vehicles": 132,
  "left_turns": 41,
  "right_turns": 28,
  "straight_movements": 63,
  "traffic_density": "medium",
  "processing_time": 145.5
}
```

---

## 🐳 Docker Deployment

### Single Container

```bash
# Build image
docker build -t trafficlens-backend .

# Run container
docker run -p 8000:8000 --env-file .env trafficlens-backend
```

### Multiple Services (Recommended)

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

---

## 🚨 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U traffic_user -d trafficlens

# Verify connection string in .env
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### Celery Worker Not Processing

```bash
# Start worker with debug output
celery -A tasks worker --loglevel=debug

# Check Redis queue
redis-cli LLEN celery
```

### Port Already in Use

```bash
# Use different port
python main.py --port 8001
# or
uvicorn main:app --port 8001
```

---

## 📖 Full Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed installation instructions
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Video Processor](services/video_processor.py) - Processing pipeline details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or suggestions:

1. Check [API Documentation](API_DOCUMENTATION.md)
2. Review [Setup Guide](SETUP_GUIDE.md)
3. Check application logs
4. Open an issue on GitHub

---

## 🎯 Roadmap

- [ ] WebSocket support for real-time processing updates
- [ ] GPU acceleration for faster video processing
- [ ] Multi-camera coordination
- [ ] Speed estimation algorithms
- [ ] Pedestrian detection support
- [ ] Real-time stream processing
- [ ] Advanced analytics and reporting
- [ ] User authentication and authorization
- [ ] Rate limiting and quota management
- [ ] Monitoring and metrics dashboard

---

<div align="center">

**TrafficLens Backend** - Powering Intelligent Traffic Analysis

*Built with ❤️ using FastAPI, PostgreSQL, and AI*

</div>
