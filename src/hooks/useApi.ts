import { useQuery } from '@tanstack/react-query';
import { analyticsApi, videosApi } from '@/services/api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => analyticsApi.getDashboard().then((r) => r.data),
    retry: 1,
  });
}

export function useVideoAnalysis(videoId: string | null) {
  return useQuery({
    queryKey: ['analysis', videoId],
    queryFn: () => analyticsApi.getAnalysis(videoId!).then((r) => r.data),
    enabled: !!videoId,
    retry: 1,
  });
}

export function useAnalyticsSummary(videoId: string | null) {
  return useQuery({
    queryKey: ['summary', videoId],
    queryFn: () => analyticsApi.getSummary(videoId!).then((r) => r.data),
    enabled: !!videoId,
    retry: 1,
  });
}

export function useProcessingJob(videoId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['job', videoId],
    queryFn: () => analyticsApi.getJob(videoId!).then((r) => r.data),
    enabled: !!videoId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'pending' || status === 'processing') return 3000;
      return false;
    },
    retry: 1,
  });
}

export function useVideoList(skip = 0, limit = 10) {
  return useQuery({
    queryKey: ['videos', skip, limit],
    queryFn: () => videosApi.list(skip, limit).then((r) => r.data),
    retry: 1,
  });
}

export function useVideoDetail(videoId: string | null) {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => videosApi.get(videoId!).then((r) => r.data),
    enabled: !!videoId,
    retry: 1,
  });
}
