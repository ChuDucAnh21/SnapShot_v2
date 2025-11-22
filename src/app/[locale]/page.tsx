import { redirect } from 'next/navigation';
import { AppConfig } from '@/utils/AppConfig';

type LocaleRootPageProps = {
  params: Promise<{ locale: string }>;
};

const getLoginPath = (locale: string) =>
  locale === AppConfig.defaultLocale ? '/onBoarding' : `/${locale}/onBoarding`;

export default async function LocaleRootPage({ params }: LocaleRootPageProps) {
  const { locale } = await params;

  redirect(getLoginPath(locale));
}
