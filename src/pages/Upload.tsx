import { VideoUploader } from '@/components/upload/VideoUploader';
import { motion } from 'framer-motion';

export default function UploadPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Traffic Video</h1>
          <p className="text-muted-foreground">Upload your traffic footage for AI-powered analysis</p>
        </motion.div>
        <VideoUploader />
      </div>
    </div>
  );
}
