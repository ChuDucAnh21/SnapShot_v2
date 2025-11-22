// src/components/layouts/WithRightRailTemplate.tsx
'use client';

import type { ReactNode } from 'react';
import RightRail from '@organisms/RightRail';
import { useRightRail } from '@/context';
import { cn } from '@/utils/cn';

export default function WithRightRailTemplate({
  children,
  className,
  railWidth = 352,
  stickyTop = 0,
}: {
  children: ReactNode;
  className?: string;
  railWidth?: number;
  stickyTop?: number;
}) {
  const { sections } = useRightRail();

  return (
    <div className={cn('mx-auto flex w-full gap-6 px-4 lg:px-6', className)}>
      <div className="min-h-screen flex-1 py-6">{children}</div>
      <aside className="hidden shrink-0 py-6 lg:block" style={{ width: railWidth }}>
        <div className="sticky" style={{ top: stickyTop }}>
          <RightRail sections={sections} />
        </div>
      </aside>
    </div>
  );
}
