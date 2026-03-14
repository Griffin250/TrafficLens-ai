# 🎯 Environment Variables - At a Glance

## ✅ COMPLETE - Both Ends Connected

Environment variables for **frontend** and **backend** have been created and configured.

---

## 📁 Files Created

```
d:\TrafficLens-ai\
├── .env                          ✅ Frontend configuration
└── backend\
    └── .env                      ✅ Backend configuration
```

---

## 🔌 Connection Architecture

```
FRONTEND                          BACKEND                         SERVICES
(Port 5173)                       (Port 8000)
┌─────────────────┐              ┌──────────────────┐           ┌─────────────┐
│                 │              │                  │           │ PostgreSQL  │
│  React App      │◄────HTTP─────►  FastAPI Server  │◄─────────►│ (5432)      │
│  (localhost:    │ /api/v1       │ (localhost:     │ DB        └─────────────┘
│   5173)         │ endpoints     │  8000)          │
│                 │              │                  │           ┌─────────────┐
│ .env            │              │ .env             │───────────►  Redis      │
│ configured ✅    │              │ configured ✅     │ Queue     │ (6379)      │
└─────────────────┘              └──────────────────┘           └─────────────┘
                                        │
                                        │
                                  ┌─────▼──────┐
                                  │   Celery   │
                                  │   Worker   │
                                  │ Processing │
                                  └────────────┘
```

---

## 📝 Frontend .env (Root Directory)

```env
VITE_API_URL=http://localhost:8000              ← Backend server
VITE_API_BASE_PATH=/api/v1                      ← API version path
VITE_DEBUG=true                                 ← Debug mode on
VITE_MAX_VIDEO_SIZE=5368709120                  ← 5GB upload limit
```

**Result:** Frontend connects to `http://localhost:8000/api/v1`

---

## 📝 Backend .env (Backend Directory)

```env
# Server
PORT=8000                                       ← Server port
DEBUG=true                                      ← Debug mode

# Database
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens

# Queue
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0

# CORS (Frontend Access)
CORS_ORIGINS=["http://localhost:5173"]          ← Allows frontend requests

# AI Models
YOLO_MODEL=yolov8x.pt
CONFIDENCE_THRESHOLD=0.5
```

---

## 🚀 Quick Start (4 Terminals)

### Terminal 1: Backend API
```bash
cd backend
python main.py
→ Running on http://localhost:8000
```

### Terminal 2: Celery Worker
```bash
cd backend
celery -A tasks worker --loglevel=info
→ Ready for video processing
```

### Terminal 3: Frontend Dev
```bash
bun run dev
→ Running on http://localhost:5173
```

### Terminal 4: External Services
```bash
# PostgreSQL (if not already running)
psql -U postgres

# Redis (if not already running)
redis-server
```

---

## ✅ Verification

| Check | Command | Expected |
|-------|---------|----------|
| Backend Health | `curl http://localhost:8000/health` | 200 OK |
| API Docs | Open http://localhost:8000/docs | Swagger UI |
| Frontend | Open http://localhost:5173 | TrafficLens UI |

---

## 🔗 Data Flow

```
1. User opens frontend:        http://localhost:5173
                               ↓
2. Frontend reads .env:        VITE_API_URL=http://localhost:8000
                               ↓
3. Frontend builds URL:        http://localhost:8000/api/v1
                               ↓
4. User uploads video:         POST /api/v1/videos/upload
                               ↓
5. Backend saves to storage    + Creates DB record
                               ↓
6. Celery queues task         Redis: redis://localhost:6379/0
                               ↓
7. Worker processes video     YOLOv8 detection + tracking
                               ↓
8. Results saved              PostgreSQL database
                               ↓
9. Frontend retrieves         GET /api/v1/analytics/video/{id}
                               ↓
10. Results displayed         Dashboard on frontend
```

---

## 📊 Environment Variable Mapping

| Frontend .env | Becomes | Backend .env | Uses |
|---------------|---------|--------------|------|
| VITE_API_URL | http://localhost:8000 | PORT=8000 | ✓ |
| VITE_API_BASE_PATH | /api/v1 | Routes | ✓ |
| — | — | CORS_ORIGINS | ✓ |
| — | — | DATABASE_URL | PostgreSQL |
| — | — | REDIS_URL | Task queue |

---

## 🎯 What Each Service Does

| Service | Port | .env Config | Purpose |
|---------|------|------------|---------|
| Frontend | 5173 | .env (root) | UI, user interactions |
| Backend | 8000 | .env (backend) | API, data processing |
| PostgreSQL | 5432 | DATABASE_URL | Store data |
| Redis | 6379 | REDIS_URL | Task queue, cache |
| Celery | — | CELERY_BROKER_URL | Video processing |

---

## 🔄 Request Example

### Frontend Code
```typescript
// Uses environment variables
const response = await fetch(
  `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH}/videos/upload`,
  { method: 'POST', body: formData }
);
```

### Actual URL Constructed
```
http://localhost:8000/api/v1/videos/upload
```

### Backend Receives
- CORS check ✓ (CORS_ORIGINS includes localhost:5173)
- Routes to `/api/v1/videos/upload` endpoint
- Saves video to disk
- Creates database record
- Queues Celery task
- Returns response to frontend

---

## 📋 Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| CORS error | Check `CORS_ORIGINS` includes frontend URL |
| 404 errors | Check `VITE_API_URL` and `VITE_API_BASE_PATH` |
| DB connection error | Start PostgreSQL + check DATABASE_URL |
| Redis error | Start Redis server |
| Video upload fails | Start Celery worker in Terminal 2 |

---

## 🎉 Status

```
✅ Frontend .env created        (d:\TrafficLens-ai\.env)
✅ Backend .env created         (d:\TrafficLens-ai\backend\.env)
✅ CORS configured              (localhost:5173 allowed)
✅ API URL configured           (http://localhost:8000/api/v1)
✅ Database configured          (PostgreSQL connection)
✅ Cache configured             (Redis connection)
✅ Task queue configured        (Celery + Redis)
✅ Ready to start               (Follow startup guides)
```

---

## 📚 Next Steps

1. **Read:** STARTUP_GUIDE.md (quick overview)
2. **Run:** Backend + Celery + Frontend (3 terminals)
3. **Test:** Upload video and check results
4. **Develop:** Build your features

---

## 📖 Documentation Files

- `ENV_SETUP_GUIDE.md` - Detailed configuration explained
- `ENV_VARIABLES_SUMMARY.md` - This file
- `STARTUP_GUIDE.md` - How to start everything
- `backend/README.md` - Backend documentation
- `backend/QUICK_REFERENCE.md` - Quick commands

---

**Everything is configured and ready to go! 🚀**

Start the application following STARTUP_GUIDE.md
