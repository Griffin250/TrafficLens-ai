import { Car, ArrowLeft, ArrowRight, MoveUp, Gauge, Clock, Cpu, FileVideo, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { MovementPieChart, VehiclesOverTimeChart, DensityChart } from '@/components/dashboard/TrafficCharts';
import { useDashboardMetrics, useVideoList } from '@/hooks/useApi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  const { data: recentVideos } = useVideoList(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-lg font-semibold mb-2">Unable to load dashboard</p>
          <p className="text-sm text-muted-foreground mb-4">
            Make sure the backend is running at {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
          </p>
          <Button variant="outline" asChild>
            <Link to="/upload">Upload a Video</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalVehicles = metrics?.total_vehicles_detected ?? 0;
  const totalVideos = metrics?.total_videos_processed ?? 0;
  const avgVehicles = metrics?.average_vehicles_per_video ?? 0;
  const totalTime = metrics?.total_analysis_time ?? 0;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Traffic Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of all processed video analyses</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Videos Processed" value={totalVideos} icon={FileVideo} color="primary" delay={0} />
          <StatCard label="Total Vehicles" value={totalVehicles} icon={Car} color="emerald" delay={1} />
          <StatCard label="Avg Vehicles/Video" value={Math.round(avgVehicles)} icon={Gauge} color="orange" delay={2} />
          <StatCard label="Total Analysis Time" value={`${totalTime.toFixed(1)}m`} icon={Cpu} color="primary" delay={3} />
        </div>

        {/* Recent Videos */}
        {recentVideos && recentVideos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mb-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Recent Videos</h3>
            <div className="space-y-3">
              {recentVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/results/${video.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileVideo className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{video.original_filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(video.created_at).toLocaleDateString()} · {(video.file_size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    video.status === 'completed' ? 'bg-emerald/10 text-emerald' :
                    video.status === 'processing' ? 'bg-primary/10 text-primary' :
                    video.status === 'failed' ? 'bg-destructive/10 text-destructive' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {video.status}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {totalVideos === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <FileVideo className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No videos processed yet</p>
            <p className="text-sm text-muted-foreground mb-6">Upload your first traffic video to see analytics here.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/upload">Upload Video</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
