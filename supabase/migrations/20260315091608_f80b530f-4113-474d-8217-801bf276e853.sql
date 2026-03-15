
-- Create video status enum
CREATE TYPE public.video_status AS ENUM ('uploaded', 'processing', 'completed', 'failed');

-- Videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT,
  file_size BIGINT DEFAULT 0,
  duration FLOAT,
  fps INTEGER,
  resolution TEXT,
  status public.video_status DEFAULT 'uploaded',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE
);

-- Processing jobs table
CREATE TABLE public.processing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analyses table
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_vehicles INTEGER DEFAULT 0,
  total_frames_processed INTEGER DEFAULT 0,
  left_turns INTEGER DEFAULT 0,
  right_turns INTEGER DEFAULT 0,
  straight_movements INTEGER DEFAULT 0,
  cars INTEGER DEFAULT 0,
  buses INTEGER DEFAULT 0,
  trucks INTEGER DEFAULT 0,
  motorcycles INTEGER DEFAULT 0,
  average_vehicles_per_frame FLOAT DEFAULT 0.0,
  peak_vehicles INTEGER DEFAULT 0,
  traffic_density TEXT DEFAULT 'low',
  average_speed FLOAT,
  processing_time FLOAT,
  annotated_video_path TEXT,
  detailed_metrics JSONB,
  movement_distribution JSONB,
  vehicle_type_distribution JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tracks table
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  track_id INTEGER,
  vehicle_class TEXT,
  start_frame INTEGER,
  end_frame INTEGER,
  total_detections INTEGER DEFAULT 0,
  movement_type TEXT,
  movement_confidence FLOAT,
  trajectory_points JSONB,
  start_position JSONB,
  end_position JSONB,
  average_speed FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Detections table
CREATE TABLE public.detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  frame_number INTEGER,
  timestamp FLOAT,
  x_min FLOAT,
  y_min FLOAT,
  x_max FLOAT,
  y_max FLOAT,
  confidence FLOAT,
  vehicle_class TEXT,
  extra_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_created_at ON public.videos(created_at);
CREATE INDEX idx_processing_jobs_video_id ON public.processing_jobs(video_id);
CREATE INDEX idx_analyses_video_id ON public.analyses(video_id);
CREATE INDEX idx_tracks_video_id ON public.tracks(video_id);
CREATE INDEX idx_detections_video_id ON public.detections(video_id);
CREATE INDEX idx_detections_frame ON public.detections(frame_number);

-- Disable RLS for now (public access - no auth yet)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (no auth)
CREATE POLICY "Allow all access to videos" ON public.videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to processing_jobs" ON public.processing_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to analyses" ON public.analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to tracks" ON public.tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to detections" ON public.detections FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Storage policy for public access
CREATE POLICY "Allow public upload to videos bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
CREATE POLICY "Allow public read from videos bucket" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Allow public delete from videos bucket" ON storage.objects FOR DELETE USING (bucket_id = 'videos');
