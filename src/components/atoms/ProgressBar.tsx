import * as React from 'react';

export type ProgressBarProps = {
  value: number; // 0..100
  label?: string;
  colorClassName?: string; // allow custom color via tailwind
} & React.HTMLAttributes<HTMLDivElement>;

export default function ProgressBar({ value, label, colorClassName, className, ...rest }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={['w-full', className].filter(Boolean).join(' ')} {...rest}>
      {label
        ? (
          <div className="mb-1 text-xs text-[--muted]" aria-hidden>
            {label}
          </div>
        )
        : null}
      <div className="h-2 w-full overflow-hidden rounded-[--radius-sm] bg-white/10">
        <div
          className={['h-full bg-[--color-primary] transition-all', colorClassName].filter(Boolean).join(' ')}
          style={{ width: `${safe}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safe}
        />
      </div>
    </div>
  );
}
