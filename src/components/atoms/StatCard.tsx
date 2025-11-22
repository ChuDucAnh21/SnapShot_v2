// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type StatCardProps = {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly value: string | number;
  readonly iconColor?: string;
  readonly isEmpty?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * StatCard — Atom
 * Displays a single statistic with icon, title, and value
 * No outer spacing (follows atomic design)
 */
export default function StatCard({
  icon: Icon,
  title,
  value,
  iconColor = 'text-[--muted]',
  isEmpty = false,
  className,
  ...rest
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex h-[112px] flex-col justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-opacity',
        isEmpty ? 'opacity-60' : 'opacity-100',
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-2">
        <Icon size={20} className={cn(iconColor, isEmpty && 'opacity-60')} aria-hidden />
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
    </div>
  );
}
