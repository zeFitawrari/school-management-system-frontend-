import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type CalendarViewMode = 'day' | 'week' | 'month';

export type CalendarViewState = {
  viewMode: CalendarViewMode;
  anchorDate: string | null;
  filters: Record<string, unknown>;
  setViewMode: (mode: CalendarViewMode) => void;
  setAnchorDate: (date: string | null) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  reset: () => void;
};

export const useCalendarViewStore = create<CalendarViewState>()(
  devtools(
    persist(
      (set) => ({
        viewMode: 'week',
        anchorDate: null,
        filters: {},
        setViewMode: (mode) => set({ viewMode: mode }, false, 'calendarView/setMode'),
        setAnchorDate: (date) => set({ anchorDate: date }, false, 'calendarView/setAnchor'),
        setFilters: (filters) => set({ filters }, false, 'calendarView/setFilters'),
        reset: () =>
          set({ viewMode: 'week', anchorDate: null, filters: {} }, false, 'calendarView/reset'),
      }),
      {
        name: 'sms-calendar-view',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          viewMode: state.viewMode,
          anchorDate: state.anchorDate,
          filters: state.filters,
        }),
      },
    ),
    { name: 'calendarView', enabled: import.meta.env.DEV },
  ),
);
