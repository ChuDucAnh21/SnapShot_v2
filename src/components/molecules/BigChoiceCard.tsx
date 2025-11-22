// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type BigChoiceCardProps = {
  readonly label: string | number;
  readonly selected?: boolean;
  readonly onClick?: () => void;
};

export default function BigChoiceCard({ label, selected, onClick }: BigChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex h-[120px] w-[160px] items-center justify-center rounded-[28px] text-[28px] font-black',
        selected
          ? 'outline outline-2 outline-[rgba(255,255,255,0.08)] bg-[#30434d]'
          : 'bg-[#21313a] hover:-translate-y-0.5',
        'border border-[#2e3f48] text-[#f5fafd] transition will-change-transform',
      ].join(' ')}
      aria-pressed={selected}
    >
      {String(label)}
    </button>
  );
}
