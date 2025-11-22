import Icon from '@atoms/Icon';
import * as React from 'react';

export default function StreakFlame({ days }: { days: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[--radius-sm] bg-white/10 px-2 py-1 text-xs font-semibold text-[--foreground]">
      <Icon name="flame" size={14} aria-hidden />
      {days}
      {' '}
      day
      {days === 1 ? '' : 's'}
    </span>
  );
}
