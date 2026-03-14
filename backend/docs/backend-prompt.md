🚀 Prompt for Lovable AI

Create a modern AI SaaS web application frontend called TrafficLens.

TrafficLens is an AI-powered traffic analysis platform that allows users to upload recorded traffic videos and automatically analyze vehicle movements using computer vision.

The system detects vehicles, tracks them across frames, and analyzes traffic flow patterns such as:
	•	vehicles turning left
	•	vehicles turning right
	•	vehicles going straight
	•	vehicle counts
	•	traffic density

The frontend must be fully ready to connect to a FastAPI backend API later, but should include mock data for now.

The UI should look like a modern AI analytics platform similar to tools like Vercel dashboards, Stripe dashboards, or AI SaaS platforms.

⸻

🧰 Tech Stack

Use the following stack:
	•	React
	•	TypeScript
	•	Vite
	•	TailwindCSS
	•	React Router
	•	Framer Motion
	•	Recharts (for analytics charts)
	•	Axios (for API calls)
	•	Zustand or Context API for state management

Ensure the project structure is clean and scalable.

⸻

🎨 Design Style

The design should feel like a modern AI platform.

Theme:

Primary color: Indigo / Deep Blue
Secondary color: Emerald Green
Accent color: Orange

Features:
	•	glassmorphism cards
	•	smooth animations
	•	modern dashboards
	•	professional AI analytics style

Must include:
	•	Dark mode
	•	Fully responsive design
	•	Mobile support

⸻

🧭 Pages to Build

1️⃣ Landing Page

The landing page should introduce TrafficLens.

Hero section:

Title:

TrafficLens

Subtitle:

AI-Powered Traffic Video Analytics

Description:

Upload traffic footage and instantly analyze vehicle movement patterns using AI-powered computer vision.

Call to action buttons:
	•	Upload Video
	•	See Demo
	•	How It Works

Include sections:

Features:
	•	AI vehicle detection
	•	Traffic flow analytics
	•	Left / Right / Straight turn detection
	•	Visualized traffic data
	•	Smart intersection insights

Include animated illustrations of traffic flow.

⸻

2️⃣ Dashboard Page

Main analytics dashboard after login.

Features:

Cards displaying statistics:
	•	Total vehicles detected
	•	Left turns
	•	Right turns
	•	Straight movement
	•	Traffic density

Charts:
	•	Traffic distribution pie chart
	•	Traffic flow bar chart
	•	Vehicles over time line chart

Include:
	•	Video preview panel
	•	Processed video display
	•	Analytics summary

Use mock analytics data for now.

⸻

3️⃣ Video Upload Page

Users should be able to upload traffic videos.

Upload UI:

Drag and drop upload zone.

Accepted formats:
	•	mp4
	•	mov
	•	avi

Include:
	•	upload progress indicator
	•	processing animation
	•	status indicator

Mock API integration example:

POST /api/analyze-video

Use Axios structure so it is ready for FastAPI backend integration.

⸻

4️⃣ Results Page

After video processing, show analysis results.

Include:
	•	Processed video playback
	•	Bounding boxes around vehicles
	•	Traffic movement summary

Statistics cards:

Example:

Total Vehicles: 124
Left Turns: 36
Right Turns: 28
Straight: 60

Include charts and movement distribution graphs.

⸻

5️⃣ How It Works Page (Very Important)

Create a step-by-step explanation page explaining how TrafficLens works.

This page should guide new users through the process using visual steps and illustrations.

Steps:

Step 1
Upload traffic video footage

Step 2
TrafficLens AI scans the video and detects vehicles using computer vision.

Step 3
Vehicles are tracked across frames to determine movement trajectories.

Step 4
The system classifies vehicle movements such as left turns, right turns, or straight movement.

Step 5
Traffic analytics are generated including counts, charts, and traffic flow insights.

Include a guided tour style UI with animated steps.

⸻

6️⃣ Guided Tour for First-Time Users

Implement a first-time user onboarding guide.

When a new user logs in for the first time:

Show a guided UI tour that explains:
	•	Dashboard
	•	Upload video
	•	View results
	•	Understand analytics

Use step bubbles that highlight UI components.

Example steps:
	1.	Welcome to TrafficLens
	2.	Upload your first traffic video
	3.	View AI analysis results
	4.	Explore traffic insights

Allow users to skip or replay the tour.

⸻

7️⃣ Navigation

Include top navigation with:
	•	Dashboard
	•	Upload Video
	•	Results
	•	How It Works
	•	Settings

Include sidebar navigation for dashboard pages.

⸻

8️⃣ Settings Page

Include user settings:
	•	profile
	•	notification preferences
	•	dark mode toggle

⸻

📁 Project Structure

Generate clean project structure:

src
 components
  Navbar
  Sidebar
  VideoUploader
  AnalyticsCards
  TrafficCharts
  GuidedTour
 pages
  Landing
  Dashboard
  Upload
  Results
  HowItWorks
  Settings
 services
  api.ts
 hooks
 store
 utils


⸻

🔌 Backend API Preparation

Prepare Axios service for FastAPI integration.

Example endpoints:

POST /api/upload-video
POST /api/analyze-video
GET /api/results/{video_id}

Use environment variables for API URL.

⸻

📊 Mock Data

Generate realistic traffic analytics mock data so charts look real.

Example:

Total Vehicles: 143
Left Turns: 41
Right Turns: 37
Straight: 65


⸻

✨ Extra Features

Add:
	•	loading animations
	•	processing progress indicator
	•	animated statistics counters
	•	modern UI transitions
	•	responsive layout

⸻

🎯 Expected Output

Generate a complete production-ready frontend project including:
	•	all pages
	•	modern UI
	•	reusable components
	•	mock analytics
	•	ready for FastAPI backend integration
	•	clean scalable architecture

The final result should look like a modern AI analytics SaaS platform.

⸻


⸻