import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export type AttendanceStatusValue = 'present' | 'absent' | 'late' | 'excused';

export type AttendanceDraftState = {
  sessionId: string | null;
  marks: Record<string, AttendanceStatusValue>;
  dirty: boolean;
  setSession: (sessionId: string | null) => void;
  setMark: (studentId: string, status: AttendanceStatusValue) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
};

export const useAttendanceDraftStore = create<AttendanceDraftState>()(
  devtools(
    persist(
      (set) => ({
        sessionId: null,
        marks: {},
        dirty: false,
        setSession: (sessionId) => set({ sessionId, marks: {}, dirty: false }, false, 'attendanceDraft/setSession'),
        setMark: (studentId, status) =>
          set(
            (state) => ({ marks: { ...state.marks, [studentId]: status }, dirty: true }),
            false,
            'attendanceDraft/setMark',
          ),
        setDirty: (dirty) => set({ dirty }, false, 'attendanceDraft/setDirty'),
        reset: () => set({ sessionId: null, marks: {}, dirty: false }, false, 'attendanceDraft/reset'),
      }),
      {
        name: 'sms-attendance-draft',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'attendanceDraft', enabled: import.meta.env.DEV },
  ),
);
