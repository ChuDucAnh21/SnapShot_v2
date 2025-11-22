import type { LeftNavProps } from '@/components/organisms/LeftNav';
import { setRequestLocale } from 'next-intl/server';
import QueryProvider from '@/app/query-provider';
import AppShellGrid from '@/components/templates/AppShellGrid';

const navItems: LeftNavProps['items'] = [
  { icon: 'learn', label: 'Bài Học', href: '/learn' },
  { icon: 'profile', label: 'Hồ sơ', href: '/profile' },
  { icon: 'chart', label: 'Snapshot', href: '/snapshot/12' },
  { icon: 'game', label: 'Game Hub', href: '/hub' },
  { icon: 'friend', label: 'Bạn bè', href: '/friend' },
  { icon: 'setting', label: 'Cài đặt', href: '/setting' },
];

export default async function ShellLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <QueryProvider><AppShellGrid navItems={navItems}>{props.children}</AppShellGrid></QueryProvider>;
}
