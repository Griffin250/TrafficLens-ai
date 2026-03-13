import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileVideo, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

export function VideoUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { uploadProgress, setUploadProgress, isProcessing, setIsProcessing, setCurrentVideoId } = useAppStore();
  const [uploaded, setUploaded] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isVideoFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isVideoFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const isVideoFile = (f: File) => ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(f.type);

  const simulateUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsProcessing(false);
          setUploaded(true);
          setCurrentVideoId('mock-video-001');
        }, 1000);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const resetUpload = () => {
    setFile(null);
    setUploaded(false);
    setUploadProgress(0);
    setIsProcessing(false);
    setCurrentVideoId(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`glass-card border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 ${
              dragActive ? 'border-primary/50 bg-primary/5' : 'border-border/50 hover:border-primary/30'
            }`}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".mp4,.mov,.avi"
              className="hidden"
              onChange={handleFileSelect}
            />
            <motion.div
              animate={dragActive ? { y: -4 } : { y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 rounded-2xl bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">Drop your traffic video here</p>
                <p className="text-sm text-muted-foreground">Supports MP4, MOV, AVI formats</p>
              </div>
            </motion.div>
          </motion.div>
        ) : !uploaded ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <FileVideo className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              {!isProcessing && (
                <button onClick={resetUpload} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {uploadProgress < 100 ? 'Uploading...' : 'Processing with AI...'}
                  </span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                {uploadProgress >= 100 && (
                  <div className="relative h-1 rounded-full overflow-hidden bg-muted mt-2">
                    <div className="neural-pulse absolute inset-0 h-full w-1/3" />
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={simulateUpload} className="w-full bg-primary hover:bg-primary/90">
                Start Analysis
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="p-4 rounded-2xl bg-emerald/10 inline-flex mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald" />
            </div>
            <p className="text-lg font-semibold mb-1">Analysis Complete</p>
            <p className="text-sm text-muted-foreground mb-6">4.2GB processed in 12.4s</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={resetUpload}>Upload Another</Button>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <a href="/results">View Results</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
