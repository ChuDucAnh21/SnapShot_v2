'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type PathMascotProps = {
  readonly label?: string;
  readonly className?: string;
};

export default function PathMascot({ label = 'Keep going!', className }: PathMascotProps) {
  return (
    <div className={cn('pointer-events-none absolute z-[12] flex flex-col items-center gap-2', className)}>
      <span className="inline-flex h-[140px] w-[132px] scale-75 items-center justify-center rounded-[44px] bg-gradient-to-r from-pink-500 to-purple-600 text-6xl shadow-lg">
        🦉
      </span>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase shadow-sm">
        {label}
      </span>
    </div>
  );
}
