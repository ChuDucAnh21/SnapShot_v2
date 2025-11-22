// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

type HUDProps = {
  readonly onClose?: () => void;
};

export function HUD({ onClose }: HUDProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Close Button */}
      <button
        type="button"
        className="pointer-events-auto absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-colors hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 focus:outline-none"
        onClick={onClose}
        aria-label="Đóng trò chơi"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress Dots (optional) */}
      <div className="pointer-events-none absolute top-4 right-4 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="h-3 w-3 rounded-full bg-white/30"
          />
        ))}
      </div>
    </div>
  );
}
