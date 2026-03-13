import { motion } from 'framer-motion';
import { Upload, Cpu, Route, BarChart3, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Traffic Video',
    desc: 'Upload your recorded traffic footage in MP4, MOV, or AVI format. Simply drag and drop or browse your files.',
    color: 'primary' as const,
  },
  {
    icon: Cpu,
    title: 'AI Scans & Detects Vehicles',
    desc: 'TrafficLens AI processes every frame using advanced computer vision to detect and identify vehicles in the scene.',
    color: 'emerald' as const,
  },
  {
    icon: Route,
    title: 'Vehicle Tracking Across Frames',
    desc: 'Each vehicle is assigned a unique ID and tracked across consecutive frames to determine its movement trajectory.',
    color: 'orange' as const,
  },
  {
    icon: Sparkles,
    title: 'Movement Classification',
    desc: 'The system classifies each vehicle\'s movement as left turn, right turn, or straight passage through the intersection.',
    color: 'primary' as const,
  },
  {
    icon: BarChart3,
    title: 'Analytics Generation',
    desc: 'Comprehensive traffic analytics are generated including vehicle counts, flow charts, density heatmaps, and movement distribution insights.',
    color: 'emerald' as const,
  },
];

const colorStyles = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  emerald: { bg: 'bg-emerald/10', text: 'text-emerald', border: 'border-emerald/20' },
  orange: { bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/20' },
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">How TrafficLens Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From raw footage to actionable insights in five simple steps powered by AI computer vision.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, i) => {
              const styles = colorStyles[step.color];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="relative flex gap-6 sm:pl-0"
                >
                  {/* Step number circle */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-center flex-shrink-0 relative z-10`}>
                      <step.icon className={`w-7 h-7 ${styles.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="glass-card-hover p-6 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold ${styles.text} ${styles.bg} px-2 py-0.5 rounded-full`}>
                        Step {i + 1}
                      </span>
                      <div className={`sm:hidden p-2 rounded-lg ${styles.bg}`}>
                        <step.icon className={`w-4 h-4 ${styles.text}`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
