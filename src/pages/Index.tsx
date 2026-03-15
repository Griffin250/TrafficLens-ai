import { useDashboardMetrics, useVideoList } from '@/hooks/useApi';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, TrendingUp, BarChart3, Zap } from 'lucide-react';
import type { VideoResponse } from '@/types/api';

const Index = () => {
  const navigate = useNavigate();
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics();
  const { data: videos, isLoading: videosLoading } = useVideoList(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">TrafficLens Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-8">AI-Powered Traffic Video Analysis</p>
          <Button
            onClick={() => navigate('/upload')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg"
          >
            Upload Video
          </Button>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metricsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </>
          ) : metricsError ? (
            <div className="col-span-4 text-center text-red-500">
              Failed to load metrics. Make sure the backend is running.
            </div>
          ) : metrics ? (
            <>
              <StatCard
                label="Videos Processed"
                value={metrics.total_videos_processed || 0}
                icon={Video}
                color="primary"
                delay={0}
              />
              <StatCard
                label="Total Vehicles"
                value={metrics.total_vehicles_detected || 0}
                icon={TrendingUp}
                color="emerald"
                delay={1}
              />
              <StatCard
                label="Avg Vehicles/Video"
                value={Math.round(metrics.average_vehicles_per_video) || 0}
                icon={BarChart3}
                color="orange"
                delay={2}
              />
              <StatCard
                label="Analysis Time"
                value={`${Math.round(metrics.total_analysis_time)} min`}
                icon={Zap}
                color="primary"
                delay={3}
              />
            </>
          ) : null}
        </div>

        {/* Recent Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Videos</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/results')}
              className="text-sm"
            >
              View All
            </Button>
          </div>

          {videosLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="space-y-3">
              {videos.map((video: VideoResponse) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition cursor-pointer"
                  onClick={() => navigate(`/results?video=${video.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <Video className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{video.original_filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {video.status === 'completed' ? '✓ Analysis Complete' : `Status: ${video.status}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(video.created_at).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No videos yet. Start by uploading your first traffic video!</p>
              <Button
                onClick={() => navigate('/upload')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Upload Video
              </Button>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Vehicle Detection', desc: 'AI-powered detection of cars, buses, trucks, and motorcycles' },
            { title: 'Movement Tracking', desc: 'Track vehicle movements and classify turns and directions' },
            { title: 'Traffic Analytics', desc: 'Comprehensive traffic density and pattern analysis' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card/50 backdrop-blur border border-border/50 rounded-lg p-6"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
