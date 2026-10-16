import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type MarkCellValue = number | string | null;

export type MarksDraftState = {
  assessmentId: string | null;
  values: Record<string, MarkCellValue>;
  dirty: boolean;
  setAssessment: (assessmentId: string | null) => void;
  setValue: (key: string, value: MarkCellValue) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
};

export const useMarksDraftStore = create<MarksDraftState>()(
  devtools(
    persist(
      (set) => ({
        assessmentId: null,
        values: {},
        dirty: false,
        setAssessment: (assessmentId) =>
          set({ assessmentId, values: {}, dirty: false }, false, 'marksDraft/setAssessment'),
        setValue: (key, value) =>
          set((state) => ({ values: { ...state.values, [key]: value }, dirty: true }), false, 'marksDraft/setValue'),
        setDirty: (dirty) => set({ dirty }, false, 'marksDraft/setDirty'),
        reset: () => set({ assessmentId: null, values: {}, dirty: false }, false, 'marksDraft/reset'),
      }),
      {
        name: 'sms-marks-draft',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'marksDraft', enabled: import.meta.env.DEV },
  ),
);
