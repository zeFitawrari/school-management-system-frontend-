import type { SupportedLanguage } from '@/lib/dates';

const messages: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'app.name': 'School Management System',
    'common.loading': 'Loading',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.retry': 'Retry',
    'common.search': 'Search',
    'common.noData': 'No data found.',
    'auth.signIn': 'Sign in',
    'auth.signOut': 'Sign out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.welcomeBack': 'Welcome back',
    'navigation.dashboard': 'Dashboard',
    'navigation.home': 'Home',
    'navigation.settings': 'Settings',
    'state.accessDenied': 'Access denied',
    'state.pageNotFound': 'Page not found',
    'parents.title': 'Parents & guardians',
    'parents.subtitle': 'Guardians and the children linked to them.',
    'parents.column.parentNumber': 'Parent no.',
    'parents.column.name': 'Name',
    'parents.column.email': 'Email',
    'parents.column.branch': 'Branch',
    'parents.column.status': 'Status',
    'parents.list.new': 'Add parent',
    'parents.detail.back': 'Back to parents',
    'parents.create.title': 'Add parent',
    'parents.create.subtitle': 'Register a guardian account and link children.',
    'parents.form.fullName': 'Full name',
    'parents.form.email': 'Email',
    'parents.form.phone': 'Phone',
    'parents.form.branch': 'Branch',
    'parents.form.save': 'Save parent',
    'parents.form.linkError': 'Unable to save parent.',
    'parents.form.linkSuccess': 'Child linked successfully.',
    'parents.form.linkConfirmPrefix': 'Link this child?',
    'parents.link.title': 'Link a child',
    'parents.link.select': 'Child',
    'parents.link.continue': 'Continue',
    'parents.link.confirm': 'Confirm link',
    'parents.link.cancel': 'Cancel',
    'parents.children.empty': 'No linked children yet.',
    'parents.children.name': 'Child',
    'parents.children.group': 'Group',
    'parents.children.status': 'Status',
    'parents.status.active': 'Active',
    'parents.status.inactive': 'Inactive',
    'parents.errors.required': 'Full name is required.',
    'parents.notFound': 'Parent not found.',
  },
  am: {
    'app.name': 'የትምህርት ቤት አስተዳደር ስርዓት',
    'auth.signIn': 'ግባ',
    'auth.signOut': 'ውጣ',
    'common.cancel': 'ሰርዝ',
    'navigation.home': 'መነሻ',
    'parents.title': 'የተደረጁ ወላይታዎች እና መምሔያዎች',
    'parents.subtitle': 'የመምሔያ እና ያገናኝ ልጎች።',
    'parents.column.parentNumber': 'የመምሔያ ቁጥር',
    'parents.column.name': 'ሙሉ ስም',
    'parents.column.email': 'ኢሜይል',
    'parents.column.branch': 'ቅርንጫፍ',
    'parents.column.status': 'ሁኔታ',
    'parents.list.new': 'ወደ መዋቅር ይጨምሩ',
    'parents.detail.back': 'ወደ ወላይታዎች ዝርዝር',
    'parents.create.title': 'ወደ መዋቅር ይጨምሩ',
    'parents.create.subtitle': 'የመምሔያ አመዳደብ ይጀምሩ እና ልጎችን ይግንጽ።',
    'parents.form.fullName': 'ሙሉ ስም',
    'parents.form.email': 'ኢሜይል',
    'parents.form.phone': 'ስልክ',
    'parents.form.branch': 'ቅርንጫፍ',
    'parents.form.save': 'ወደ መዋቅር ይቀዘቅ',
    'parents.form.linkError': 'የመዋቅር ስም ያስፈልጋል።',
    'parents.form.linkSuccess': 'ልግ በተሳካ ሁኔታ ተገናኝ።',
    'parents.form.linkConfirmPrefix': 'ይህ ልግ እንደሚገናኝ?',
    'parents.link.title': 'የልግ አገናዥ',
    'parents.link.select': 'ልግ',
    'parents.link.continue': 'ይቀጥሉ',
    'parents.link.confirm': 'ያገናኙን ውሳኔ ያስገዝ',
    'parents.link.cancel': 'ሰርዝ',
    'parents.children.empty': 'እስካሁን ያገናኙ ልጎች የሉም።',
    'parents.children.name': 'ልግ',
    'parents.children.group': 'ቡድን',
    'parents.children.status': 'ሁኔታ',
    'parents.status.active': 'እውቅና',
    'parents.status.inactive': 'አተካ',
    'parents.errors.required': 'ሙሉ ስም ያስፈልጋል።',
    'parents.notFound': 'ወላይታው አልተገኘም።',
  },
  om: {
    'app.name': 'Sirna Bulchiinsa Mana Barumsaa',
    'auth.signIn': 'Seeni',
    'auth.signOut': 'Ba\'i',
    'common.cancel': 'Haquu',
    'navigation.home': 'Mana',
    'parents.title': 'Sirna Ibsoota',
    'parents.subtitle': 'Gargaaraa fi ilmaan isaa keessatti jira.',
    'parents.column.parentNumber': 'Lakki. Ibsootaa',
    'parents.column.name': 'Madda',
    'parents.column.email': 'Imeili',
    'parents.column.branch': 'Branch',
    'parents.column.status': 'Status',
    'parents.list.new': 'Sirna Ibsoota',
    'parents.detail.back': 'Garaabaraa',
    'parents.create.title': 'Sirna Ibsoota',
    'parents.create.subtitle': 'Gargaaraa fi ilmaan isaa keessatti jira.',
    'parents.form.fullName': 'Madda',
    'parents.form.email': 'Imeili',
    'parents.form.phone': 'Booda',
    'parents.form.branch': 'Branch',
    'parents.form.save': 'Sirna Ibsoota',
    'parents.form.linkError': 'Gargaaraa diyaattii isaa dha.',
    'parents.form.linkSuccess': 'Wiil-oola kan akkaantii fuudhuu.',
    'parents.form.linkConfirmPrefix': 'Ichi wiil-oola kana akkaantii wiil-oolattan?',
    'parents.link.title': 'Wiil-oola kana akkaantii',
    'parents.link.select': 'Wiil-oola',
    'parents.link.continue': 'Garaabaraa',
    'parents.link.confirm': 'Wiil-oola kan fuudhuu',
    'parents.link.cancel': 'Haqi',
    'parents.children.empty': 'Ichi wiil-oola hin dandaan fuudhuu.',
    'parents.children.name': 'Wiil-oola',
    'parents.children.group': 'Ibsa',
    'parents.children.status': 'Status',
    'parents.status.active': 'Fuudhuu',
    'parents.status.inactive': 'Hin fuudhuu',
    'parents.errors.required': 'Madda akka biirii dha.',
    'parents.notFound': 'Iboosamaa hin danda.',
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? ''));
}

export function translate(
  key: string,
  language: SupportedLanguage = 'en',
  params?: Record<string, string | number>,
): string {
  const localized = messages[language]?.[key];
  const fallback = messages.en[key];
  const template = localized ?? fallback ?? key;

  return interpolate(template, params);
}

export function availableLanguages(): SupportedLanguage[] {
  return ['en', 'am', 'om'];
}

export function hasTranslation(key: string, language: SupportedLanguage = 'en'): boolean {
  return Boolean(messages[language]?.[key]);
}
