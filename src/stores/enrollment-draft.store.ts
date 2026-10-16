import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type EnrollmentDraftState = {
  step: number;
  studentId: string | null;
  groupId: string | null;
  packageId: string | null;
  data: Record<string, unknown>;
  setStep: (step: number) => void;
  setStudent: (studentId: string | null) => void;
  setGroup: (groupId: string | null) => void;
  setPackage: (packageId: string | null) => void;
  patchData: (patch: Record<string, unknown>) => void;
  reset: () => void;
};

export const useEnrollmentDraftStore = create<EnrollmentDraftState>()(
  devtools(
    persist(
      (set) => ({
        step: 1,
        studentId: null,
        groupId: null,
        packageId: null,
        data: {},
        setStep: (step) => set({ step }, false, 'enrollmentDraft/setStep'),
        setStudent: (studentId) => set({ studentId }, false, 'enrollmentDraft/setStudent'),
        setGroup: (groupId) => set({ groupId }, false, 'enrollmentDraft/setGroup'),
        setPackage: (packageId) => set({ packageId }, false, 'enrollmentDraft/setPackage'),
        patchData: (patch) =>
          set((state) => ({ data: { ...state.data, ...patch } }), false, 'enrollmentDraft/patch'),
        reset: () =>
          set(
            { step: 1, studentId: null, groupId: null, packageId: null, data: {} },
            false,
            'enrollmentDraft/reset',
          ),
      }),
      {
        name: 'sms-enrollment-draft',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'enrollmentDraft', enabled: import.meta.env.DEV },
  ),
);
