import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type StudentDraftState = {
  step: number;
  data: Record<string, unknown>;
  setStep: (step: number) => void;
  setData: (data: Record<string, unknown>) => void;
  patchData: (patch: Record<string, unknown>) => void;
  reset: () => void;
};

export const useStudentDraftStore = create<StudentDraftState>()(
  devtools(
    persist(
      (set) => ({
        step: 1,
        data: {},
        setStep: (step) => set({ step }, false, 'studentDraft/setStep'),
        setData: (data) => set({ data }, false, 'studentDraft/setData'),
        patchData: (patch) =>
          set((state) => ({ data: { ...state.data, ...patch } }), false, 'studentDraft/patch'),
        reset: () => set({ step: 1, data: {} }, false, 'studentDraft/reset'),
      }),
      {
        name: 'sms-student-draft',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'studentDraft', enabled: import.meta.env.DEV },
  ),
);
