import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

export const trafficApi = {
  uploadVideo: (file: File, onProgress: (p: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload-video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        );
        onProgress(percentCompleted);
      },
    });
  },
  analyzeVideo: (videoId: string) => api.post(`/api/analyze-video`, { video_id: videoId }),
  getResults: (videoId: string) => api.get(`/api/results/${videoId}`),
};

export default api;
