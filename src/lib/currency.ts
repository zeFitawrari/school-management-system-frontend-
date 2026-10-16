import type { SupportedLanguage } from '@/lib/dates';

export type CurrencyFormatOptions = {
  language?: SupportedLanguage;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {},
): string {
  const currency = options.currency ?? 'ETB';

  return new Intl.NumberFormat(options.language ?? 'en', {
    style: 'currency',
    currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
}

export function formatMoney(amount: number, language: SupportedLanguage = 'en'): string {
  return formatCurrency(amount, { language });
}

export function parseMoney(value: string): number | null {
  const normalized = value.replace(/[^0-9.,-]/g, '').replace(/,/g, '');

  if (normalized === '' || normalized === '-' || normalized === '.' ) {
    return null;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}
