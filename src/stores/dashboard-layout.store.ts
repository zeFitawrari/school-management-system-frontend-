import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type DashboardLayoutState = {
  widgetOrder: string[];
  hiddenWidgets: string[];
  setWidgetOrder: (order: string[]) => void;
  toggleWidget: (widgetId: string) => void;
  reset: () => void;
};

export const useDashboardLayoutStore = create<DashboardLayoutState>()(
  devtools(
    persist(
      (set) => ({
        widgetOrder: [],
        hiddenWidgets: [],
        setWidgetOrder: (order) => set({ widgetOrder: order }, false, 'dashboardLayout/setOrder'),
        toggleWidget: (widgetId) =>
          set(
            (state) => ({
              hiddenWidgets: state.hiddenWidgets.includes(widgetId)
                ? state.hiddenWidgets.filter((id) => id !== widgetId)
                : [...state.hiddenWidgets, widgetId],
            }),
            false,
            'dashboardLayout/toggleWidget',
          ),
        reset: () => set({ widgetOrder: [], hiddenWidgets: [] }, false, 'dashboardLayout/reset'),
      }),
      {
        name: 'sms-dashboard-layout',
        version: 1,
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'dashboardLayout', enabled: import.meta.env.DEV },
  ),
);
