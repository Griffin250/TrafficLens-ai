import { Car, ArrowLeft, ArrowRight, MoveUp, Gauge, Clock, Cpu } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { MovementPieChart, TrafficFlowChart, VehiclesOverTimeChart, DensityChart } from '@/components/dashboard/TrafficCharts';
import { trafficStats } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-1">Traffic Dashboard</h1>
          <p className="text-muted-foreground text-sm">Real-time vehicle analysis and traffic flow insights</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Vehicles" value={trafficStats.totalVehicles} icon={Car} trend="+12%" trendUp color="primary" delay={0} />
          <StatCard label="Left Turns" value={trafficStats.leftTurns} icon={ArrowLeft} color="emerald" delay={1} />
          <StatCard label="Right Turns" value={trafficStats.rightTurns} icon={ArrowRight} color="orange" delay={2} />
          <StatCard label="Straight" value={trafficStats.straight} icon={MoveUp} color="primary" delay={3} />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard label="Traffic Density" value={trafficStats.density} icon={Gauge} color="orange" delay={4} />
          <StatCard label="Peak Hour" value={trafficStats.peakHour} icon={Clock} color="emerald" delay={5} />
          <StatCard label="Processing Time" value={trafficStats.processingTime} icon={Cpu} color="primary" delay={6} />
        </div>

        {/* Video Preview + Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 glass-card overflow-hidden relative"
          >
            <div className="aspect-video bg-card flex items-center justify-center relative">
              {/* Simulated video with moving elements */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-10">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-muted-foreground/20" />
                ))}
              </div>
              <motion.div animate={{ x: ['-50vw', '50vw'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute top-[45%] w-8 h-5 border-2 border-primary rounded-sm" />
              <motion.div animate={{ y: ['50vh', '-50vh'] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 1 }} className="absolute left-[48%] w-5 h-8 border-2 border-emerald rounded-sm" />
              <motion.div animate={{ x: ['50vw', '-50vw'] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', delay: 2 }} className="absolute top-[55%] w-8 h-5 border-2 border-orange rounded-sm" />

              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald/20 text-emerald border border-emerald/20">AI Active</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">Tracking: 14 IDs</span>
              </div>
              <div className="absolute bottom-4 left-4 z-10">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/20 text-primary border border-primary/20">
                  143 vehicles detected
                </span>
              </div>
              <span className="text-muted-foreground/30 text-sm z-10">Processed Video Feed</span>
            </div>
          </motion.div>
          <div className="lg:col-span-4">
            <MovementPieChart />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <TrafficFlowChart />
          <VehiclesOverTimeChart />
        </div>

        <DensityChart />
      </div>
    </div>
  );
}
