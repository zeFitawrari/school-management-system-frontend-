import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type PayrollWizardState = {
  step: number;
  period: string | null; // ISO month/year marker, no amounts
  setStep: (step: number) => void;
  setPeriod: (period: string | null) => void;
  reset: () => void;
};

export const usePayrollWizardStore = create<PayrollWizardState>()(
  devtools(
    (set) => ({
      step: 1,
      period: null,
      setStep: (step) => set({ step }, false, 'payrollWizard/setStep'),
      setPeriod: (period) => set({ period }, false, 'payrollWizard/setPeriod'),
      reset: () => set({ step: 1, period: null }, false, 'payrollWizard/reset'),
    }),
    { name: 'payrollWizard', enabled: import.meta.env.DEV },
  ),
);
