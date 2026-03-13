import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Eye, BarChart3, Compass, Route, Car, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Eye, title: 'AI Vehicle Detection', desc: 'Detect and classify vehicles in real-time using computer vision.' },
  { icon: BarChart3, title: 'Traffic Flow Analytics', desc: 'Comprehensive analytics on traffic patterns and density.' },
  { icon: Route, title: 'Turn Detection', desc: 'Classify left turns, right turns, and straight movements.' },
  { icon: Activity, title: 'Visualized Data', desc: 'Interactive charts and graphs for traffic insights.' },
  { icon: Car, title: 'Vehicle Tracking', desc: 'Track individual vehicles across frames with unique IDs.' },
  { icon: Compass, title: 'Smart Intersections', desc: 'Analyze intersection efficiency and flow optimization.' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function Landing() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald/5 blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-glow" />
              AI-Powered Analytics
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">TrafficLens</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium mb-4">
              AI-Powered Traffic Video Analytics
            </p>
            <p className="text-base text-muted-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload traffic footage and instantly analyze vehicle movement patterns using AI-powered computer vision. Detect vehicles, track trajectories, and generate actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 px-8">
                <Link to="/upload">
                  Upload Video <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">
                  <Play className="w-4 h-4 mr-2" /> See Demo
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-muted-foreground">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mt-20 relative"
          >
            <div className="glass-card p-1 relative overflow-hidden">
              <div className="bg-card rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Simulated intersection */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-muted-foreground/20" />
                  ))}
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground/10" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-muted-foreground/10" />

                {/* Animated vehicles */}
                <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute top-[48%] w-3 h-2 bg-primary rounded-sm" />
                <motion.div animate={{ y: ['100%', '-100%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 1 }} className="absolute left-[49%] w-2 h-3 bg-emerald rounded-sm" />
                <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', delay: 2 }} className="absolute top-[52%] w-3 h-2 bg-orange rounded-sm" />

                {/* Overlay badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald/20 text-emerald border border-emerald/20">
                    AI Active
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                    Tracking: 14 IDs
                  </span>
                </div>

                <div className="relative z-10 text-muted-foreground/40 text-sm">Live Preview</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Intelligent intersections start with precise data</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TrafficLens combines state-of-the-art computer vision with intuitive analytics to transform raw traffic footage into actionable intelligence.
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item} className="glass-card-hover p-6">
                <div className="p-2.5 rounded-xl bg-primary/10 inline-flex mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to analyze your traffic data?</h2>
            <p className="text-muted-foreground mb-8">Upload your first video and get AI-powered insights in seconds.</p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 px-8">
              <Link to="/upload">
                Start Analyzing <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 TrafficLens. AI-Powered Traffic Analytics.</p>
          <div className="flex gap-6">
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
