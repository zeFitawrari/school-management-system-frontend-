import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string;
};

export type NotificationState = {
  unreadCount: number;
  items: NotificationItem[];
  setUnreadCount: (count: number) => void;
  add: (item: Omit<NotificationItem, 'id' | 'read'> & { id?: string; read?: boolean }) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
};

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      unreadCount: 0,
      items: [],
      setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }, false, 'notification/setUnread'),
      add: (item) => {
        const id = item.id ?? globalThis.crypto?.randomUUID?.() ?? `notification-${Date.now()}`;
        const next: NotificationItem = {
          id,
          title: item.title,
          body: item.body,
          read: item.read ?? false,
          createdAt: item.createdAt,
        };
        set(
          (state) => ({
            items: [next, ...state.items],
            unreadCount: state.unreadCount + (next.read ? 0 : 1),
          }),
          false,
          'notification/add',
        );
      },
      markRead: (id) =>
        set(
          (state) => ({
            items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
            unreadCount: Math.max(
              0,
              state.unreadCount -
                (state.items.find((item) => item.id === id && !item.read) ? 1 : 0),
            ),
          }),
          false,
          'notification/markRead',
        ),
      markAllRead: () =>
        set(
          (state) => ({
            items: state.items.map((item) => ({ ...item, read: true })),
            unreadCount: 0,
          }),
          false,
          'notification/markAllRead',
        ),
      reset: () => set({ unreadCount: 0, items: [] }, false, 'notification/reset'),
    }),
    { name: 'notification', enabled: import.meta.env.DEV },
  ),
);
