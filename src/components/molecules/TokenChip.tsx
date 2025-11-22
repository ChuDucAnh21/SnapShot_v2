// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type TokenChipProps = {
  readonly text: string;
  readonly selected?: boolean;
  readonly onClick?: () => void;
};

export default function TokenChip({ text, selected, onClick }: TokenChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-[16px] border px-4 text-[18px] font-extrabold uppercase',
        'h-14 border-[#2f3f49] bg-[#222e36] text-[#eaf2f5] transition will-change-transform',
        selected ? 'outline-2 outline-[rgba(255,255,255,0.08)] bg-[#30434d]' : 'hover:-translate-y-0.5',
      ].join(' ')}
      aria-pressed={selected}
    >
      {text}
    </button>
  );
}
