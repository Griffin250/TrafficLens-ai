import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, ArrowLeft, ArrowRight, MoveUp, Download, Loader2, AlertCircle, ArrowLeftIcon } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { MovementPieChart, TrafficFlowChart, VehiclesOverTimeChart } from '@/components/dashboard/TrafficCharts';
import { useVideoAnalysis, useVideoDetail } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';

export default function Results() {
  const { videoId } = useParams<{ videoId: string }>();
  const { data: analysis, isLoading: loadingAnalysis, error: analysisError } = useVideoAnalysis(videoId ?? null);
  const { data: video, isLoading: loadingVideo } = useVideoDetail(videoId ?? null);

  const isLoading = loadingAnalysis || loadingVideo;

  if (!videoId) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-lg font-semibold mb-2">No video selected</p>
          <p className="text-sm text-muted-foreground mb-4">Upload a video first to see results.</p>
          <Button asChild><Link to="/upload">Upload Video</Link></Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (analysisError || !analysis) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <p className="text-lg font-semibold mb-2">Analysis not available</p>
          <p className="text-sm text-muted-foreground mb-4">
            {video?.status === 'processing'
              ? 'Video is still being processed. Check back shortly.'
              : video?.status === 'failed'
              ? `Processing failed: ${video.error_message || 'Unknown error'}`
              : 'No analysis found for this video.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild><Link to="/dashboard">Dashboard</Link></Button>
            <Button asChild className="bg-primary hover:bg-primary/90"><Link to="/upload">Upload New</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  // Build chart data from analysis
  const movementData = [
    { name: 'Straight', value: analysis.straight_movements, fill: 'hsl(230, 89%, 67%)' },
    { name: 'Left Turn', value: analysis.left_turns, fill: 'hsl(160, 84%, 39%)' },
    { name: 'Right Turn', value: analysis.right_turns, fill: 'hsl(24, 94%, 50%)' },
  ];

  // Use detailed_metrics for time series if available
  const timeSeriesData = analysis.detailed_metrics?.time_series ?? [];
  const densityData = analysis.detailed_metrics?.density ?? [];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" asChild className="p-1">
                <Link to="/dashboard"><ArrowLeftIcon className="w-4 h-4" /></Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {video?.original_filename ?? videoId}
              {analysis.processing_time ? ` · Processed in ${analysis.processing_time.toFixed(1)}s` : ''}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </motion.div>

        {/* Original uploaded video */}
        {analysis.annotated_video_path && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden mb-8">
            <video
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/videos/${analysis.annotated_video_path}`}
              controls
              className="w-full aspect-video bg-card"
            />
          </motion.div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Vehicles" value={analysis.total_vehicles} icon={Car} color="primary" delay={0} />
          <StatCard label="Left Turns" value={analysis.left_turns} icon={ArrowLeft} color="emerald" delay={1} />
          <StatCard label="Right Turns" value={analysis.right_turns} icon={ArrowRight} color="orange" delay={2} />
          <StatCard label="Straight" value={analysis.straight_movements} icon={MoveUp} color="primary" delay={3} />
        </div>

        {/* Vehicle type breakdown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Cars" value={analysis.cars} icon={Car} color="primary" delay={4} />
          <StatCard label="Trucks" value={analysis.trucks} icon={Car} color="orange" delay={5} />
          <StatCard label="Buses" value={analysis.buses} icon={Car} color="emerald" delay={6} />
          <StatCard label="Motorcycles" value={analysis.motorcycles} icon={Car} color="orange" delay={7} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          <div className="lg:col-span-4">
            <MovementPieChart data={movementData} />
          </div>
          <div className="lg:col-span-8">
            <TrafficFlowChart data={timeSeriesData} />
          </div>
        </div>

        <VehiclesOverTimeChart data={timeSeriesData} />
      </div>
    </div>
  );
}
