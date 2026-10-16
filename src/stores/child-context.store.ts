import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type ChildContextState = {
  selectedChildId: string | null;
  setSelectedChild: (childId: string | null) => void;
  reset: () => void;
};

export const useChildContextStore = create<ChildContextState>()(
  devtools(
    persist(
      (set) => ({
        selectedChildId: null,
        setSelectedChild: (childId) => set({ selectedChildId: childId }, false, 'childContext/set'),
        reset: () => set({ selectedChildId: null }, false, 'childContext/reset'),
      }),
      {
        name: 'sms-child-context',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'childContext', enabled: import.meta.env.DEV },
  ),
);
