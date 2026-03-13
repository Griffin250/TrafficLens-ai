import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'emerald' | 'orange';
  delay?: number;
}

const colorMap = {
  primary: 'text-primary',
  emerald: 'text-emerald',
  orange: 'text-orange',
};

const bgMap = {
  primary: 'bg-primary/10',
  emerald: 'bg-emerald/10',
  orange: 'bg-orange/10',
};

export function StatCard({ label, value, icon: Icon, trend, trendUp = true, color = 'primary', delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : null;

  useEffect(() => {
    if (numericValue === null) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      start = start || timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * numericValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), delay * 100);
    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card-hover p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${bgMap[color]}`}>
          <Icon className={`w-5 h-5 ${colorMap[color]}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald/10 text-emerald' : 'bg-orange/10 text-orange'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">
          {numericValue !== null ? displayValue : value}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}
