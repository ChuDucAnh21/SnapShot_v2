// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type TenFrameProps = {
  readonly count: number;
  readonly max?: number;
  readonly onTap?: (index: number) => void;
  readonly disabled?: boolean;
  readonly showNumbers?: boolean;
};

export default function TenFrame({ count, max = 10, onTap, disabled = false, showNumbers = false }: TenFrameProps) {
  const cells = Array.from({ length: max }, (_, i) => i);

  return (
    <div className="grid grid-cols-5 gap-2 p-4" role="group" aria-label="Ten frame">
      {cells.map((index) => {
        const isFilled = index < count;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onTap?.(index)}
            disabled={disabled}
            className={cn(
              'h-12 w-12 rounded-lg border-2 transition-all',
              isFilled ? 'bg-blue-500 border-blue-400' : 'bg-white/20 border-white/30',
              !disabled && 'hover:bg-white/30',
              disabled && 'cursor-not-allowed',
            )}
            aria-label={`Cell ${index + 1}, ${isFilled ? 'filled' : 'empty'}`}
          >
            {showNumbers && <span className="text-xs font-bold text-white">{index + 1}</span>}
          </button>
        );
      })}
    </div>
  );
}
