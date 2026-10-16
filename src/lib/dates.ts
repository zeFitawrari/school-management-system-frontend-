export type SupportedLanguage = 'en' | 'am' | 'om';

export type CalendarPreference = 'gregorian' | 'ethiopian';

export type DateFormatOptions = {
  language?: SupportedLanguage;
  calendar?: CalendarPreference;
  dateStyle?: 'short' | 'medium' | 'long' | 'full';
  timeStyle?: 'short' | 'medium' | 'long' | 'full';
};

function toDate(value: Date | string | number): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toLocale(language: SupportedLanguage = 'en'): string {
  return language;
}

export function parseDate(value: Date | string | number): Date | null {
  return toDate(value);
}

export function formatDate(
  value: Date | string | number,
  options: DateFormatOptions = {},
): string {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  const calendar = options.calendar ?? 'gregorian';
  const intlOptions: Intl.DateTimeFormatOptions = {
    dateStyle: options.dateStyle ?? 'medium',
  };

  if (calendar === 'ethiopian') {
    intlOptions.calendar = 'ethiopic';
  }

  if (options.timeStyle) {
    intlOptions.timeStyle = options.timeStyle;
  }

  return new Intl.DateTimeFormat(toLocale(options.language), intlOptions).format(date);
}

export function formatDateTime(
  value: Date | string | number,
  options: DateFormatOptions = {},
): string {
  return formatDate(value, { ...options, timeStyle: options.timeStyle ?? 'short' });
}

export function formatGregorianDate(
  value: Date | string | number,
  options: Omit<DateFormatOptions, 'calendar'> = {},
): string {
  return formatDate(value, { ...options, calendar: 'gregorian' });
}

export function formatEthiopianDate(
  value: Date | string | number,
  options: Omit<DateFormatOptions, 'calendar'> = {},
): string {
  return formatDate(value, { ...options, calendar: 'ethiopian' });
}

/**
 * Academic-year boundary is open (O13). September is used as the proposed default.
 */
export function academicYearOf(
  value: Date | string | number,
  startMonth = 9,
): string {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month >= startMonth) {
    return `${year}/${year + 1}`;
  }

  return `${year - 1}/${year}`;
}

export function isEthiopianPagumeMonth(
  value: Date | string | number,
  language: SupportedLanguage = 'en',
): boolean {
  const date = toDate(value);

  if (!date) {
    return false;
  }

  const parts = new Intl.DateTimeFormat(language, {
    calendar: 'ethiopic',
    month: 'long',
  }).formatToParts(date);

  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  return month.toLowerCase().includes('pag');
}
