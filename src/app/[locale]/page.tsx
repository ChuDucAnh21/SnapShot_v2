import { redirect } from 'next/navigation';
import { AppConfig } from '@/utils/AppConfig';

type LocaleRootPageProps = {
  params: {
    locale: string;
  };
};

const getLoginPath = (locale: string) =>
  locale === AppConfig.defaultLocale ? '/onBoarding' : `/${locale}/onBoarding`;
export default function LocaleRootPage({ params }: LocaleRootPageProps) {
  redirect(getLoginPath(params.locale));
}
