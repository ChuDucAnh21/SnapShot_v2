'use client';

import type { ChangeEventHandler } from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh(); // Ensure the page takes the new locale into account related to the issue #395
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white">
      <Globe size={14} aria-hidden />
      <select
        defaultValue={locale}
        onChange={handleChange}
        className="bg-transparent font-medium outline-none focus:outline-none"
        aria-label="lang-switcher"
      >
        {routing.locales.map(elt => (
          <option key={elt} value={elt} className="bg-[#0f1a1f] text-white">
            {elt.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};
