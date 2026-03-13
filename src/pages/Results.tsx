import { motion } from 'framer-motion';
import { Car, ArrowLeft, ArrowRight, MoveUp, Download } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { MovementPieChart, TrafficFlowChart, VehiclesOverTimeChart } from '@/components/dashboard/TrafficCharts';
import { trafficStats } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function Results() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Analysis Results</h1>
            <p className="text-muted-foreground text-sm">Video ID: mock-video-001 · Processed in {trafficStats.processingTime}</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export Data
          </Button>
        </motion.div>

        {/* Processed Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card overflow-hidden mb-8"
        >
          <div className="aspect-video bg-card flex items-center justify-center relative">
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border border-muted-foreground/20" />
              ))}
            </div>
            {/* Bounding boxes simulation */}
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[40%]"
            >
              <div className="w-14 h-10 border-2 border-primary rounded relative">
                <span className="absolute -top-5 left-0 text-[9px] font-mono bg-primary/20 text-primary px-1 rounded">ID-07 Car</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [200, -200] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1.5 }}
              className="absolute left-[45%]"
            >
              <div className="w-10 h-14 border-2 border-emerald rounded relative">
                <span className="absolute -top-5 left-0 text-[9px] font-mono bg-emerald/20 text-emerald px-1 rounded">ID-12 Truck</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ x: [250, -250] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              className="absolute top-[60%]"
            >
              <div className="w-12 h-8 border-2 border-orange rounded relative">
                <span className="absolute -top-5 left-0 text-[9px] font-mono bg-orange/20 text-orange px-1 rounded">ID-23 Car</span>
              </div>
            </motion.div>

            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/20 text-primary border border-primary/20">Processed</span>
            </div>
            <span className="text-muted-foreground/30 text-sm z-10">Processed Video with Bounding Boxes</span>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Vehicles" value={124} icon={Car} trend="+8%" color="primary" delay={0} />
          <StatCard label="Left Turns" value={36} icon={ArrowLeft} color="emerald" delay={1} />
          <StatCard label="Right Turns" value={28} icon={ArrowRight} color="orange" delay={2} />
          <StatCard label="Straight" value={60} icon={MoveUp} color="primary" delay={3} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          <div className="lg:col-span-4">
            <MovementPieChart />
          </div>
          <div className="lg:col-span-8">
            <TrafficFlowChart />
          </div>
        </div>

        <VehiclesOverTimeChart />
      </div>
    </div>
  );
}
