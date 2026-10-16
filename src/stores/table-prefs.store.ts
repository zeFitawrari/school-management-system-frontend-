import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type TableDensity = 'comfortable' | 'compact';

export type TablePreferences = {
  columns: string[];
  density: TableDensity;
  pageSize: number;
};

export type TablePrefsState = {
  preferences: Record<string, TablePreferences>;
  setColumns: (tableId: string, columns: string[]) => void;
  setDensity: (tableId: string, density: TableDensity) => void;
  setPageSize: (tableId: string, pageSize: number) => void;
  clearTable: (tableId: string) => void;
  reset: () => void;
};

export const useTablePrefsStore = create<TablePrefsState>()(
  devtools(
    persist(
      (set) => ({
        preferences: {},
        setColumns: (tableId, columns) =>
          set(
            (state) => ({
              preferences: {
                ...state.preferences,
                [tableId]: {
                  columns,
                  density: state.preferences[tableId]?.density ?? 'comfortable',
                  pageSize: state.preferences[tableId]?.pageSize ?? 25,
                },
              },
            }),
            false,
            'tablePrefs/setColumns',
          ),
        setDensity: (tableId, density) =>
          set(
            (state) => ({
              preferences: {
                ...state.preferences,
                [tableId]: {
                  columns: state.preferences[tableId]?.columns ?? [],
                  density,
                  pageSize: state.preferences[tableId]?.pageSize ?? 25,
                },
              },
            }),
            false,
            'tablePrefs/setDensity',
          ),
        setPageSize: (tableId, pageSize) =>
          set(
            (state) => ({
              preferences: {
                ...state.preferences,
                [tableId]: {
                  columns: state.preferences[tableId]?.columns ?? [],
                  density: state.preferences[tableId]?.density ?? 'comfortable',
                  pageSize,
                },
              },
            }),
            false,
            'tablePrefs/setPageSize',
          ),
        clearTable: (tableId) =>
          set(
            (state) => {
              const next = { ...state.preferences };
              delete next[tableId];
              return { preferences: next };
            },
            false,
            'tablePrefs/clearTable',
          ),
        reset: () => set({ preferences: {} }, false, 'tablePrefs/reset'),
      }),
      {
        name: 'sms-table-prefs',
        version: 1,
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'tablePrefs', enabled: import.meta.env.DEV },
  ),
);
