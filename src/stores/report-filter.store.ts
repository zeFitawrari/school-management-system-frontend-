import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type ReportFilterState = {
  filtersByReport: Record<string, Record<string, unknown>>;
  setFilters: (reportId: string, filters: Record<string, unknown>) => void;
  clear: (reportId?: string) => void;
  reset: () => void;
};

export const useReportFilterStore = create<ReportFilterState>()(
  devtools(
    persist(
      (set) => ({
        filtersByReport: {},
        setFilters: (reportId, filters) =>
          set(
            (state) => ({
              filtersByReport: { ...state.filtersByReport, [reportId]: filters },
            }),
            false,
            'reportFilter/set',
          ),
        clear: (reportId) =>
          set(
            (state) => {
              if (!reportId) {
                return { filtersByReport: {} };
              }
              const next = { ...state.filtersByReport };
              delete next[reportId];
              return { filtersByReport: next };
            },
            false,
            'reportFilter/clear',
          ),
        reset: () => set({ filtersByReport: {} }, false, 'reportFilter/reset'),
      }),
      {
        name: 'sms-report-filter',
        version: 1,
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'reportFilter', enabled: import.meta.env.DEV },
  ),
);
