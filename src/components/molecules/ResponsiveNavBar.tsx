// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import Link from 'next/link';
import * as React from 'react';
import MobileDrawer from './MobileDrawer';
import MobileTopBar from './MobileTopBar';

type ResponsiveNavBarProps = {
  readonly title: string;
  readonly links?: Array<{ href: string; label: string }>;
};

const defaultLinks: Array<{ href: string; label: string }> = [
  { href: '/learn', label: '📚 Học tập' },
  { href: '/profile', label: '👤 Hồ sơ' },
  { href: 'https://child-snapshot.vercel.app/', label: '🔍 Snapshot' },
  { href: '/hub', label: '🎮 Game Hub' },
];

export default function ResponsiveNavBar({ title, links = defaultLinks }: ResponsiveNavBarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full">
      {/* Single Top Bar visible on mobile and laptop (hidden on desktop) */}
      <div className="lg:hidden">
        <MobileTopBar title={title} onOpenMenu={() => setOpen(true)} />
      </div>

      {/* Drawer for Mobile + Laptop */}
      <MobileDrawer open={open} onOpenChange={setOpen} title="🎯 Menu">
        <nav className="p-2 space-y-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </MobileDrawer>
    </div>
  );
}
