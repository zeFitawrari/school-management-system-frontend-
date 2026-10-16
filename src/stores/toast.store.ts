import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  durationMs?: number;
};

export type ToastState = {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, 'id'> & { id?: string }) => string;
  remove: (id: string) => void;
  clear: () => void;
  reset: () => void;
};

export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      toasts: [],
      push: (toast) => {
        const id = toast.id ?? globalThis.crypto?.randomUUID?.() ?? `toast-${Date.now()}`;
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }), false, 'toast/push');
        return id;
      },
      remove: (id) =>
        set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }), false, 'toast/remove'),
      clear: () => set({ toasts: [] }, false, 'toast/clear'),
      reset: () => set({ toasts: [] }, false, 'toast/reset'),
    }),
    { name: 'toast', enabled: import.meta.env.DEV },
  ),
);
