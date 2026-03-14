/**
 * TypeScript types matching the FastAPI backend schemas
 */

export interface VideoUploadResponse {
  id: string;
  filename: string;
  file_size: number;
  status: string;
  message: string;
}

export interface VideoResponse {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  duration: number | null;
  fps: number | null;
  resolution: string | null;
  status: VideoStatus;
  created_at: string;
}

export interface VideoDetailResponse extends VideoResponse {
  error_message: string | null;
  processing_started_at: string | null;
  processing_completed_at: string | null;
  updated_at: string;
}

export type VideoStatus = 'uploaded' | 'processing' | 'completed' | 'failed';

export interface AnalysisResponse {
  id: string;
  video_id: string;
  total_vehicles: number;
  total_frames_processed: number;
  left_turns: number;
  right_turns: number;
  straight_movements: number;
  cars: number;
  buses: number;
  trucks: number;
  motorcycles: number;
  average_vehicles_per_frame: number;
  peak_vehicles: number;
  traffic_density: string;
  processing_time: number | null;
  annotated_video_path: string | null;
  detailed_metrics: Record<string, any> | null;
  movement_distribution: Record<string, any> | null;
  vehicle_type_distribution: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSummary {
  video_id: string;
  total_vehicles: number;
  movement_distribution: {
    left_turns: number;
    right_turns: number;
    straight: number;
  };
  vehicle_type_distribution: {
    cars: number;
    buses: number;
    trucks: number;
    motorcycles: number;
  };
  traffic_density: string;
  processing_time: number;
  created_at: string;
}

export interface ProcessingJobResponse {
  id: string;
  video_id: string;
  celery_task_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface DashboardMetrics {
  total_videos_processed: number;
  total_vehicles_detected: number;
  total_analysis_time: number;
  average_vehicles_per_video: number;
  recent_videos: VideoResponse[];
}

export interface DetectionResponse {
  id: string;
  frame_number: number;
  timestamp: number;
  confidence: number;
  vehicle_class: string;
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  extra_metadata: Record<string, any> | null;
}

export interface TrackResponse {
  id: string;
  track_id: number;
  vehicle_class: string;
  start_frame: number;
  end_frame: number;
  total_detections: number;
  movement_type: string | null;
  movement_confidence: number | null;
  trajectory_points: number[][];
  start_position: number[];
  end_position: number[];
  average_speed: number | null;
}
