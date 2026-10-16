import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type BranchSummary = {
  id: string;
  name: string;
};

export type BranchState = {
  activeBranchId: string | null;
  availableBranches: BranchSummary[];
  setActiveBranch: (branchId: string | null) => void;
  setAvailableBranches: (branches: BranchSummary[]) => void;
  reset: () => void;
};

export const useBranchStore = create<BranchState>()(
  devtools(
    persist(
      (set) => ({
        activeBranchId: null,
        availableBranches: [],
        setActiveBranch: (branchId) => set({ activeBranchId: branchId }, false, 'branch/setActive'),
        setAvailableBranches: (branches) =>
          set({ availableBranches: branches }, false, 'branch/setAvailable'),
        reset: () => set({ activeBranchId: null, availableBranches: [] }, false, 'branch/reset'),
      }),
      {
        name: 'sms-branch',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ activeBranchId: state.activeBranchId }),
      },
    ),
    { name: 'branch', enabled: import.meta.env.DEV },
  ),
);
