// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

type BlackboardFrameProps = {
  readonly children: React.ReactNode;
};

export function BlackboardFrame({ children }: BlackboardFrameProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Wood Frame */}
      <div className="rounded-3xl bg-[#D7A86E] p-4 shadow-lg">
        {/* Blackboard */}
        <div className="relative rounded-3xl bg-[#0E7269] p-8 shadow-[inset_0_6px_0_rgba(0,0,0,0.08)]">
          {children}

          {/* Chalk Shelf */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 transform">
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className="h-8 w-2 rounded-full bg-[#F4F6F7] shadow-sm"
                  style={{
                    transform: `rotate(${(Math.random() - 0.5) * 10}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
