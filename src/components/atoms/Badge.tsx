import * as React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline';

export type BadgeProps = {
  variant?: BadgeVariant;
} & React.HTMLAttributes<HTMLSpanElement>;

const base = 'inline-flex items-center gap-1 rounded-[--radius-sm] px-2 py-0.5 text-xs font-medium';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-[--foreground]',
  success: 'bg-[--color-accent] text-white',
  warning: 'bg-[--color-warning] text-black',
  danger: 'bg-[--color-danger] text-white',
  outline: 'border border-[--border] text-[--foreground]',
};

export default function Badge({ variant = 'default', className, ...rest }: BadgeProps) {
  return <span className={[base, variants[variant], className].filter(Boolean).join(' ')} {...rest} />;
}
