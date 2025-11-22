'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AppConfig } from '@/utils/AppConfig';
import Logo from '../atoms/Logo';
import NavList from '../molecules/NavList';

export type LeftNavProps = {
  items: { icon?: string | React.ReactElement; label: string; href?: string; active?: boolean }[];
  className?: string;
};

const normalizePath = (path?: string | null) => {
  if (!path) {
    return undefined;
  }
  const ensuredLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const segments = ensuredLeadingSlash.split('/').filter(Boolean);
  if (segments.length > 0 && AppConfig.locales.includes(segments[0] as string)) {
    segments.shift();
  }
  if (segments.length === 0) {
    return '/';
  }
  return `/${segments.join('/')}`;
};

const LeftNav: React.FC<LeftNavProps> = ({ items }) => {
  const pathname = usePathname();
  const computedItems = React.useMemo(() => {
    const normalizedPathname = normalizePath(pathname);
    return items.map((it) => {
      if (typeof it.active === 'boolean') {
        return {
          ...it,
          active: it.active,
        };
      }
      const normalizedHref = normalizePath(it.href);
      const isActive = Boolean(
        normalizedPathname
        && normalizedHref
        && (normalizedPathname === normalizedHref
          || (normalizedHref !== '/' && normalizedPathname.startsWith(normalizedHref))),
      );

      return {
        ...it,
        active: isActive,
      };
    });
  }, [items, pathname]);

  return (
    <aside className="hidden h-screen border-r-2 border-gray-200 bg-white p-4 text-gray-800 lg:flex lg:w-[256px] lg:flex-col shadow-sm">
      <div className="mb-6">
        <Logo label="Iruka" className="my-2 flex justify-center" />
      </div>
      <NavList items={computedItems} />
      <div className="mt-auto text-xs text-gray-400">v0.1</div>
    </aside>
  );
};

export default LeftNav;
