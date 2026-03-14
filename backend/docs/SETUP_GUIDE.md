# Backend Setup & Installation Guide

## Quick Start

Follow these steps to set up the TrafficLens backend locally.

### 1. Prerequisites

- Python 3.9+ ([Download](https://www.python.org/downloads/))
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/))
- Redis 6+ ([Download](https://redis.io/download))
- Git

### 2. Clone Repository

```bash
git clone <repository-url>
cd TrafficLens-ai/backend
```

### 3. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Setup PostgreSQL Database

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands in psql:
CREATE DATABASE trafficlens;
CREATE USER traffic_user WITH PASSWORD 'traffic_password';
ALTER ROLE traffic_user SET client_encoding TO 'utf8';
ALTER ROLE traffic_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE trafficlens TO traffic_user;
\q
```

#### Verify Connection

```bash
psql -U traffic_user -d trafficlens -h localhost
```

### 6. Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env (update if needed)
# Default values should work for local development
```

### 7. Initialize Database

Database tables are created automatically on first server start.

---

## Running the Application

### Terminal 1: Start FastAPI Server

```bash
python main.py
```

**Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

API Docs: http://localhost:8000/docs

### Terminal 2: Start Redis Server

```bash
# Windows (if installed via WSL or Chocolatey)
redis-server

# macOS (with Homebrew)
redis-server

# Or Docker
docker run -p 6379:6379 redis:latest
```

### Terminal 3: Start Celery Worker

```bash
celery -A tasks worker --loglevel=info
```

**Output:**
```
[2024-03-14 10:00:00,000: INFO/MainProcess] celery@hostname ready
```

---

## Verify Setup

### 1. Check Health Endpoints

```bash
# Basic health check
curl http://localhost:8000/health

# API health check (includes database connection)
curl http://localhost:8000/api/v1/health
```

### 2. Access API Documentation

Open browser to: http://localhost:8000/docs

### 3. Test File Upload

```bash
# Create test video (or use existing)
curl -X POST "http://localhost:8000/api/v1/videos/upload" \
  -F "file=@test_video.mp4"
```

---

## Database Management

### Connect to Database

```bash
psql -U traffic_user -d trafficlens
```

### View Tables

```sql
-- List all tables
\dt

-- View table structure
\d videos
\d analysis
\d detections
\d tracks

-- Check data
SELECT * FROM videos;
SELECT * FROM analyses;
```

### Backup Database

```bash
pg_dump -U traffic_user trafficlens > backup.sql
```

### Restore Database

```bash
psql -U traffic_user trafficlens < backup.sql
```

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:** Install requirements
```bash
pip install -r requirements.txt
```

### Issue: "Cannot connect to database"

**Solution:** Verify PostgreSQL is running and credentials are correct
```bash
psql -U traffic_user -d trafficlens
```

### Issue: "Redis connection refused"

**Solution:** Start Redis server
```bash
redis-server
```

### Issue: "Port 8000 already in use"

**Solution:** Use different port
```bash
python main.py --port 8001
# or
uvicorn main:app --port 8001
```

### Issue: "Celery worker not processing tasks"

**Solution:** 
1. Verify Redis is running
2. Check Celery logs for errors
3. Restart worker:
```bash
celery -A tasks worker --loglevel=debug
```

---

## Development Commands

### Install Development Dependencies

```bash
pip install pytest pytest-asyncio black flake8 mypy
```

### Run Tests

```bash
pytest
```

### Format Code

```bash
black .
```

### Lint Code

```bash
flake8 .
```

### Type Checking

```bash
mypy .
```

---

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── config.py               # Configuration
├── models.py               # SQLAlchemy models
├── database.py             # Database session
├── schemas.py              # Pydantic schemas
├── tasks.py                # Celery tasks
├── requirements.txt        # Python dependencies
├── .env.example            # Environment template
├── API_DOCUMENTATION.md    # Full API docs
│
├── routes/                 # API endpoints
│   ├── videos.py          # Video upload/management
│   ├── analytics.py       # Analysis results
│   └── health.py          # Health checks
│
├── services/               # Business logic
│   └── video_processor.py # Video processing pipeline
│
├── uploads/               # Uploaded videos (created at runtime)
└── processed/             # Processed videos (created at runtime)
```

---

## API Examples

### Upload Video

```bash
curl -X POST http://localhost:8000/api/v1/videos/upload \
  -F "file=@traffic_video.mp4"
```

### Check Processing Status

```bash
curl http://localhost:8000/api/v1/analytics/job/{video_id}
```

### Get Analysis Results

```bash
curl http://localhost:8000/api/v1/analytics/video/{video_id}
```

### List All Videos

```bash
curl http://localhost:8000/api/v1/videos
```

---

## Connecting Frontend

Update frontend API configuration to point to backend:

### In Frontend `.env` or `config.ts`:

```
VITE_API_URL=http://localhost:8000/api/v1
```

### Example Frontend API Call:

```typescript
const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/videos/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
  
  return response.data;
};
```

---

## Next Steps

1. **Run the backend** - Follow the setup steps above
2. **Test API endpoints** - Use Swagger UI at `/docs`
3. **Connect frontend** - Point frontend to backend API
4. **Test video upload** - Upload a sample traffic video
5. **Monitor processing** - Check Celery worker logs
6. **View results** - Retrieve analysis via API

---

## Documentation

- [Full API Documentation](API_DOCUMENTATION.md)
- [Database Models](models.py)
- [Configuration](config.py)
- [Video Processing Pipeline](services/video_processor.py)

---

## Support

For issues or questions:
1. Check logs in terminal output
2. Review API documentation
3. Check database connection
4. Verify all services are running (FastAPI, Redis, Celery)

---

**Happy coding!** 🚀
