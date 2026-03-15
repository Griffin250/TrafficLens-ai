import { supabase } from '@/integrations/supabase/client';
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

// ==================== Videos ====================

export const videosApi = {
  upload: async (file: File, onProgress?: (percent: number) => void) => {
    // Simulate progress since supabase.functions.invoke doesn't support progress
    onProgress?.(10);

    const formData = new FormData();
    formData.append('file', file);

    onProgress?.(30);

    const { data, error } = await supabase.functions.invoke('upload-video', {
      body: formData,
    });

    if (error) throw new Error(error.message || 'Upload failed');

    onProgress?.(100);
    return { data: data as VideoUploadResponse };
  },

  get: async (videoId: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) throw new Error(error.message);
    return { data: mapVideoDetail(data) };
  },

  list: async (skip = 0, limit = 10) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) throw new Error(error.message);
    return { data: (data || []).map(mapVideoResponse) };
  },

  delete: async (videoId: string) => {
    // Delete from storage first
    const { data: video } = await supabase
      .from('videos')
      .select('file_path')
      .eq('id', videoId)
      .single();

    if (video?.file_path) {
      await supabase.storage.from('videos').remove([video.file_path]);
    }

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) throw new Error(error.message);
    return { data: { message: 'Video deleted successfully' } };
  },
};

// ==================== Analytics ====================

export const analyticsApi = {
  getAnalysis: async (videoId: string) => {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('video_id', videoId)
      .single();

    if (error) throw new Error(error.message);
    return { data: data as AnalysisResponse };
  },

  getSummary: async (videoId: string) => {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('video_id', videoId)
      .single();

    if (error) throw new Error(error.message);

    const analysis = data;
    const totalMovements = (analysis.left_turns || 0) + (analysis.right_turns || 0) + (analysis.straight_movements || 0);
    const total = totalMovements || 1;
    const totalVehicleTypes = (analysis.cars || 0) + (analysis.buses || 0) + (analysis.trucks || 0) + (analysis.motorcycles || 0);
    const vtTotal = totalVehicleTypes || 1;

    const summary: AnalyticsSummary = {
      video_id: analysis.video_id,
      total_vehicles: analysis.total_vehicles || 0,
      movement_distribution: {
        left_turns: ((analysis.left_turns || 0) / total) * 100,
        right_turns: ((analysis.right_turns || 0) / total) * 100,
        straight: ((analysis.straight_movements || 0) / total) * 100,
      },
      vehicle_type_distribution: {
        cars: ((analysis.cars || 0) / vtTotal) * 100,
        buses: ((analysis.buses || 0) / vtTotal) * 100,
        trucks: ((analysis.trucks || 0) / vtTotal) * 100,
        motorcycles: ((analysis.motorcycles || 0) / vtTotal) * 100,
      },
      traffic_density: analysis.traffic_density || 'low',
      processing_time: analysis.processing_time || 0,
      created_at: analysis.created_at,
    };

    return { data: summary };
  },

  getDashboard: async () => {
    // Get all videos
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (videosError) throw new Error(videosError.message);

    // Get all analyses
    const { data: analyses } = await supabase
      .from('analyses')
      .select('*');

    const completedVideos = (videos || []).filter(v => v.status === 'completed');
    const totalVehicles = (analyses || []).reduce((sum, a) => sum + (a.total_vehicles || 0), 0);
    const totalTime = (analyses || []).reduce((sum, a) => sum + (a.processing_time || 0), 0);

    const metrics: DashboardMetrics = {
      total_videos_processed: completedVideos.length,
      total_vehicles_detected: totalVehicles,
      total_analysis_time: totalTime / 60, // convert to minutes
      average_vehicles_per_video: completedVideos.length > 0 ? totalVehicles / completedVideos.length : 0,
      recent_videos: (videos || []).slice(0, 5).map(mapVideoResponse),
    };

    return { data: metrics };
  },

  getDetections: async (videoId: string, frameNumber?: number) => {
    let query = supabase
      .from('detections')
      .select('*')
      .eq('video_id', videoId);

    if (frameNumber !== undefined) {
      query = query.eq('frame_number', frameNumber);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return { data: (data || []) as DetectionResponse[] };
  },

  getTracks: async (videoId: string) => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('video_id', videoId);

    if (error) throw new Error(error.message);
    return { data: (data || []) as TrackResponse[] };
  },

  getJob: async (videoId: string) => {
    const { data, error } = await supabase
      .from('processing_jobs')
      .select('*')
      .eq('video_id', videoId)
      .single();

    if (error) throw new Error(error.message);
    return { data: data as ProcessingJobResponse };
  },
};

// ==================== Health ====================

export const healthApi = {
  check: async () => {
    // Simple health check - just verify we can reach the database
    const { error } = await supabase.from('videos').select('id').limit(1);
    if (error) throw error;
    return { data: { status: 'ok' } };
  },
};

// ==================== Helpers ====================

function mapVideoResponse(v: any): VideoResponse {
  return {
    id: v.id,
    user_id: '',
    filename: v.filename,
    original_filename: v.original_filename,
    file_size: v.file_size || 0,
    duration: v.duration,
    fps: v.fps,
    resolution: v.resolution,
    status: v.status,
    created_at: v.created_at,
  };
}

function mapVideoDetail(v: any): VideoDetailResponse {
  return {
    ...mapVideoResponse(v),
    error_message: v.error_message,
    processing_started_at: v.processing_started_at,
    processing_completed_at: v.processing_completed_at,
    updated_at: v.updated_at,
  };
}

export default supabase;
