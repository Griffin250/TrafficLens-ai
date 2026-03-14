import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileVideo, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useProcessingJob } from '@/hooks/useApi';
import { videosApi } from '@/services/api';
import { Button } from '@/components/ui/button';

export function VideoUploader() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uploadProgress, setUploadProgress, isProcessing, setIsProcessing, currentVideoId, setCurrentVideoId } = useAppStore();
  const [uploaded, setUploaded] = useState(false);

  // Poll processing job status after upload
  const { data: job } = useProcessingJob(currentVideoId, isProcessing);

  // When job completes, update UI
  if (job && isProcessing) {
    if (job.status === 'completed') {
      setIsProcessing(false);
      setUploaded(true);
    } else if (job.status === 'failed') {
      setIsProcessing(false);
      setError(job.error_message || 'Processing failed');
    }
  }

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
      setError(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isVideoFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const isVideoFile = (f: File) =>
    ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(f.type);

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setUploadProgress(0);
    setError(null);

    try {
      const response = await videosApi.upload(file, (pct) => {
        setUploadProgress(pct);
      });

      const { id } = response.data;
      setCurrentVideoId(id);
      setUploadProgress(100);
      // Now polling takes over via useProcessingJob
    } catch (err: any) {
      setIsProcessing(false);
      const message =
        err.response?.data?.detail || err.message || 'Upload failed';
      setError(message);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploaded(false);
    setUploadProgress(0);
    setIsProcessing(false);
    setCurrentVideoId(null);
    setError(null);
  };

  const processingProgress = job?.progress ?? (uploadProgress < 100 ? uploadProgress : 0);

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

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress < 100 ? uploadProgress : processingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {uploadProgress < 100
                      ? 'Uploading to server...'
                      : `AI Processing... ${processingProgress}%`}
                  </span>
                  <span>{uploadProgress < 100 ? `${Math.round(uploadProgress)}%` : `${processingProgress}%`}</span>
                </div>
                {uploadProgress >= 100 && (
                  <div className="relative h-1 rounded-full overflow-hidden bg-muted mt-2">
                    <div className="neural-pulse absolute inset-0 h-full w-1/3" />
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={handleUpload} className="w-full bg-primary hover:bg-primary/90">
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
            <p className="text-sm text-muted-foreground mb-6">
              {(file.size / (1024 * 1024)).toFixed(1)} MB processed
              {job?.completed_at && job?.started_at
                ? ` in ${((new Date(job.completed_at).getTime() - new Date(job.started_at).getTime()) / 1000).toFixed(1)}s`
                : ''}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={resetUpload}>Upload Another</Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate(`/results/${currentVideoId}`)}
              >
                View Results
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
