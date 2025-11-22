// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { Apple, Circle, Square, Star, Triangle } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type MathIconProps = {
  readonly value: number;
  readonly type: 'apple' | 'star' | 'circle' | 'square' | 'triangle';
  readonly size: 'sm' | 'md' | 'lg';
  readonly animated?: boolean;
  readonly className?: string;
};

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

const typeClasses = {
  apple: 'text-red-500',
  star: 'text-yellow-500',
  circle: 'text-blue-500',
  square: 'text-green-500',
  triangle: 'text-purple-500',
};

const iconMap = {
  apple: Apple,
  star: Star,
  circle: Circle,
  square: Square,
  triangle: Triangle,
};

export default function MathIcon({ value, type, size, animated = false, className }: MathIconProps) {
  const IconComponent = iconMap[type];

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-white/10',
        sizeClasses[size],
        typeClasses[type],
        animated && 'animate-pulse',
        className,
      )}
      role="img"
      aria-label={`${value} ${type}`}
    >
      <div className="relative flex items-center justify-center">
        <IconComponent className={cn('absolute', iconSizeClasses[size])} />
        <span className="relative z-10 text-xs font-bold text-white">{value}</span>
      </div>
    </div>
  );
}
