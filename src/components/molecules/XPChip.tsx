import Icon from '@atoms/Icon';
import * as React from 'react';

export default function XPChip({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[--radius-sm] bg-[--color-primary] px-2 py-1 text-xs font-semibold text-[--color-primary-foreground]">
      <Icon name="star" size={14} aria-hidden />
      {value}
      {' '}
      XP
    </span>
  );
}
