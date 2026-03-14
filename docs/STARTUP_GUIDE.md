# 🚀 TrafficLens - Full Stack Startup Guide

## Environment Variables Created ✅

Both frontend and backend `.env` files have been created with all necessary configuration.

---

## 📍 Environment Files

| File | Location | Purpose |
|------|----------|---------|
| Frontend .env | `d:\TrafficLens-ai\.env` | Frontend API configuration |
| Backend .env | `d:\TrafficLens-ai\backend\.env` | Backend database & services |

---

## 🎯 Quick Start (30 seconds)

### Prerequisites (Must be running)

1. **PostgreSQL** - Database
2. **Redis** - Message broker
3. **Python 3.9+** - Backend runtime
4. **Bun/Node.js** - Frontend runtime

---

## 🚀 Start Everything (Open 4 Terminals)

### Terminal 1: Backend API

```bash
cd d:\TrafficLens-ai\backend
python main.py
```

Expected: `Uvicorn running on http://0.0.0.0:8000`

### Terminal 2: Celery Worker (Video Processing)

```bash
cd d:\TrafficLens-ai\backend
celery -A tasks worker --loglevel=info
```

Expected: `celery@hostname ready.`

### Terminal 3: Frontend Dev Server

```bash
cd d:\TrafficLens-ai
bun run dev
```

Expected: `Local: http://localhost:5173/`

### (Optional) Terminal 4: Celery Beat (Task Scheduler)

```bash
cd d:\TrafficLens-ai\backend
celery -A tasks beat --loglevel=info
```

---

## ✅ Verify Everything Is Working

### 1. Backend Health
```bash
curl http://localhost:8000/health
```

### 2. API Docs
Open: http://localhost:8000/docs

### 3. Frontend
Open: http://localhost:5173

### 4. Test Upload
1. Go to http://localhost:5173
2. Upload a video file
3. Check analytics appear
4. View processed video

---

## 🔗 Connection Points

### Frontend → Backend API
```
Frontend URL: http://localhost:5173
Backend API:  http://localhost:8000/api/v1

VITE_API_URL=http://localhost:8000
VITE_API_BASE_PATH=/api/v1
```

### Backend → Database
```
Database: PostgreSQL
URL: postgresql://traffic_user:traffic_password@localhost:5432/trafficlens
```

### Backend → Cache/Queue
```
Redis: redis://localhost:6379
Celery Broker: redis://localhost:6379/0
Celery Backend: redis://localhost:6379/1
```

---

## 📊 Environment Variables Configured

### Frontend (.env)
```
✅ VITE_API_URL - Backend server
✅ VITE_API_BASE_PATH - API path
✅ VITE_APP_NAME - App title
✅ VITE_DEBUG - Debug mode
✅ VITE_MAX_VIDEO_SIZE - Upload limit
✅ VITE_ALLOWED_VIDEO_FORMATS - Video types
✅ VITE_THEME_MODE - Dark/Light
```

### Backend (.env)
```
✅ DATABASE_URL - PostgreSQL connection
✅ REDIS_URL - Redis connection
✅ CELERY_BROKER_URL - Task queue
✅ CORS_ORIGINS - Frontend URL allowed
✅ PORT - Server port (8000)
✅ DEBUG - Debug mode
✅ YOLO_MODEL - AI model
✅ CONFIDENCE_THRESHOLD - Detection threshold
```

---

## 🎨 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Web UI |
| Backend API | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/docs | Swagger docs |
| Health | http://localhost:8000/health | Server status |

---

## 📝 What You Can Do Now

1. ✅ Upload traffic videos
2. ✅ View AI analysis (vehicle detection, tracking)
3. ✅ See real-time processing status
4. ✅ Download annotated videos
5. ✅ View traffic analytics & dashboards
6. ✅ Monitor vehicle movements

---

## 🔧 Using Environment Variables in Code

### Frontend (Vite)

```typescript
// Access in TypeScript/React
const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_BASE_PATH;

// Create full endpoint
const endpoint = `${API_URL}${API_PATH}/videos/upload`;
```

### Backend (Python)

```python
# Already configured in config.py
from config import get_settings

settings = get_settings()
print(settings.DATABASE_URL)      # PostgreSQL URL
print(settings.REDIS_URL)         # Redis URL
print(settings.CORS_ORIGINS)      # Allowed origins
```

---

## 🚨 Troubleshooting

### "CORS error in browser"
→ Backend CORS not accepting frontend URL
→ Check `CORS_ORIGINS` in `backend/.env`

### "Cannot connect to database"
→ PostgreSQL not running
→ Check DATABASE_URL credentials

### "Redis connection refused"
→ Redis not running
→ Start Redis server

### "Video upload fails"
→ Celery worker not running
→ Start Celery in Terminal 2

### "Port 8000 already in use"
→ Change PORT in `backend/.env`

---

## 📚 Documentation Files

| File | Location | Content |
|------|----------|---------|
| ENV Setup Guide | `ENV_SETUP_GUIDE.md` | Environment configuration details |
| Backend Docs | `backend/README.md` | Backend overview |
| Setup Guide | `backend/SETUP_GUIDE.md` | Installation instructions |
| API Docs | `backend/API_DOCUMENTATION.md` | All 13 endpoints |
| Quick Reference | `backend/QUICK_REFERENCE.md` | Quick commands |

---

## ✨ Full Stack Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | Ready | http://localhost:5173 |
| Backend API | Ready | http://localhost:8000 |
| Database | Configured | PostgreSQL |
| Cache | Configured | Redis |
| Task Queue | Configured | Celery + Redis |
| AI Processing | Ready | YOLOv8 + OpenCV |

---

## 🎉 You're All Set!

Both frontend and backend are configured and ready to run.

**Next Step:** Open 4 terminals and start the services as shown above.

---

**Happy coding! 🚀**

*TrafficLens - AI-Powered Traffic Analysis Platform*
