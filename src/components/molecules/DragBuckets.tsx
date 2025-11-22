// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type DragItem = { id: string; label: string };
export type Bucket = { id: string; label: string };

export type DragBucketsProps = {
  readonly items: DragItem[];
  readonly buckets: Bucket[];
  readonly onDrop?: (itemId: string, bucketId: string) => void;
};

export default function DragBuckets({ items, buckets, onDrop }: DragBucketsProps) {
  const [placed, setPlaced] = React.useState<Record<string, string | undefined>>({});

  function handleDrop(e: React.DragEvent<HTMLDivElement>, bucketId: string) {
    const itemId = e.dataTransfer.getData('text/plain');
    if (!itemId) {
      return;
    }
    setPlaced(prev => ({ ...prev, [itemId]: bucketId }));
    onDrop?.(itemId, bucketId);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[#b9c7cf]">Groups</h4>
        <div className="flex flex-wrap gap-3">
          {items.map(it => (
            <div
              key={it.id}
              draggable
              onDragStart={e => e.dataTransfer.setData('text/plain', it.id)}
              className="rounded-[16px] border border-[#2e3f48] bg-[#21313a] px-4 py-2 text-[18px] font-extrabold text-[#f5fafd]"
            >
              {it.label}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-[#b9c7cf]">Buckets</h4>
        <div className="grid grid-cols-2 gap-4">
          {buckets.map(b => (
            <div
              key={b.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, b.id)}
              className="min-h-28 rounded-[20px] border border-[#2e3f48] bg-[#132129] p-4"
            >
              <div className="text-center text-xl font-black text-[#f5fafd]">{b.label}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(placed)
                  .filter(([, bid]) => bid === b.id)
                  .map(([itemId]) => {
                    const item = items.find(i => i.id === itemId);
                    if (!item) {
                      return null;
                    }
                    return (
                      <span
                        key={itemId}
                        className="rounded-[12px] bg-[#30434d] px-3 py-1 text-sm font-semibold text-[#eaf2f5]"
                      >
                        {item.label}
                      </span>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
