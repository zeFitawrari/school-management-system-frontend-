import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ThemeState = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  cycleTheme: () => void;
  reset: () => void;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        setTheme: (theme) => set({ theme }, false, 'theme/set'),
        cycleTheme: () =>
          set(
            (state) => ({
              theme: state.theme === 'light' ? 'dark' : state.theme === 'dark' ? 'system' : 'light',
            }),
            false,
            'theme/cycle',
          ),
        reset: () => set({ theme: 'system' }, false, 'theme/reset'),
      }),
      {
        name: 'sms-theme',
        version: 1,
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'theme', enabled: import.meta.env.DEV },
  ),
);
