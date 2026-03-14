# ✅ Environment Variables - Complete Setup

## Summary

Environment variables for both **frontend** and **backend** have been created and configured for local development.

---

## 📁 Files Created

### Frontend Environment
**Location:** `d:\TrafficLens-ai\.env`

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_BASE_PATH=/api/v1

# Application
VITE_APP_NAME=TrafficLens
VITE_DEBUG=true

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_GUIDED_TOUR=true
VITE_ENABLE_ANALYTICS=true

# Video Upload
VITE_MAX_VIDEO_SIZE=5368709120
VITE_ALLOWED_VIDEO_FORMATS=mp4,mov,avi,mkv

# Analytics
VITE_ENABLE_REAL_TIME_UPDATES=true
UPDATE_INTERVAL=5000

# Theme
VITE_THEME_MODE=dark
```

### Backend Environment
**Location:** `d:\TrafficLens-ai\backend\.env`

```env
# API
DEBUG=true
HOST=0.0.0.0
PORT=8000
RELOAD=true

# Database
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens
DATABASE_ECHO=false

# Redis
REDIS_URL=redis://localhost:6379

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# Upload
MAX_UPLOAD_SIZE=5368709120
ALLOWED_VIDEO_FORMATS=["mp4", "mov", "avi", "mkv"]

# AI Models
YOLO_MODEL=yolov8x.pt
CONFIDENCE_THRESHOLD=0.5

# CORS - IMPORTANT FOR FRONTEND
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"]

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
```

---

## 🔗 How They Connect

```
┌──────────────────────────────────────────────────────┐
│  Frontend (http://localhost:5173)                    │
│  .env → VITE_API_URL=http://localhost:8000          │
│       → VITE_API_BASE_PATH=/api/v1                  │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ HTTP Requests to
                   │
┌──────────────────▼───────────────────────────────────┐
│  Backend (http://localhost:8000)                     │
│  .env → PORT=8000                                   │
│       → CORS_ORIGINS=["http://localhost:5173"]      │
│       → DATABASE_URL=postgresql://...               │
│       → REDIS_URL=redis://localhost:6379            │
└──────────────────┬───────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼──┐  ┌───▼──┐  ┌───▼──┐
    │ PgSQL│  │Redis │  │Tasks │
    └──────┘  └──────┘  └──────┘
```

---

## 🎯 Key Connection Points

### Frontend Calls Backend

```typescript
// Frontend will use these ENV vars to build API URLs
const API_BASE = `${VITE_API_URL}${VITE_API_BASE_PATH}`;
// Results in: http://localhost:8000/api/v1

// Upload video
POST http://localhost:8000/api/v1/videos/upload

// Get analytics
GET http://localhost:8000/api/v1/analytics/video/{id}
```

### Backend Receives Frontend Requests

```python
# Backend CORS allows frontend domain
CORS_ORIGINS=["http://localhost:5173"]

# Backend API ready on port 8000
PORT=8000

# Database and Redis ready
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
```

---

## ⚙️ Services Required

| Service | Port | ENV Variable | Status |
|---------|------|--------------|--------|
| PostgreSQL | 5432 | DATABASE_URL | Must be running |
| Redis | 6379 | REDIS_URL | Must be running |
| Backend API | 8000 | PORT | Created ✅ |
| Frontend Dev | 5173 | N/A | Created ✅ |

---

## 🚀 Complete Startup Sequence

### Step 1: Start External Services

**PostgreSQL:**
```bash
# Windows - if installed
pg_ctl start

# Or Docker
docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
```

**Redis:**
```bash
# Start Redis
redis-server

# Or Docker
docker run -p 6379:6379 redis:7-alpine
```

### Step 2: Start Backend (Terminal 1)

```bash
cd d:\TrafficLens-ai\backend
python main.py
```

### Step 3: Start Celery Worker (Terminal 2)

```bash
cd d:\TrafficLens-ai\backend
celery -A tasks worker --loglevel=info
```

### Step 4: Start Frontend (Terminal 3)

```bash
cd d:\TrafficLens-ai
bun run dev
```

### Step 5: Access Application

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:8000/docs

---

## 📋 Verification Checklist

- [ ] PostgreSQL running on port 5432
- [ ] Redis running on port 6379
- [ ] Backend .env configured in `backend/`
- [ ] Frontend .env configured in root
- [ ] Backend API running on port 8000
- [ ] Celery worker running
- [ ] Frontend dev server running on port 5173
- [ ] CORS_ORIGINS includes frontend URL
- [ ] API_URL points to localhost:8000
- [ ] API_BASE_PATH is /api/v1

---

## 🧪 Test Connection

### From Command Line

```bash
# Test backend is running
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "service": "TrafficLens", ...}
```

### From Browser

```
Backend API Docs: http://localhost:8000/docs
Frontend App:     http://localhost:5173
```

### Test Upload

1. Open http://localhost:5173
2. Click "Upload Video"
3. Select a traffic video
4. Watch processing
5. View results

---

## 🔐 Security Notes

### Development Defaults
```
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=true
```

### For Production, Change To:
```
SECRET_KEY=<generate-secure-random-key>
DEBUG=false
DATABASE_URL=<production-database>
CORS_ORIGINS=<production-domain>
```

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| ENV_SETUP_GUIDE.md | Detailed environment setup |
| STARTUP_GUIDE.md | Quick startup instructions |
| backend/README.md | Backend documentation |
| backend/SETUP_GUIDE.md | Backend installation |
| backend/API_DOCUMENTATION.md | API endpoints |

---

## 🎉 Status: COMPLETE ✅

Both frontend and backend environments are fully configured and ready to connect.

**Next Action:** Follow STARTUP_GUIDE.md to start all services.

---

**Questions?**
- See ENV_SETUP_GUIDE.md for detailed configuration
- See backend/QUICK_REFERENCE.md for quick commands
- Visit http://localhost:8000/docs for API documentation

**Start the application now!** 🚀
