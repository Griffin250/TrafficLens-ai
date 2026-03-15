# TrafficLens Backend Deployment Guide - Render

## Overview

This guide provides step-by-step instructions to deploy the TrafficLens backend on Render while keeping the frontend on Netlify. Render provides a simple, cloud-based solution for hosting web applications with integrated PostgreSQL and Redis support.

**Architecture:**
- **Frontend**: Netlify (TrafficLens UI)
- **Backend**: Render (FastAPI + Python)
- **Database**: Render PostgreSQL
- **Cache**: Render Redis

---

## Prerequisites

Before starting, ensure you have:

1. **GitHub Account** - Repository with TrafficLens code pushed
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Git Installed** - For version control
4. **Local Repository** - TrafficLens project synced with GitHub

### Project Structure
```
TrafficLens-ai/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── src/
│   ├── services/
│   │   └── api.ts
│   └── ...
├── render.yaml (to create)
└── .gitignore
```

---

## Step 1: Prepare Your Repository

### 1.1 Create Backend `.gitignore`

Ensure sensitive files aren't committed:

```bash
# backend/.gitignore
.env
.env.local
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.egg-info/
.venv/
venv/
ENV/
uploads/
processed/
.DS_Store
*.sqlite
*.db
```

### 1.2 Create `.env.example` File

**File**: `backend/.env.example`

```env
# ==================== API Configuration ====================
DEBUG=false
HOST=0.0.0.0
PORT=8000
RELOAD=false

# ==================== Database Configuration ====================
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens
DATABASE_ECHO=false

# ==================== Redis Configuration ====================
REDIS_URL=redis://localhost:6379

# ==================== Celery Configuration ====================
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# ==================== File Upload Configuration ====================
MAX_UPLOAD_SIZE=5368709120
ALLOWED_VIDEO_FORMATS=["mp4", "mov", "avi", "mkv"]
UPLOAD_DIRECTORY=/tmp/uploads
PROCESSED_DIRECTORY=/tmp/processed

# ==================== AI Model Configuration ====================
YOLO_MODEL=yolov8x.pt
CONFIDENCE_THRESHOLD=0.5
IOU_THRESHOLD=0.45

# ==================== Video Processing ====================
TARGET_FPS=30
FRAME_SKIP=1
VIDEO_CODEC=mp4v

# ==================== CORS Configuration ====================
CORS_ORIGINS=["https://yourdomain.netlify.app", "https://your-backend.onrender.com"]

# ==================== Security ====================
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ==================== Tracking Configuration ====================
TRACK_METHOD=bytetrack
MAX_AGE=30
MIN_HITS=3

# ==================== Logging ====================
LOG_LEVEL=info
```

---

## Step 2: Create Render Configuration File

### 2.1 Create `render.yaml` (Root Directory)

**File**: `render.yaml` (at project root, not in backend/)

```yaml
services:
  # ==================== FastAPI Backend ====================
  - type: web
    name: trafficlens-backend
    env: python
    region: oregon
    plan: standard
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    rootDir: backend
    
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
      
      - key: DATABASE_URL
        fromDatabase:
          name: trafficlens-db
          property: connectionString
      
      - key: REDIS_URL
        fromService:
          name: trafficlens-redis
          type: pserv
          property: connectionString
      
      - key: DEBUG
        value: "false"
      
      - key: RELOAD
        value: "false"
      
      - key: HOST
        value: 0.0.0.0
      
      - key: SECRET_KEY
        generateValue: true
      
      - key: ALGORITHM
        value: HS256
      
      - key: ACCESS_TOKEN_EXPIRE_MINUTES
        value: 30
      
      - key: YOLO_MODEL
        value: yolov8x.pt
      
      - key: CONFIDENCE_THRESHOLD
        value: "0.5"
      
      - key: IOU_THRESHOLD
        value: "0.45"
      
      - key: UPLOAD_DIRECTORY
        value: /tmp/uploads
      
      - key: PROCESSED_DIRECTORY
        value: /tmp/processed
      
      - key: MAX_UPLOAD_SIZE
        value: "5368709120"
      
      - key: CORS_ORIGINS
        value: '["https://yourdomain.netlify.app", "https://trafficlens-backend.onrender.com"]'
      
      - key: TRACK_METHOD
        value: bytetrack
      
      - key: MAX_AGE
        value: "30"
      
      - key: MIN_HITS
        value: "3"

  # ==================== PostgreSQL Database ====================
  - type: pserv
    name: trafficlens-db
    env: postgres
    plan: free
    postgresVersion: 15
    ipAllowList: [] # Allow all IPs

  # ==================== Redis Cache ====================
  - type: redis
    name: trafficlens-redis
    plan: free
    region: oregon
```

### 2.2 Create Startup Script (Optional but Recommended)

**File**: `backend/render-start.sh`

```bash
#!/bin/bash
set -e

echo "Starting TrafficLens Backend..."
echo "Python Version: $(python --version)"

# Create required directories
mkdir -p /tmp/uploads
mkdir -p /tmp/processed

# Run migrations if using Alembic
# python -m alembic upgrade head

# Start the application
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Make it executable:
```bash
chmod +x backend/render-start.sh
```

Then update `render.yaml` startCommand:
```yaml
startCommand: bash render-start.sh
```

---

## Step 3: Update Backend Configuration

### 3.1 Update `backend/config.py`

Ensure environment variable loading supports Render:

```python
from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrafficLens"
    PROJECT_DESCRIPTION: str = "AI-Powered Traffic Analysis System"
    VERSION: str = "1.0.0"
    
    # API Configuration
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    RELOAD: bool = os.getenv("RELOAD", "false").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://traffic_user:traffic_password@localhost:5432/trafficlens")
    DATABASE_ECHO: bool = os.getenv("DATABASE_ECHO", "false").lower() == "true"
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # File Upload
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", 5368709120))
    ALLOWED_VIDEO_FORMATS: list = ["mp4", "mov", "avi", "mkv"]
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "uploads")
    PROCESSED_DIRECTORY: str = os.getenv("PROCESSED_DIRECTORY", "processed")
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://yourdomain.netlify.app"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
```

### 3.2 Update `backend/main.py` for Render

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from contextlib import asynccontextmanager

from config import get_settings
from models import Base
from database import engine
from routes import videos, analytics, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context manager"""
    logger.info("Starting TrafficLens Backend...")
    
    # Create database tables
    if engine:
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Failed to create database tables: {e}")
    
    # Create upload directories
    os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
    os.makedirs(settings.PROCESSED_DIRECTORY, exist_ok=True)
    logger.info(f"Created upload directory: {settings.UPLOAD_DIRECTORY}")
    logger.info(f"Created processed directory: {settings.PROCESSED_DIRECTORY}")
    
    yield
    
    logger.info("Shutting down TrafficLens Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(videos.router, prefix="/api/videos", tags=["Videos"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def read_root():
    return {
        "message": "TrafficLens Backend",
        "version": settings.VERSION,
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
```

---

## Step 4: Push to GitHub

```bash
cd /path/to/TrafficLens-ai

# Add all new files
git add render.yaml backend/.env.example backend/render-start.sh

# Commit changes
git commit -m "Add Render deployment configuration"

# Push to GitHub
git push origin main
```

---

## Step 5: Deploy on Render

### 5.1 Initial Setup

1. Go to [render.com](https://render.com)
2. Click **Sign up** or **Sign in** with GitHub
3. Authorize Render to access your GitHub repositories
4. Click **New** in the top right
5. Select **Blueprint**

### 5.2 Select Repository

1. Choose your TrafficLens repository
2. Confirm branch (usually `main`)
3. Click **Create from Blueprint**

### 5.3 Configure Environment

Render will auto-detect `render.yaml` and show service configuration.

**Review the following:**

- **Service Name**: `trafficlens-backend`
- **Region**: Oregon (or your preference)
- **Plan**: Standard (free tier available)
- **Root Directory**: `backend`

### 5.4 Set Additional Environment Variables

After services are created, go to the backend service settings:

1. Click **Environment** in the sidebar
2. Add/verify these variables:

| Key | Value | Type |
|-----|-------|------|
| `SECRET_KEY` | Generate a new secure key | Plain Text |
| `DEBUG` | false | Plain Text |
| `CORS_ORIGINS` | `["https://yourdomain.netlify.app"]` | Plain Text |

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## Step 6: Connect Frontend to Backend

### 6.1 Update Frontend API Service

**File**: `src/services/api.ts`

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://trafficlens-backend.onrender.com'
    : 'http://localhost:8000');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 6.2 Add Netlify Environment Variables

1. Go to Netlify dashboard
2. Select your TrafficLens site
3. **Settings** → **Build & deploy** → **Environment**
4. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://trafficlens-backend.onrender.com`

### 6.3 Update Netlify Build Configuration

**File**: `netlify.toml` (root directory)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/api/*"
  to = "https://trafficlens-backend.onrender.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Step 7: Update Backend CORS Settings

After getting your Render deployment URL, update the backend CORS origins:

**In Render Dashboard:**
1. Go to **trafficlens-backend** service
2. Click **Environment**
3. Update `CORS_ORIGINS`:
   ```
   ["https://yourdomain.netlify.app", "https://trafficlens-backend.onrender.com"]
   ```
4. Click **Save** - deployment will auto-restart

---

## Step 8: Handle YOLO Model Download

YOLO models are large (~300MB). For production:

### Option 1: Download During Build (Recommended)

**Create `backend/download_models.py`:**
```python
from ultralytics import YOLO
import os

def download_models():
    """Download YOLO models during build"""
    model_path = os.getenv("YOLO_MODEL", "yolov8x.pt")
    print(f"Downloading {model_path}...")
    YOLO(model_path)
    print(f"{model_path} downloaded successfully")

if __name__ == "__main__":
    download_models()
```

**Update `render.yaml` buildCommand:**
```yaml
buildCommand: pip install -r requirements.txt && python download_models.py
```

### Option 2: Use External Storage

Store models in AWS S3 or similar, download on startup.

---

## Step 9: Database Management

### 9.1 Access PostgreSQL on Render

**Via Render Dashboard:**
1. Go to **trafficlens-db** service
2. Copy connection string from **Info** section

**Via Terminal:**
```bash
psql <connection-string-from-render>
```

### 9.2 Create Initial Database

Render auto-creates the database. To initialize data:

1. Create `backend/init_db.py`:
```python
from database import engine
from models import Base

Base.metadata.create_all(bind=engine)
print("Database tables created successfully")
```

2. Run on first deployment

---

## Step 10: Verify Deployment

### Check Backend Health

```bash
curl https://trafficlens-backend.onrender.com/health
```

Expected response:
```json
{"status": "ok"}
```

### Test API Connection

In Netlify or locally:
```typescript
fetch('https://trafficlens-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

### View Backend Logs

1. Go to Render dashboard
2. Click **trafficlens-backend** service
3. Click **Logs** tab
4. Monitor real-time logs

---

## Troubleshooting

### Issue: "Port 8000 already in use"

**Solution**: Render automatically assigns $PORT. Ensure code uses:
```python
port = int(os.getenv("PORT", 8000))
```

### Issue: Database Connection Failed

**Check:**
1. Verify DATABASE_URL in Render environment
2. Wait 2-3 minutes for PostgreSQL to initialize
3. Check database logs: **trafficlens-db** → **Logs**

### Issue: YOLO Model Not Found

**Solution:**
1. Increase build timeout in Render settings
2. Pre-download models during build
3. Use `download_models.py` script

### Issue: Large File Uploads Fail

**Solution:**
1. Increase `MAX_UPLOAD_SIZE` in environment
2. Use Render Disk (paid) for persistent storage
3. Implement S3 upload for production

### Issue: CORS Errors

**Check:**
1. Verify `CORS_ORIGINS` includes your Netlify domain
2. Restart backend service
3. Clear browser cache
4. Test with `curl -H "Origin: https://yourdomain.netlify.app"`

### Issue: Cold Start Takes Too Long

**Solution:**
1. Upgrade from free to paid tier
2. Keep-alive: Use services like UptimeRobot
3. Pre-warm by hitting `/health` endpoint periodically

---

## Important Limitations & Notes

### Render Free Tier

| Feature | Free | Paid |
|---------|------|------|
| Services | Unlimited | Unlimited |
| Monthly usage hours | 750 | Unlimited |
| Auto-sleeps | After 15 min inactivity | No |
| Disk storage | Ephemeral | Persistent |
| Database backups | 7 days | 30 days |

### Storage Considerations

- Render free tier uses **ephemeral storage** (deleted on redeploy)
- Upload files are **lost after redeploy**
- **Solutions:**
  - Use AWS S3 for uploaded videos
  - Use Render Disk (paid feature)
  - Use external storage service

### Security Best Practices

1. **Never commit `.env`** - Use `.env.example` only
2. **Generate new SECRET_KEY** - Don't use default
3. **Use HTTPS only** - All traffic encrypted
4. **Rotate passwords** - Change DB password after setup
5. **Enable IP whitelist** - If needed

### Performance Optimization

1. **Cache responses** - Use Redis
2. **Compress videos** - Reduce upload size
3. **Process asynchronously** - Use Celery + Redis
4. **CDN for assets** - Use Netlify/Cloudflare

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Connect frontend on Netlify
3. ⏳ Set up video processing pipeline
4. ⏳ Configure S3 for file storage
5. ⏳ Set up monitoring & alerts
6. ⏳ Optimize performance

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Netlify Docs**: https://docs.netlify.com

---

## Deployment Checklist

- [ ] Created `render.yaml` in repository root
- [ ] Created `backend/.env.example`
- [ ] Updated `backend/config.py` for environment variables
- [ ] Updated `backend/main.py` with proper CORS
- [ ] Created `backend/render-start.sh` (optional)
- [ ] Pushed all changes to GitHub
- [ ] Deployed via Render Blueprint
- [ ] Set environment variables in Render
- [ ] Updated frontend API endpoint
- [ ] Added `REACT_APP_API_URL` to Netlify
- [ ] Updated Netlify build configuration
- [ ] Tested API connectivity
- [ ] Verified database connection
- [ ] Checked backend health endpoint
- [ ] Tested file uploads (if applicable)
- [ ] Monitored logs for errors

---

**Last Updated**: March 15, 2026
**Version**: 1.0.0
