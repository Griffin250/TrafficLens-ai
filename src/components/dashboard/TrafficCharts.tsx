import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';
import { timeSeriesData, movementDistribution, densityData } from '@/data/mockData';
import { motion } from 'framer-motion';

const CHART_COLORS = {
  primary: 'hsl(230, 89%, 67%)',
  emerald: 'hsl(160, 84%, 39%)',
  orange: 'hsl(24, 94%, 50%)',
  muted: 'hsl(215, 20%, 30%)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export function MovementPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Movement Distribution</h3>
      <p className="text-xs text-muted-foreground/60 mb-4">Vehicle turn classification</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={movementDistribution} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
            {movementDistribution.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {movementDistribution.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.fill }} />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function TrafficFlowChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Traffic Flow</h3>
      <p className="text-xs text-muted-foreground/60 mb-4">Vehicles by movement type over time</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={timeSeriesData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} opacity={0.3} />
          <XAxis dataKey="time" stroke={CHART_COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis stroke={CHART_COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="straight" name="Straight" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
          <Bar dataKey="left" name="Left" fill={CHART_COLORS.emerald} radius={[3, 3, 0, 0]} />
          <Bar dataKey="right" name="Right" fill={CHART_COLORS.orange} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function VehiclesOverTimeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Vehicles Over Time</h3>
      <p className="text-xs text-muted-foreground/60 mb-4">Total detected vehicles per hour</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={timeSeriesData}>
          <defs>
            <linearGradient id="vehicleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} opacity={0.3} />
          <XAxis dataKey="time" stroke={CHART_COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis stroke={CHART_COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke={CHART_COLORS.primary} fill="url(#vehicleGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function DensityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Traffic Density</h3>
      <p className="text-xs text-muted-foreground/60 mb-4">Congestion levels throughout the day</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={densityData}>
          <defs>
            <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.orange} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.orange} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} opacity={0.3} />
          <XAxis dataKey="time" stroke={CHART_COLORS.muted} fontSize={11} tickLine={false} />
          <YAxis stroke={CHART_COLORS.muted} fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="density" name="Density" stroke={CHART_COLORS.orange} fill="url(#densityGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
