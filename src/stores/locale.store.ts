import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type AppLanguage = 'en' | 'am' | 'om';
export type CalendarPreference = 'gregorian' | 'ethiopian';

export type LocaleState = {
  language: AppLanguage;
  calendar: CalendarPreference;
  setLanguage: (language: AppLanguage) => void;
  setCalendar: (calendar: CalendarPreference) => void;
  reset: () => void;
};

export const useLocaleStore = create<LocaleState>()(
  devtools(
    persist(
      (set) => ({
        language: 'en',
        calendar: 'gregorian',
        setLanguage: (language) => set({ language }, false, 'locale/setLanguage'),
        setCalendar: (calendar) => set({ calendar }, false, 'locale/setCalendar'),
        reset: () => set({ language: 'en', calendar: 'gregorian' }, false, 'locale/reset'),
      }),
      {
        name: 'sms-locale',
        version: 1,
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'locale', enabled: import.meta.env.DEV },
  ),
);
