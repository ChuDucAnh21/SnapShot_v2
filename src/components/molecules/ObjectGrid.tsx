// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type ObjectGridItem = {
  readonly id: string;
  readonly icon: 'apple' | 'banana' | 'ball' | 'car' | 'dot';
  readonly count: number;
};

export type ObjectGridProps = {
  readonly items: ObjectGridItem[];
  readonly cols?: number;
  readonly gap?: number;
  readonly maxSize?: number;
};

function iconToEmoji(icon: ObjectGridItem['icon']): string {
  switch (icon) {
    case 'apple':
      return '🍎';
    case 'banana':
      return '🍌';
    case 'ball':
      return '⚽';
    case 'car':
      return '🚗';
    case 'dot':
      return '•';
    default:
      return '•';
  }
}

export default function ObjectGrid({ items, cols = 5, gap = 16, maxSize = 120 }: ObjectGridProps) {
  const style: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap,
  };

  return (
    <div className="rounded-[20px] bg-[#132129] p-4" style={{ boxShadow: '0 16px 0 rgba(0,0,0,0.35)' }}>
      <div className="grid" style={style}>
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-center rounded-[20px] bg-[#0f1a20] p-4">
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: item.count }).map((_, i) => (
                <span
                  key={`${item.id}-${i}`}
                  className="grid place-items-center text-4xl"
                  style={{ maxWidth: maxSize, maxHeight: maxSize }}
                >
                  {iconToEmoji(item.icon)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
