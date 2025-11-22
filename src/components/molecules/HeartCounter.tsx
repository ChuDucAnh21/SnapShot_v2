// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { Heart } from 'lucide-react';
import * as React from 'react';
import IconText from '@/components/atoms/IconText';
import { cn } from '@/utils/cn';

export type HeartCounterProps = {
  readonly count: number;
  readonly className?: string;
  readonly iconClassName?: string;
  readonly textClassName?: string;
  readonly filled?: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
};

export default function HeartCounter({
  count,
  className,
  iconClassName,
  textClassName,
  filled = true,
  size = 'md',
}: HeartCounterProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-3 w-3',
      text: 'text-xs',
    },
    md: {
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    lg: {
      icon: 'h-5 w-5',
      text: 'text-base',
    },
  };

  const heartIcon = (
    <Heart
      className={cn(sizeClasses[size].icon, filled ? 'fill-red-500 text-red-500' : 'text-red-500', iconClassName)}
    />
  );

  return (
    <IconText
      icon={heartIcon}
      text={count}
      className={cn('text-red-600', className)}
      textClassName={cn(sizeClasses[size].text, 'font-semibold', textClassName)}
      gap="sm"
    />
  );
}
