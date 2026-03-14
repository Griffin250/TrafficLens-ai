# Environment Setup Guide - Frontend & Backend Connection

## 🔗 Frontend & Backend Configuration

Both frontend and backend environment files have been created. Here's what you need to do:

---

## 📁 Frontend Configuration

**File Location:** `d:\TrafficLens-ai\.env`

### Frontend Environment Variables

```bash
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
VITE_UPDATE_INTERVAL=5000

# Theme
VITE_THEME_MODE=dark
```

### What Each Variable Does

| Variable | Purpose | Value |
|----------|---------|-------|
| `VITE_API_URL` | Backend base URL | `http://localhost:8000` |
| `VITE_API_BASE_PATH` | API version path | `/api/v1` |
| `VITE_APP_NAME` | Application name | `TrafficLens` |
| `VITE_DEBUG` | Debug mode | `true` or `false` |
| `VITE_ENABLE_MOCK_DATA` | Use mock data in dev | `true` or `false` |
| `VITE_ENABLE_GUIDED_TOUR` | Show onboarding | `true` or `false` |
| `VITE_MAX_VIDEO_SIZE` | Max upload size (bytes) | `5368709120` (5GB) |
| `VITE_THEME_MODE` | UI theme | `dark` or `light` |

### Frontend API Endpoint Construction

The frontend will combine these to create API URLs:

```typescript
// Example in frontend code:
const API_URL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}`;

// Results in:
// http://localhost:8000/api/v1
```

---

## 🗄️ Backend Configuration

**File Location:** `d:\TrafficLens-ai\backend\.env`

### Backend Environment Variables

```bash
# ==================== API Configuration ====================
DEBUG=true
HOST=0.0.0.0
PORT=8000
RELOAD=true

# ==================== Database ====================
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens

# ==================== Redis & Celery ====================
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# ==================== File Upload ====================
MAX_UPLOAD_SIZE=5368709120
ALLOWED_VIDEO_FORMATS=["mp4", "mov", "avi", "mkv"]

# ==================== AI Models ====================
YOLO_MODEL=yolov8x.pt
CONFIDENCE_THRESHOLD=0.5

# ==================== CORS (Important for Frontend) ====================
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"]

# ==================== Security ====================
SECRET_KEY=your-super-secret-key-change-this-in-production
```

### Key Backend Settings for Frontend Connection

| Setting | Value | Purpose |
|---------|-------|---------|
| `PORT` | `8000` | Backend server port |
| `CORS_ORIGINS` | `["http://localhost:5173"]` | Allow frontend requests |
| `DATABASE_URL` | PostgreSQL connection | Data persistence |
| `REDIS_URL` | Redis connection | Task queue |

---

## ⚙️ Required Services

Before starting the application, ensure these services are running:

### 1. PostgreSQL Database

```bash
# Windows (if installed)
pg_ctl -D "C:\Program Files\PostgreSQL\data" start

# Or use Docker
docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine
```

**Setup database:**
```sql
CREATE DATABASE trafficlens;
CREATE USER traffic_user WITH PASSWORD 'traffic_password';
GRANT ALL PRIVILEGES ON DATABASE trafficlens TO traffic_user;
```

### 2. Redis Server

```bash
# Windows/macOS
redis-server

# Or use Docker
docker run -p 6379:6379 redis:7-alpine
```

**Verify:** `redis-cli ping` → Should return `PONG`

---

## 🚀 Starting Both Frontend & Backend

### Terminal 1: Backend API Server

```bash
cd d:\TrafficLens-ai\backend
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Celery Worker (Required for video processing)

```bash
cd d:\TrafficLens-ai\backend
celery -A tasks worker --loglevel=info
```

**Expected output:**
```
[2024-03-14 10:00:00,000: INFO/MainProcess] celery@hostname ready.
```

### Terminal 3: Frontend Development Server

```bash
cd d:\TrafficLens-ai
bun run dev
```

**Expected output:**
```
VITE v4.5.0 ready in 123 ms

➜  Local:   http://localhost:5173/
```

---

## ✅ Verification Checklist

### Backend Health

```bash
# Check API is running
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "timestamp": "...", "service": "TrafficLens", "version": "1.0.0"}
```

### API Documentation

Open in browser:
```
http://localhost:8000/docs
```

You should see interactive Swagger documentation for all 13 endpoints.

### Frontend Connection

Open in browser:
```
http://localhost:5173
```

You should see the TrafficLens UI loading.

---

## 📡 Testing API Connection from Frontend

### Example: Upload Video

```typescript
// In frontend code
const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}/videos/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  return response.json();
};

// Actual URL: http://localhost:8000/api/v1/videos/upload
```

### Example: Get Analytics

```typescript
// In frontend code
const getAnalytics = async (videoId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}/analytics/video/${videoId}`
  );
  
  return response.json();
};

// Actual URL: http://localhost:8000/api/v1/analytics/video/{videoId}
```

---

## 🔧 Configuration for Different Environments

### Development (Local)

```bash
# Frontend
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true

# Backend
DEBUG=true
RELOAD=true
CORS_ORIGINS=["http://localhost:5173"]
```

### Production

```bash
# Frontend
VITE_API_URL=https://api.trafficlens.com
VITE_DEBUG=false

# Backend
DEBUG=false
RELOAD=false
CORS_ORIGINS=["https://trafficlens.com"]
SECRET_KEY=<change-to-secure-key>
DATABASE_URL=<production-database>
```

---

## 🚨 Common Issues & Solutions

### Issue: "CORS error" in Browser Console

**Cause:** Backend CORS not configured for frontend URL

**Solution:** Update backend `.env`:
```bash
# backend/.env
CORS_ORIGINS=["http://localhost:5173"]
```

Then restart backend.

### Issue: "Cannot connect to database"

**Cause:** PostgreSQL not running or wrong credentials

**Solution:**
```bash
# Check PostgreSQL
psql -U traffic_user -d trafficlens

# Or start with Docker
docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
```

### Issue: "Redis connection refused"

**Cause:** Redis server not running

**Solution:**
```bash
# Start Redis
redis-server

# Or with Docker
docker run -p 6379:6379 redis:7-alpine
```

### Issue: "Video upload fails"

**Cause:** Celery worker not running or network issue

**Solution:**
```bash
# Check Celery is running in Terminal 2
# Verify backend is accessible from frontend
curl http://localhost:8000/health
```

---

## 📊 Environment Variables Summary

### Frontend (.env)
- Controls API endpoint connection
- Feature toggles
- UI theme settings
- Upload constraints

### Backend (.env)
- Controls server port and debug mode
- Database credentials
- Redis/Celery configuration
- CORS for frontend access
- AI model settings
- Security keys

---

## 🎯 Next Steps

1. ✅ Environment files created (`.env` and `backend/.env`)
2. **Start PostgreSQL** - `psql` or Docker
3. **Start Redis** - `redis-server` or Docker
4. **Start Backend** - `python main.py` in Terminal 1
5. **Start Celery** - `celery -A tasks worker` in Terminal 2
6. **Start Frontend** - `bun run dev` in Terminal 3
7. **Visit UI** - http://localhost:5173
8. **Test Upload** - Upload a traffic video
9. **View Results** - Check analytics in dashboard

---

## 📚 Additional Resources

- [Frontend Configuration](d:\TrafficLens-ai\.env)
- [Backend Configuration](d:\TrafficLens-ai\backend\.env)
- [Backend Setup Guide](d:\TrafficLens-ai\backend\SETUP_GUIDE.md)
- [Backend API Docs](d:\TrafficLens-ai\backend\API_DOCUMENTATION.md)
- [Backend Quick Start](d:\TrafficLens-ai\backend\START_HERE.md)

---

**Environment Configuration Complete! ✅**

Both frontend and backend are ready to connect. Follow the startup steps above to run the full application.
