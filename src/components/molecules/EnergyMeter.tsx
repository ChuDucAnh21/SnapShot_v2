import Icon from '@atoms/Icon';
import * as React from 'react';

export default function EnergyMeter({ value, regenLabel }: { value: number; regenLabel?: string }) {
  const max = 5;
  const clamped = Math.max(0, Math.min(max, value));
  return (
    <div className="inline-flex items-center gap-1 text-[--foreground]">
      {Array.from({ length: max }).map((_, i) => (
        <Icon
          key={i}
          name="bolt"
          size={14}
          className={i < clamped ? 'text-[--color-warning]' : 'text-white/20'}
          aria-hidden
        />
      ))}
      {regenLabel ? <span className="ml-1 text-xs text-[--muted]">{regenLabel}</span> : null}
    </div>
  );
}
