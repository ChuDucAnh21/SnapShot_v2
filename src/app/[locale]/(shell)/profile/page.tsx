// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
import { setRequestLocale } from 'next-intl/server';
import ProfileClient from './ProfileClient';

export const metadata = {
  title: 'Profile - Iruka',
  description: 'View your learning profile, achievements, and statistics',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <ProfileClient />;
}
