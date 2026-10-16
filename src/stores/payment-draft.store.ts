import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type PaymentMethod = 'cash' | 'bank' | 'wallet' | 'card' | 'other';

export type PaymentDraftState = {
  amount: number | null;
  method: PaymentMethod | null;
  reference: string;
  idempotencyKey: string | null;
  setAmount: (amount: number | null) => void;
  setMethod: (method: PaymentMethod | null) => void;
  setReference: (reference: string) => void;
  ensureIdempotencyKey: () => string;
  clearIdempotencyKey: () => void;
  reset: () => void;
};

export const usePaymentDraftStore = create<PaymentDraftState>()(
  devtools(
    (set, get) => ({
      amount: null,
      method: null,
      reference: '',
      idempotencyKey: null,
      setAmount: (amount) => set({ amount }, false, 'paymentDraft/setAmount'),
      setMethod: (method) => set({ method }, false, 'paymentDraft/setMethod'),
      setReference: (reference) => set({ reference }, false, 'paymentDraft/setReference'),
      ensureIdempotencyKey: () => {
        const existing = get().idempotencyKey;

        if (existing) {
          return existing;
        }

        const next =
          globalThis.crypto?.randomUUID?.() ??
          `pay-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        set({ idempotencyKey: next }, false, 'paymentDraft/ensureIdempotencyKey');
        return next;
      },
      clearIdempotencyKey: () => set({ idempotencyKey: null }, false, 'paymentDraft/clearKey'),
      reset: () =>
        set(
          { amount: null, method: null, reference: '', idempotencyKey: null },
          false,
          'paymentDraft/reset',
        ),
    }),
    { name: 'paymentDraft', enabled: import.meta.env.DEV },
  ),
);
