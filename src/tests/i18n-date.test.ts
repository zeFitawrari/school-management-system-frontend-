import { describe, expect, it } from 'vitest';

import { academicYearOf, formatDate, formatEthiopianDate } from '@/lib/dates';
import { formatCurrency } from '@/lib/currency';
import { translate } from '@/lib/i18n';

describe('date and i18n helpers', () => {
  it('formats a Gregorian date', () => {
    expect(formatDate('2026-10-14T12:00:00Z', { dateStyle: 'short' })).not.toBe('');
  });

  it('formats an Ethiopian calendar date when supported', () => {
    const formatted = formatEthiopianDate('2026-10-14T12:00:00Z', { dateStyle: 'medium' });
    expect(typeof formatted).toBe('string');
  });

  it('derives an academic year', () => {
    expect(academicYearOf('2026-10-14')).toBe('2026/2027');
  });

  it('formats currency', () => {
    expect(formatCurrency(1234.5, { language: 'en' })).toContain('1,234.50');
  });

  it('falls back to English and then the key', () => {
    expect(translate('auth.signIn', 'en')).toBe('Sign in');
    expect(translate('totally.unknown.key', 'am')).toBe('totally.unknown.key');
  });
});
