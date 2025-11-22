import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, frFR, viVN } from '@clerk/localizations';

type LocalizationResource = Record<string, unknown>;

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Nextjs Starter',
  locales: ['vi', 'en', 'fr'],
  defaultLocale: 'vi',
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  vi: viVN,
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: viVN,
  supportedLocales,
};
