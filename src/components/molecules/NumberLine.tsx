// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import NumberBubble from '@/components/atoms/NumberBubble';

export type NumberLineProps = {
  readonly min: number;
  readonly max: number;
  readonly current?: number;
  readonly onSelect?: (number: number) => void;
  readonly missing?: number[];
  readonly disabled?: boolean;
};

export default function NumberLine({ min, max, current, onSelect, missing, disabled = false }: NumberLineProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex items-center gap-2 p-4" role="group" aria-label="Number line">
      {numbers.map((number) => {
        const isMissing = missing?.includes(number);
        const isCurrent = current === number;

        if (isMissing) {
          return (
            <div
              key={number}
              className="h-12 w-12 rounded-full border-2 border-dashed border-white/30"
              aria-label={`Missing number ${number}`}
            />
          );
        }

        return (
          <NumberBubble
            key={number}
            number={number}
            state={isCurrent ? 'selected' : 'idle'}
            onClick={onSelect}
            disabled={disabled}
            size="md"
          />
        );
      })}
    </div>
  );
}
