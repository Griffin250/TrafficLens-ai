import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Video, BarChart3, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

const tourSteps = [
  {
    icon: Eye,
    title: 'Welcome to TrafficLens',
    description: 'Your AI-powered traffic analysis platform. Let us show you around.',
  },
  {
    icon: Upload,
    title: 'Upload Traffic Videos',
    description: 'Drag and drop your traffic footage to begin AI-powered analysis.',
  },
  {
    icon: Video,
    title: 'AI Analysis Results',
    description: 'View processed videos with vehicle tracking, bounding boxes, and movement classifications.',
  },
  {
    icon: BarChart3,
    title: 'Explore Traffic Insights',
    description: 'Access detailed analytics with charts, vehicle counts, and flow patterns.',
  },
];

export function GuidedTour() {
  const { tourActive, tourStep, nextTourStep, skipTour } = useAppStore();

  if (!tourActive) return null;

  const currentStep = tourSteps[tourStep];
  if (!currentStep) {
    skipTour();
    return null;
  }

  const Icon = currentStep.icon;
  const isLast = tourStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          key={tourStep}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="glass-card p-8 max-w-md w-full mx-4 relative"
          style={{ borderColor: 'hsla(230, 89%, 67%, 0.2)' }}
        >
          <button
            onClick={skipTour}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="p-3 rounded-xl bg-primary/10 inline-flex mb-4">
            <Icon className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-xl font-bold mb-2">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{currentStep.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === tourStep ? 'bg-primary w-6' : i < tourStep ? 'bg-primary/40' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={skipTour} className="text-muted-foreground">
                Skip
              </Button>
              <Button size="sm" onClick={isLast ? skipTour : nextTourStep} className="bg-primary hover:bg-primary/90">
                {isLast ? 'Get Started' : 'Next'}
                {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
