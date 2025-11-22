import React from 'react';
import { cn } from '@/utils/cn';

export type BasicBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'info' | 'success' | 'warning' | 'brand';
  children?: React.ReactNode;
};

const TONE: Record<string, string> = {
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  brand: 'bg-sky-50 text-sky-700 ring-sky-200',
};

const BasicBadge: React.FC<BasicBadgeProps> = ({ tone = 'brand', className, children, ...rest }) => (
  <span className={cn('inline-flex items-center rounded-lg px-2 py-1 text-xs ring-1', TONE[tone], className)} {...rest}>
    {children}
  </span>
);
export default BasicBadge;
