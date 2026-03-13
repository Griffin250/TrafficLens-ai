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
- Support for MP4, MOV, and AVI formats
- Secure storage with unique video identifiers

### 🤖 AI-Powered Vehicle Detection
- YOLO-based object detection for vehicles
- Real-time detection of cars, buses, trucks, and motorcycles
- High-accuracy frame-by-frame analysis

### 📍 Multi-Object Vehicle Tracking
- Continuous tracking of vehicles across frames
- Unique ID assignment for each vehicle
- Trajectory path analysis and movement history

### 📊 Movement Classification & Analytics
- Automatic classification of vehicle movements (left/right/straight)
- Traffic flow statistics and density analysis
- Vehicle type breakdown and distribution reports

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

### Backend (To Be Implemented)
- **FastAPI** - High-performance Python API framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Celery** - Asynchronous background job processing
- **Redis** - In-memory task queue and caching

### AI & Computer Vision (To Be Implemented)
- **YOLOv8** - State-of-the-art object detection model
- **OpenCV** - Video processing and frame extraction
- **ByteTrack / SORT** - Multi-object tracking algorithms
- **NumPy / Pandas** - Numerical computing and data analysis

---

## System Architecture

```
User Interface
    │
    ├─► Frontend Web App (React + TypeScript)
    │
    ▼
Backend API (FastAPI) [In Development]
    │
    ├─► Video Upload Handler
    ├─► Job Management
    └─► Results API
    │
    ▼
Background Processing (Celery + Redis) [In Development]
    │
    ├─► Frame Extraction
    ├─► Vehicle Detection (YOLO)
    ├─► Multi-Object Tracking
    ├─► Trajectory Analysis
    └─► Movement Classification
    │
    ▼
Results Storage (PostgreSQL) [In Development]
    │
    ▼
Dashboard & Visualization
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and **Bun** package manager
- **Python** 3.9+ (for backend, when implementing)
- **PostgreSQL** database (for backend, when implementing)
- **Redis** server (for backend, when implementing)

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

### Backend Setup (Coming Soon)

Complete backend implementation and setup documentation will be provided as development progresses.

---

## Project Structure

```
TrafficLens-ai/
├── src/
│   ├── components/           # React components
│   │   ├── dashboard/        # Dashboard UI components
│   │   ├── navigation/       # Navigation components
│   │   ├── upload/           # Video upload interface
│   │   ├── ui/               # Reusable shadcn/ui components
│   │   └── onboarding/       # Guided tour components
│   ├── pages/                # Page-level components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API integration layer
│   ├── store/                # State management (Zustand)
│   ├── data/                 # Mock data and fixtures
│   ├── lib/                  # Utility functions and helpers
│   ├── test/                 # Unit and integration tests
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── docs/
│   └── About.md              # Detailed project documentation
├── public/                   # Static assets
├── vite.config.ts            # Vite build configuration
├── tailwind.config.ts        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
├── playwright.config.ts      # E2E testing configuration
├── vitest.config.ts          # Unit testing configuration
└── package.json              # Dependencies and npm scripts
```

---

## Video Processing Pipeline

TrafficLens processes videos through the following automated pipeline:

1. **Upload** - User uploads traffic video via web interface
2. **Storage** - Video saved securely to server storage
3. **Frame Extraction** - Video decomposed into individual frames
4. **Vehicle Detection** - YOLO model detects vehicles in each frame
5. **Vehicle Tracking** - Multi-object tracking assigns unique IDs
6. **Trajectory Analysis** - Vehicle paths computed and analyzed
7. **Movement Classification** - Vehicle movements classified (left/right/straight)
8. **Analytics Generation** - Traffic statistics and insights computed
9. **Video Annotation** - Annotated video created with visual overlays
10. **Results Storage** - Analytics and processed video saved to database
11. **Dashboard Display** - Results presented via interactive interface

---

## User Workflow

```
1. Open TrafficLens Dashboard
        ↓
2. Upload Traffic Video (MP4, MOV, AVI)
        ↓
3. AI Processes Video (Background Job) [Backend]
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

# E2E Testing (when ready)
bun run e2e              # Run Playwright tests
```

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

## Documentation

- [About TrafficLens](docs/About.md) - Comprehensive project overview and architecture details
- [Frontend Development Guide](docs/) - Frontend setup and architecture (coming soon)
- [Backend API Documentation](docs/) - Backend setup and API endpoints (coming soon)
- [Architecture & Design](docs/) - System design decisions and patterns (coming soon)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Questions

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [About.md](docs/About.md) for technical details

---

<div align="center">

**TrafficLens - Making traffic analysis smarter, faster, and more accessible**

*Powered by Computer Vision & AI for Smart Cities*

</div>
