# TrafficLens Backend - Quick Reference

## 🚀 Start Backend (Choose One)

### Development Mode
```bash
python main.py
```

### Production Mode
```bash
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000
```

### Docker Mode
```bash
docker-compose up -d
```

---

## 📡 Essential Endpoints

| Purpose | Endpoint | Method |
|---------|----------|--------|
| API Docs | http://localhost:8000/docs | GET |
| Health | http://localhost:8000/health | GET |
| Upload Video | /api/v1/videos/upload | POST |
| Get Analysis | /api/v1/analytics/video/{id} | GET |
| Dashboard | /api/v1/analytics/dashboard | GET |

---

## 🔧 Required Services

| Service | Command | Port |
|---------|---------|------|
| FastAPI | `python main.py` | 8000 |
| PostgreSQL | `psql` or Docker | 5432 |
| Redis | `redis-server` or Docker | 6379 |
| Celery Worker | `celery -A tasks worker` | - |

---

## 📁 Key Files

```
main.py              → FastAPI app entry point
config.py            → Configuration
models.py            → Database models
routes/videos.py     → Video endpoints
routes/analytics.py  → Analytics endpoints
services/            → Business logic (processing)
tasks.py             → Background tasks
requirements.txt     → Dependencies
docker-compose.yml   → Multi-service setup
```

---

## 🎯 Common Commands

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Setup Database
```bash
# Create database
createdb -U postgres trafficlens

# Create user
psql -U postgres -c "CREATE USER traffic_user WITH PASSWORD 'traffic_password';"
```

### Run Celery Worker (Required for processing)
```bash
celery -A tasks worker --loglevel=info
```

### Run Tests
```bash
pytest
```

### Format Code
```bash
black .
```

---

## 📊 API Response Examples

### Upload Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "filename": "123e4567-e89b-12d3-a456-426614174000.mp4",
  "file_size": 1073741824,
  "status": "uploaded",
  "message": "Processing queued."
}
```

### Analysis Response
```json
{
  "id": "analytical-id",
  "video_id": "video-id",
  "total_vehicles": 132,
  "left_turns": 41,
  "right_turns": 28,
  "straight_movements": 63,
  "traffic_density": "medium",
  "processing_time": 145.5
}
```

---

## 🔐 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens

# Redis
REDIS_URL=redis://localhost:6379

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0

# API
DEBUG=False
PORT=8000

# AI
YOLO_MODEL=yolov8x.pt
CONFIDENCE_THRESHOLD=0.5
```

---

## ✅ Setup Checklist

- [ ] Python 3.9+ installed
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running
- [ ] Clone repository
- [ ] Create virtual environment
- [ ] Install requirements: `pip install -r requirements.txt`
- [ ] Copy `.env.example` to `.env`
- [ ] Create database and user
- [ ] Run migrations (if any)
- [ ] Start FastAPI: `python main.py`
- [ ] Start Celery: `celery -A tasks worker --loglevel=info`
- [ ] Visit http://localhost:8000/docs

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to DB | Check PostgreSQL running, verify DATABASE_URL |
| Redis error | Start Redis: `redis-server` |
| Port 8000 in use | Use different port: `python main.py --port 8001` |
| Celery not processing | Check Redis running, verify CELERY_BROKER_URL |
| ImportError | Install deps: `pip install -r requirements.txt` |
| Permission denied (files) | Check upload/processed directories are writable |

---

## 📚 Full Documentation

- **README.md** - Overview and features
- **SETUP_GUIDE.md** - Detailed installation
- **API_DOCUMENTATION.md** - Complete API reference
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## 🔗 Frontend Integration

```typescript
// Frontend .env
VITE_API_URL=http://localhost:8000/api/v1

// Frontend API call example
const response = await fetch(`${import.meta.env.VITE_API_URL}/videos/upload`, {
  method: 'POST',
  body: formData
});
```

---

## 🚀 Deploy to Docker

```bash
# Build image
docker build -t trafficlens-backend .

# Run with docker-compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

---

## 📊 Video Processing Flow

1. **User uploads video** → POST `/api/v1/videos/upload`
2. **Backend receives file** → Saves and creates DB record
3. **Task queued** → Celery worker picks it up
4. **Processing starts** → Detection, tracking, analysis
5. **Results saved** → Database and annotated video
6. **Frontend retrieves** → GET `/api/v1/analytics/video/{id}`
7. **User views results** → Dashboard displays analysis

---

## 🎯 Next Steps

1. Start all services (FastAPI, PostgreSQL, Redis, Celery)
2. Visit http://localhost:8000/docs to explore API
3. Upload a test video
4. Check processing status
5. View results in dashboard
6. Integrate with frontend

---

**For detailed instructions, see SETUP_GUIDE.md or API_DOCUMENTATION.md**
