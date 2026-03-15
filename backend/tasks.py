"""
Celery configuration and task definitions for background video processing
DEPRECATED: Using FastAPI BackgroundTasks instead

Processing now happens synchronously in:
- routes/videos.py::process_video_task_sync()

This file is kept for reference only.
"""

import logging

logger = logging.getLogger(__name__)
logger.info("Celery is deprecated - using FastAPI BackgroundTasks for video processing")

# Placeholder for backward compatibility
class MockCeleryApp:
    def task(self, *args, **kwargs):
        def decorator(func):
            return func
        return decorator

celery_app = MockCeleryApp()

# Reference to new processing function in routes
# from routes.videos import process_video_task_sync as process_video_task
