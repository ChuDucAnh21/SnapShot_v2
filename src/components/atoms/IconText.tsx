// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type IconTextProps = {
  readonly icon: React.ReactNode;
  readonly text: string | number;
  readonly className?: string;
  readonly iconClassName?: string;
  readonly textClassName?: string;
  readonly direction?: 'horizontal' | 'vertical';
  readonly gap?: 'sm' | 'md' | 'lg';
  readonly align?: 'start' | 'center' | 'end';
};

export default function IconText({
  icon,
  text,
  className,
  iconClassName,
  textClassName,
  direction = 'horizontal',
  gap = 'md',
  align = 'center',
}: IconTextProps) {
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  const flexDirection = direction === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={cn('flex', flexDirection, gapClasses[gap], alignClasses[align], className)}>
      <div className={cn('flex-shrink-0', iconClassName)}>{icon}</div>
      <span className={cn('text-sm font-medium', textClassName)}>{text}</span>
    </div>
  );
}
