import { useToastStore } from '@/stores/toast.store';

export type ToastOptions = Parameters<ReturnType<typeof useToastStore.getState>['push']>[0];

export function useToast() {
  const push = useToastStore((state) => state.push);
  const remove = useToastStore((state) => state.remove);
  const clear = useToastStore((state) => state.clear);

  return {
    toast: (options: ToastOptions) => push(options),
    dismiss: (id: string) => remove(id),
    clear,
  };
}

export function toast(options: ToastOptions): string {
  return useToastStore.getState().push(options);
}
