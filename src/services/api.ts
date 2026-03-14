import axios from 'axios';
import type {
  VideoUploadResponse,
  VideoResponse,
  VideoDetailResponse,
  AnalysisResponse,
  AnalyticsSummary,
  ProcessingJobResponse,
  DashboardMetrics,
  DetectionResponse,
  TrackResponse,
} from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// ==================== Videos ====================

export const videosApi = {
  upload: (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<VideoUploadResponse>('/api/v1/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
        onProgress?.(pct);
      },
    });
  },

  get: (videoId: string) =>
    api.get<VideoDetailResponse>(`/api/v1/videos/${videoId}`),

  list: (skip = 0, limit = 10) =>
    api.get<VideoResponse[]>('/api/v1/videos/', { params: { skip, limit } }),

  delete: (videoId: string) =>
    api.delete(`/api/v1/videos/${videoId}`),
};

// ==================== Analytics ====================

export const analyticsApi = {
  getAnalysis: (videoId: string) =>
    api.get<AnalysisResponse>(`/api/v1/analytics/video/${videoId}`),

  getSummary: (videoId: string) =>
    api.get<AnalyticsSummary>(`/api/v1/analytics/summary/${videoId}`),

  getDashboard: () =>
    api.get<DashboardMetrics>('/api/v1/analytics/dashboard'),

  getDetections: (videoId: string, frameNumber?: number) =>
    api.get<DetectionResponse[]>(`/api/v1/analytics/detections/${videoId}`, {
      params: frameNumber !== undefined ? { frame_number: frameNumber } : {},
    }),

  getTracks: (videoId: string) =>
    api.get<TrackResponse[]>(`/api/v1/analytics/tracks/${videoId}`),

  getJob: (videoId: string) =>
    api.get<ProcessingJobResponse>(`/api/v1/analytics/job/${videoId}`),
};

// ==================== Health ====================

export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
