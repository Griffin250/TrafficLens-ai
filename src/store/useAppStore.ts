import { create } from 'zustand';

interface AppState {
  tourActive: boolean;
  tourStep: number;
  uploadProgress: number;
  isProcessing: boolean;
  currentVideoId: string | null;
  startTour: () => void;
  nextTourStep: () => void;
  skipTour: () => void;
  setUploadProgress: (p: number) => void;
  setIsProcessing: (v: boolean) => void;
  setCurrentVideoId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tourActive: false,
  tourStep: 0,
  uploadProgress: 0,
  isProcessing: false,
  currentVideoId: null,
  startTour: () => set({ tourActive: true, tourStep: 0 }),
  nextTourStep: () => set((s) => ({ tourStep: s.tourStep + 1 })),
  skipTour: () => set({ tourActive: false, tourStep: 0 }),
  setUploadProgress: (p) => set({ uploadProgress: p }),
  setIsProcessing: (v) => set({ isProcessing: v }),
  setCurrentVideoId: (id) => set({ currentVideoId: id }),
}));
