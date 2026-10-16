import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type UploadProgressInfo = {
  loaded: number;
  total: number;
  percent: number;
};

export type UploadState = {
  progress: Record<string, UploadProgressInfo>;
  setProgress: (key: string, progress: UploadProgressInfo) => void;
  remove: (key: string) => void;
  reset: () => void;
};

export const useUploadStore = create<UploadState>()(
  devtools(
    (set) => ({
      progress: {},
      setProgress: (key, progress) =>
        set((state) => ({ progress: { ...state.progress, [key]: progress } }), false, 'upload/setProgress'),
      remove: (key) =>
        set(
          (state) => {
            const next = { ...state.progress };
            delete next[key];
            return { progress: next };
          },
          false,
          'upload/remove',
        ),
      reset: () => set({ progress: {} }, false, 'upload/reset'),
    }),
    { name: 'upload', enabled: import.meta.env.DEV },
  ),
);
