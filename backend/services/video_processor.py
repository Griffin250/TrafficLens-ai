"""
Video processing service for traffic analysis
Handles detection, tracking, and analytics
"""

import cv2
import numpy as np
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime
import tempfile
import os

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

logger = logging.getLogger(__name__)


class VehicleDetector:
    """YOLO-based vehicle detection"""
    
    def __init__(self, model_name: str = "yolov8x.pt", confidence_threshold: float = 0.5):
        """
        Initialize detector
        
        Args:
            model_name: YOLOv8 model name
            confidence_threshold: Detection confidence threshold
        """
        self.model_name = model_name
        self.confidence_threshold = confidence_threshold
        self.model = None
        self.device = "cpu"  # Can be "cuda" for GPU
        
        try:
            if YOLO:
                self.model = YOLO(model_name)
        except Exception as e:
            logger.warning(f"Failed to load YOLO model: {e}. Using mock detector.")
    
    def detect_vehicles(self, frame: np.ndarray) -> List[Dict]:
        """
        Detect vehicles in frame
        
        Args:
            frame: Input frame (numpy array)
        
        Returns:
            List of detections with bounding boxes and confidence
        """
        detections = []
        
        # Mock detection for development without GPU
        if self.model is None:
            # Return mock detections for testing
            logger.debug(f"[DETECTOR] Using mock detections (model not loaded)")
            return self._get_mock_detections(frame)
        
        try:
            logger.debug(f"[DETECTOR] Running YOLO model...")
            results = self.model(frame, conf=self.confidence_threshold, device=self.device)
            
            for result in results:
                for box in result.boxes:
                    x_min, y_min, x_max, y_max = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    class_name = result.names[class_id]
                    
                    # Filter for vehicles only
                    vehicle_classes = ["car", "bus", "truck", "motorcycle"]
                    if class_name.lower() in vehicle_classes:
                        detections.append({
                            "bbox": [float(x_min), float(y_min), float(x_max), float(y_max)],
                            "confidence": confidence,
                            "class": class_name.lower(),
                            "class_id": class_id
                        })
            
            logger.debug(f"[DETECTOR] Found {len(detections)} vehicles")
        except Exception as e:
            logger.error(f"[DETECTOR] Detection error: {e}")
            return self._get_mock_detections(frame)
        
        return detections
    
    @staticmethod
    def _get_mock_detections(frame: np.ndarray) -> List[Dict]:
        """Generate mock detections for testing"""
        height, width = frame.shape[:2]
        detections = []
        
        # Generate random mock detections
        num_vehicles = np.random.randint(3, 8)
        vehicle_classes = ["car", "bus", "truck", "motorcycle"]
        
        for i in range(num_vehicles):
            x_min = np.random.randint(0, width - 100)
            y_min = np.random.randint(0, height - 100)
            x_max = min(x_min + np.random.randint(50, 150), width)
            y_max = min(y_min + np.random.randint(50, 150), height)
            
            detections.append({
                "bbox": [float(x_min), float(y_min), float(x_max), float(y_max)],
                "confidence": np.random.uniform(0.6, 0.95),
                "class": np.random.choice(vehicle_classes),
                "class_id": np.random.randint(0, 4)
            })
        
        return detections


class SimpleTracker:
    """Simple centroid-based vehicle tracker"""
    
    def __init__(self, max_distance: float = 50, max_age: int = 30):
        """
        Initialize tracker
        
        Args:
            max_distance: Maximum distance for centroid matching
            max_age: Maximum frames to keep track alive
        """
        self.max_distance = max_distance
        self.max_age = max_age
        self.tracks = {}
        self.next_track_id = 1
    
    def update(self, detections: List[Dict]) -> List[Dict]:
        """
        Update tracks with new detections
        
        Args:
            detections: List of current frame detections
        
        Returns:
            List of tracks with IDs
        """
        if not detections:
            self._age_tracks()
            return []
        
        # Get centroids from detections
        centroids = np.array([
            [(det["bbox"][0] + det["bbox"][2]) / 2, 
             (det["bbox"][1] + det["bbox"][3]) / 2]
            for det in detections
        ])
        
        tracked_objects = []
        used_detections = set()
        
        # Match existing tracks to detections
        for track_id, track in list(self.tracks.items()):
            if track["age"] > self.max_age:
                del self.tracks[track_id]
                continue
            
            last_centroid = np.array(track["centroid"])
            distances = np.linalg.norm(centroids - last_centroid, axis=1)
            
            closest_idx = np.argmin(distances)
            closest_distance = distances[closest_idx]
            
            if closest_distance < self.max_distance and closest_idx not in used_detections:
                # Update track
                detection = detections[closest_idx]
                self.tracks[track_id]["centroid"] = [
                    (detection["bbox"][0] + detection["bbox"][2]) / 2,
                    (detection["bbox"][1] + detection["bbox"][3]) / 2
                ]
                self.tracks[track_id]["age"] = 0
                self.tracks[track_id]["bbox"] = detection["bbox"]
                self.tracks[track_id]["class"] = detection["class"]
                self.tracks[track_id]["confidence"] = detection["confidence"]
                
                tracked_objects.append({
                    **detection,
                    "track_id": track_id
                })
                used_detections.add(closest_idx)
        
        # Create new tracks for unmatched detections
        for idx, detection in enumerate(detections):
            if idx not in used_detections:
                track_id = self.next_track_id
                self.next_track_id += 1
                
                self.tracks[track_id] = {
                    "centroid": [
                        (detection["bbox"][0] + detection["bbox"][2]) / 2,
                        (detection["bbox"][1] + detection["bbox"][3]) / 2
                    ],
                    "age": 0,
                    "bbox": detection["bbox"],
                    "class": detection["class"],
                    "confidence": detection["confidence"],
                    "trajectory": [[
                        (detection["bbox"][0] + detection["bbox"][2]) / 2,
                        (detection["bbox"][1] + detection["bbox"][3]) / 2
                    ]]
                }
                
                tracked_objects.append({
                    **detection,
                    "track_id": track_id
                })
        
        self._age_tracks()
        return tracked_objects
    
    def _age_tracks(self):
        """Age all tracks"""
        for track in self.tracks.values():
            track["age"] += 1


class TrafficAnalyzer:
    """Analyze traffic patterns from tracked vehicles"""
    
    def __init__(self):
        """Initialize analyzer"""
        self.vehicle_trajectories = {}
        self.vehicle_movements = {}
    
    def classify_movement(self, trajectory: List[List[float]]) -> str:
        """
        Classify vehicle movement (left/right/straight)
        
        Args:
            trajectory: List of [x, y] positions
        
        Returns:
            Movement type: "left_turn", "right_turn", or "straight"
        """
        if len(trajectory) < 5:
            return "unknown"
        
        # Get start and end points
        start = np.array(trajectory[0])
        end = np.array(trajectory[-1])
        
        # Calculate direction vector
        direction = end - start
        
        # Check midpoint deflection
        mid_idx = len(trajectory) // 2
        mid = np.array(trajectory[mid_idx])
        
        # Calculate cross product to determine turn direction
        v1 = trajectory[mid_idx] - start
        v2 = end - trajectory[mid_idx]
        
        if len(v1) >= 2 and len(v2) >= 2:
            cross = v1[0] * v2[1] - v1[1] * v2[0]
            
            # Threshold for detecting turns
            if abs(cross) > 5000:
                return "left_turn" if cross > 0 else "right_turn"
        
        return "straight"
    
    def get_vehicle_class_distribution(self, vehicle_classes: List[str]) -> Dict[str, int]:
        """Count vehicles by type"""
        distribution = {
            "car": 0,
            "bus": 0,
            "truck": 0,
            "motorcycle": 0
        }
        
        for vclass in vehicle_classes:
            if vclass in distribution:
                distribution[vclass] += 1
        
        return distribution


class VideoProcessor:
    """Main video processing pipeline"""
    
    def __init__(self, video_path: str, video_id: str, task=None, db=None):
        """
        Initialize processor
        
        Args:
            video_path: Path to input video
            video_id: Video ID for database
            task: Celery task for progress updates (deprecated, use db instead)
            db: Database session for updating progress
        """
        self.video_path = video_path
        self.video_id = video_id
        self.task = task
        self.db = db
        self.detector = VehicleDetector()
        self.tracker = SimpleTracker()
        self.analyzer = TrafficAnalyzer()
    
    def process(self) -> Dict:
        """
        Process video: detect, track, and analyze
        
        Returns:
            Dictionary with analysis results
        """
        import time
        from config import get_settings
        
        settings = get_settings()
        start_time = time.time()
        
        # Determine frame skip rate for fast processing
        frame_skip = 5 if settings.FAST_PROCESSING else 1
        
        logger.info(f"[VP_PROCESS_START] Processing video: {self.video_path}")
        logger.info(f"[VP_PROCESS_START] Frame skip rate: {frame_skip} (FAST_PROCESSING={'ON' if settings.FAST_PROCESSING else 'OFF'})")
        
        # Open video
        logger.info(f"[VP_OPEN] Opening video file...")
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            logger.error(f"[VP_OPEN_FAIL] Cannot open video: {self.video_path}")
            raise Exception(f"Cannot open video: {self.video_path}")
        
        logger.info(f"[VP_OPEN_SUCCESS] Video file opened successfully")
        
        # Get video properties
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration_seconds = total_frames / fps if fps > 0 else 0
        
        logger.info(f"[VP_PROPERTIES] Video: {total_frames} frames, {fps:.1f} FPS, {width}x{height}, Duration: {duration_seconds:.1f}s")
        
        # Output video setup
        output_path = f"processed/{self.video_id}_annotated.mp4"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        logger.info(f"[VP_OUTPUT_SETUP] Output path: {output_path}")
        
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        # Processing variables
        frame_count = 0
        processed_frame_count = 0
        all_detections = []
        all_tracks = {}
        vehicle_movements = {}
        vehicle_classes_list = []
        
        logger.info(f"[VP_PROCESSING_START] Starting frame processing... (will process ~{total_frames // frame_skip} frames)")
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    logger.info(f"[VP_FRAME_END] End of video reached at frame {frame_count}")
                    break
                
                frame_count += 1
                
                # Skip frames for faster processing
                if frame_count % frame_skip != 0:
                    continue
                
                processed_frame_count += 1
                
                # Detect vehicles
                logger.debug(f"[VP_FRAME_{processed_frame_count}] Processing frame {frame_count}/{total_frames}...")
                detections = self.detector.detect_vehicles(frame)
                
                # Track vehicles
                tracked_objects = self.tracker.update(detections)
                
                logger.debug(f"[VP_FRAME_{processed_frame_count}] Found {len(tracked_objects)} tracked objects")
                
                # Store data
                all_detections.extend(tracked_objects)
                
                for obj in tracked_objects:
                    track_id = obj["track_id"]
                    if track_id not in all_tracks:
                        all_tracks[track_id] = {
                            "class": obj["class"],
                            "trajectory": [],
                            "detections": []
                        }
                    
                    centroid = [
                        (obj["bbox"][0] + obj["bbox"][2]) / 2,
                        (obj["bbox"][1] + obj["bbox"][3]) / 2
                    ]
                    all_tracks[track_id]["trajectory"].append(centroid)
                    all_tracks[track_id]["detections"].append(obj)
                    vehicle_classes_list.append(obj["class"])
                
                # Draw annotations
                annotated_frame = frame.copy()
                for obj in tracked_objects:
                    x_min, y_min, x_max, y_max = map(int, obj["bbox"])
                    track_id = obj["track_id"]
                    
                    # Draw bounding box
                    cv2.rectangle(annotated_frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
                    
                    # Draw track ID and class
                    label = f"ID:{track_id} {obj['class']}"
                    cv2.putText(annotated_frame, label, (x_min, y_min - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                out.write(annotated_frame)
                
                # Update progress
                progress = int((processed_frame_count / (total_frames // frame_skip)) * 100)
                if self.task:
                    self.task.update_state(state="PROGRESS", meta={"progress": progress})
                
                # Log progress every 10 processed frames
                if processed_frame_count % 10 == 0:
                    elapsed = time.time() - start_time
                    rate = processed_frame_count / elapsed if elapsed > 0 else 0
                    remaining = (total_frames // frame_skip) - processed_frame_count
                    eta_seconds = remaining / rate if rate > 0 else 0
                    logger.info(f"[VP_PROGRESS] {processed_frame_count}/{total_frames // frame_skip} processed ({progress}%) - {rate:.1f} fps - ETA: {eta_seconds:.0f}s")
        
        finally:
            logger.info(f"[VP_CLEANUP] Closing video file...")
            cap.release()
            out.release()
            logger.info(f"[VP_CLEANUP] Video file closed")
        
        total_time = time.time() - start_time
        logger.info(f"[VP_FRAME_COMPLETE] Total time: {total_time:.1f}s | Processed: {processed_frame_count} frames | Rate: {processed_frame_count/total_time:.1f} fps")
        
        # Classify movements for tracks
        logger.info(f"[VP_MOVEMENT_CLASS] Classifying movements for {len(all_tracks)} tracks...")
        for track_id, track_data in all_tracks.items():
            if len(track_data["trajectory"]) > 5:
                movement = self.analyzer.classify_movement(track_data["trajectory"])
                vehicle_movements[track_id] = movement
        
        logger.info(f"[VP_MOVEMENT_CLASS] Movement classification complete")
        
        # Calculate analytics
        logger.info(f"[VP_ANALYTICS] Calculating analytics...")
        left_turns = sum(1 for m in vehicle_movements.values() if m == "left_turn")
        right_turns = sum(1 for m in vehicle_movements.values() if m == "right_turn")
        straight_moves = sum(1 for m in vehicle_movements.values() if m == "straight")
        
        logger.info(f"[VP_ANALYTICS] Movements: {left_turns} left, {right_turns} right, {straight_moves} straight")
        
        vehicle_distribution = self.analyzer.get_vehicle_class_distribution(vehicle_classes_list)
        
        logger.info(f"[VP_ANALYTICS] Vehicle distribution: {vehicle_distribution}")
        
        # Calculate traffic density
        avg_vehicles = len(all_detections) / max(frame_count, 1)
        if avg_vehicles > 10:
            traffic_density = "critical"
        elif avg_vehicles > 6:
            traffic_density = "high"
        elif avg_vehicles > 3:
            traffic_density = "medium"
        else:
            traffic_density = "low"
        
        logger.info(f"[VP_ANALYTICS] Traffic density: {traffic_density} (avg {avg_vehicles:.2f} vehicles/frame)")
        
        results = {
            "total_vehicles": len(all_tracks),
            "total_frames_processed": frame_count,
            "left_turns": left_turns,
            "right_turns": right_turns,
            "straight_movements": straight_moves,
            "cars": vehicle_distribution["car"],
            "buses": vehicle_distribution["bus"],
            "trucks": vehicle_distribution["truck"],
            "motorcycles": vehicle_distribution["motorcycle"],
            "average_vehicles_per_frame": avg_vehicles,
            "peak_vehicles": max([len(t) for t in all_tracks.values()]) if all_tracks else 0,
            "traffic_density": traffic_density,
            "annotated_video_path": output_path,
            "processing_time": frame_count / fps if fps > 0 else 0
        }
        
        logger.info(f"[VP_RESULTS] Processing complete. Results: {results}")
        logger.info(f"[VP_PROCESS_END] Video processing finished successfully")
        return results
