import { useCallback } from 'react';

import { translate } from '@/lib/i18n';
import { useLocaleStore } from '@/stores/locale.store';
import type { SupportedLanguage } from '@/lib/dates';

export function useTranslation() {
  const language = useLocaleStore((state) => state.language);
  const setLanguage = useLocaleStore((state) => state.setLanguage);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(key, language as SupportedLanguage, params),
    [language],
  );

  return { t, language, setLanguage };
}
