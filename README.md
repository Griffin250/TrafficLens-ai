# TrafficLens - AI-Powered Traffic Video Analytics Platform

<div align="center">

**Intelligent Traffic Analysis Using Computer Vision and Machine Learning**

Automatically analyze traffic videos, detect vehicles, track movements, and generate actionable insights for smart city planning and traffic engineering.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Project Structure](#project-structure) • [Documentation](#documentation)

</div>

---

## Overview

TrafficLens is a modern, full-stack AI platform that automates traffic analysis from video footage. Instead of manual counting and video review, users upload traffic videos and receive detailed analytics powered by cutting-edge computer vision models.

**Key Capability:** Process traffic videos end-to-end to extract vehicle counts, movement patterns, traffic density, and vehicle classification—all automatically.

---

## Features

### 🎬 Video Upload & Management
- Simple web interface for uploading traffic videos
- Support for MP4, MOV, AVI, and MKV formats
- Secure storage with unique video identifiers
- Real-time upload progress tracking

### 🤖 AI-Powered Vehicle Detection
- YOLO-based object detection for vehicles
- Real-time detection of cars, buses, trucks, and motorcycles
- High-accuracy frame-by-frame analysis
- Configurable confidence thresholds

### 📍 Multi-Object Vehicle Tracking
- Continuous tracking of vehicles across frames
- Unique ID assignment for each vehicle
- Trajectory path analysis and movement history
- ByteTrack algorithm for robust tracking

### 📊 Movement Classification & Analytics
- Automatic classification of vehicle movements (left/right/straight)
- Traffic flow statistics and density analysis
- Vehicle type breakdown and distribution reports
- Real-time analytics dashboard

### 📈 Interactive Dashboard
- Real-time visualization of traffic analytics
- Interactive charts and statistics
- Annotated video playback with bounding boxes and trajectories
- Historical data and trend analysis

### 🎯 Annotated Video Output
- Processed videos with visual annotations
- Vehicle bounding boxes and unique IDs
- Trajectory visualization
- Movement classification labels

---

## Tech Stack

### Frontend
- **React** + **TypeScript** - Type-safe UI development
- **Vite** - Lightning-fast build tool and bundler
- **TailwindCSS** - Utility-first styling
- **Recharts** - Data visualization library
- **Framer Motion** - Smooth animations and transitions
- **Shadcn/ui** - Accessible component library
- **Bun** - Ultra-fast JavaScript runtime and package manager

### Backend
- **FastAPI** - High-performance Python API framework
- **Python 3.11** - Modern Python runtime
- **PostgreSQL** - Relational database (optional)
- **SQLAlchemy** - ORM for database operations
- **Celery** - Asynchronous background job processing (optional)
- **Redis** - In-memory task queue and caching (optional)
- **Pydantic** - Data validation and settings management

### AI & Computer Vision
- **YOLOv8** - State-of-the-art object detection model
- **OpenCV** - Video processing and frame extraction
- **ByteTrack** - Multi-object tracking algorithm
- **NumPy & Pandas** - Numerical computing and data analysis
- **Torch & TorchVision** - Deep learning framework

---

## System Architecture

```
User Interface
    │
    ├─► Frontend Web App (React + TypeScript + Netlify)
    │
    ▼
Backend API (FastAPI + Render)
    │
    ├─► Video Upload Handler
    ├─► Job Management
    ├─► Analytics API
    └─► Results API
    │
    ▼
Background Processing (Optional: Celery + Redis)
    │
    ├─► Frame Extraction
    ├─► Vehicle Detection (YOLO)
    ├─► Multi-Object Tracking (ByteTrack)
    ├─► Trajectory Analysis
    └─► Movement Classification
    │
    ▼
Results Storage (PostgreSQL - Optional)
    │
    ▼
Dashboard & Visualization
```

---

## Getting Started

### Prerequisites

#### Frontend
- **Node.js** 18+ and **Bun** package manager
- Git

#### Backend
- **Python** 3.11+
- **pip** or **poetry** (Python package manager)
- **Git**
- **Docker** (optional, for PostgreSQL & Redis)

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd TrafficLens-ai

# Install dependencies with Bun
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run tests
bun run test
```

The frontend will be available at `http://localhost:5173` by default.

---

### Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Create Python Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Run Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs` (Swagger UI)

---

### Optional: Setup Database & Redis (Docker)

If you want to enable database persistence and background job processing:

#### Step 1: Start Docker Containers

From the `backend/` directory:

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379

#### Step 2: Enable in Environment

Edit `.env` and uncomment:

```env
DATABASE_URL=postgresql://traffic_user:traffic_password@localhost:5432/trafficlens
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

#### Step 3: Restart Backend

```bash
uvicorn main:app --reload --port 8000
```

#### Stop Containers

```bash
docker-compose down
```

---

## Running the Full Stack

### Local Development (All Components)

**Terminal 1 - Frontend:**
```bash
cd TrafficLens-ai
bun run dev
```

**Terminal 2 - Backend:**
```bash
cd TrafficLens-ai/backend
source .venv/bin/activate    # or .venv\Scripts\Activate.ps1 on Windows
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Docker (Optional):**
```bash
cd TrafficLens-ai/backend
docker-compose up -d
```

Access:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## Project Structure

```
TrafficLens-ai/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── config.py                  # Configuration management
│   ├── database.py                # Database setup (optional)
│   ├── models.py                  # SQLAlchemy models
│   ├── schemas.py                 # Pydantic schemas
│   ├── tasks.py                   # Celery background tasks (optional)
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment template
│   ├── Dockerfile                  # Docker build configuration
│   ├── docker-compose.yml          # Docker services configuration
│   ├── routes/                     # API route handlers
│   │   ├── videos.py              # Video upload & management
│   │   ├── analytics.py           # Analytics & results
│   │   └── health.py              # Health check endpoints
│   ├── services/                   # Business logic
│   │   ├── video_processor.py     # Video processing pipeline
│   │   └── __init__.py
│   ├── uploads/                    # Uploaded video storage
│   ├── processed/                  # Processed video output
│   └── docs/
│       ├── API_DOCUMENTATION.md    # API reference
│       ├── SETUP_GUIDE.md          # Setup instructions
│       └── IMPLEMENTATION_SUMMARY.md # Implementation details
├── src/
│   ├── components/                # React components
│   │   ├── dashboard/             # Dashboard UI components
│   │   ├── navigation/            # Navigation components
│   │   ├── upload/                # Video upload interface
│   │   ├── ui/                    # Reusable shadcn/ui components
│   │   └── onboarding/            # Guided tour components
│   ├── pages/                     # Page-level components
│   ├── hooks/                     # Custom React hooks
│   ├── services/                  # API integration layer
│   ├── store/                     # State management (Zustand)
│   ├── data/                      # Mock data and fixtures
│   ├── lib/                       # Utility functions
│   ├── test/                      # Unit and integration tests
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
├── docs/
│   ├── About.md                   # Project documentation
│   ├── RENDER_DEPLOYMENT_GUIDE.md # Render deployment guide
│   ├── ENV_CONFIGURATION_COMPLETE.md
│   └── STARTUP_GUIDE.md
├── public/                        # Static assets
├── vite.config.ts                 # Vite build configuration
├── tailwind.config.ts             # TailwindCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── playwright.config.ts           # E2E testing configuration
├── vitest.config.ts               # Unit testing configuration
├── package.json                   # Frontend dependencies
├── bun.lockb                      # Bun lock file
├── README.md                      # This file
└── .gitignore                     # Git ignore rules
```

---

## Video Processing Pipeline

TrafficLens processes videos through the following automated pipeline:

1. **Upload** - User uploads traffic video via web interface
2. **Storage** - Video saved securely to `uploads/` directory
3. **Frame Extraction** - Video decomposed into individual frames
4. **Vehicle Detection** - YOLO model detects vehicles in each frame
5. **Vehicle Tracking** - ByteTrack assigns unique IDs to vehicles
6. **Trajectory Analysis** - Vehicle paths computed and analyzed
7. **Movement Classification** - Vehicle movements classified
8. **Analytics Generation** - Traffic statistics computed
9. **Video Annotation** - Annotated video with visual overlays created
10. **Results Storage** - Analytics and videos saved (to database if enabled)
11. **Dashboard Display** - Results presented via interactive interface

---

## API Endpoints

### Core Endpoints

**Videos:**
- `POST /api/v1/videos/upload` - Upload video for analysis
- `GET /api/v1/videos/{video_id}` - Get video details
- `GET /api/v1/videos` - List all videos
- `DELETE /api/v1/videos/{video_id}` - Delete video

**Analytics:**
- `GET /api/v1/analytics/{video_id}` - Get video analysis results
- `GET /api/v1/analytics/dashboard` - Get dashboard metrics
- `GET /api/v1/analytics/{video_id}/detections` - Get vehicle detections

**Health:**
- `GET /health` - API health check
- `GET /api/health` - API health check (v1)

Full API documentation available at `/docs` when running backend.

---

## User Workflow

```
1. Open TrafficLens at http://localhost:5173
        ↓
2. Upload Traffic Video (MP4, MOV, AVI, MKV)
        ↓
3. Backend Processes Video (Frame by frame)
        ↓
4. View Analytics & Results in Dashboard
        ↓
5. Download Annotated Video & Reports
        ↓
6. Use Insights for Traffic Planning
```

---

## Example Output

After processing a traffic video, TrafficLens generates comprehensive analytics:

```
Total Vehicles Detected: 132

Movement Distribution:
  • Left Turns: 41 (31%)
  • Right Turns: 28 (21%)
  • Straight: 63 (48%)

Vehicle Breakdown:
  • Cars: 96 (73%)
  • Motorcycles: 18 (14%)
  • Buses: 7 (5%)
  • Trucks: 11 (8%)

Traffic Density: Medium
Peak Flow Direction: North-South
Average Speed: 35 km/h
```

---

## Use Cases

- **City Traffic Planning** - Understand intersection behavior and optimize traffic signals
- **Transportation Engineering** - Analyze road usage patterns for infrastructure planning
- **Smart City Development** - Implement data-driven traffic management solutions
- **Academic Research** - Traffic pattern analysis and behavioral studies
- **Road Safety** - Identify high-risk intersections and accident-prone areas
- **Traffic Consulting** - Generate professional reports for clients

---

## Future Enhancements

TrafficLens roadmap includes:
- 🚗 Vehicle speed estimation and tracking
- 🛣️ Lane detection and analysis
- 🚨 Real-time congestion detection and alerts
- ⚠️ Automated accident detection capabilities
- 👥 Pedestrian detection and tracking
- 📡 Real-time live camera stream analysis
- 🌐 Smart city platform integration
- 📊 Advanced predictive analytics and forecasting
- 🔐 Multi-camera coordination and stitching

---

## Development Setup

### Available Scripts

#### Frontend

```bash
# Development
bun run dev              # Start dev server with hot reload
bun run build            # Build for production
bun run preview          # Preview production build locally

# Testing
bun run test             # Run unit tests (Vitest)
bun run test:ui          # Open test UI
bun run test:coverage    # Generate coverage report

# Quality
bun run lint             # Run ESLint
bun run type-check       # Check TypeScript types

# E2E Testing
bun run e2e              # Run Playwright tests
```

#### Backend

```bash
# Development
uvicorn main:app --reload --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000

# Run specific module
python -m main
```

---

## Troubleshooting

### Backend Issues

**Issue: `connection to server at "localhost" (127.0.0.1), port 5432 failed`**
- Database is not running. Either:
  - Start Docker: `docker-compose up -d`
  - Or leave database disabled in `.env` (comment out `DATABASE_URL`)

**Issue: `Connection to Redis lost`**
- Redis is not running. Either:
  - Start Docker: `docker-compose up -d`
  - Or leave Redis disabled in `.env` (comment out `REDIS_URL` and Celery variables)

**Issue: `Port 8000 already in use`**
- Change port: `uvicorn main:app --port 8001`
- Or kill process using port 8000

**Issue: Python module not found**
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Issue: `npm ERR! code ENOENT`**
- Install dependencies: `bun install`

**Issue: Port 5173 already in use**
- Kill process or change port: `bun run dev -- --port 3000`

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

---

## Deployment

### Deploy Frontend on Netlify

See [docs/RENDER_DEPLOYMENT_GUIDE.md](docs/RENDER_DEPLOYMENT_GUIDE.md#step-6-connect-frontend-to-backend) for complete Netlify setup instructions.

### Deploy Backend on Render

See [docs/RENDER_DEPLOYMENT_GUIDE.md](docs/RENDER_DEPLOYMENT_GUIDE.md) for complete Render deployment guide including:
- Docker configuration
- Environment setup
- Database & Redis provisioning
- CI/CD integration

---

## Documentation

- [About TrafficLens](docs/About.md) - Comprehensive project overview and architecture details
- [Render Deployment Guide](docs/RENDER_DEPLOYMENT_GUIDE.md) - Complete deployment guide for production
- [Backend Setup Guide](backend/docs/SETUP_GUIDE.md) - Backend configuration details
- [API Documentation](backend/docs/API_DOCUMENTATION.md) - Complete API reference
- [Implementation Summary](backend/docs/IMPLEMENTATION_SUMMARY.md) - Technical implementation details

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Questions

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [docs/](docs/) folder for detailed documentation

---

<div align="center">

**TrafficLens - Making traffic analysis smarter, faster, and more accessible**

*Powered by Computer Vision & AI for Smart Cities*

Built with ❤️ using React, FastAPI, and YOLO

</div>
