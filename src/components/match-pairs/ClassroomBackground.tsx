// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export function ClassroomBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Clock */}
      <div className="absolute top-8 left-8 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
        <div className="relative h-12 w-12 rounded-full border-2 border-gray-300">
          <div className="absolute top-1 left-1/2 h-4 w-0.5 origin-bottom -translate-x-1/2 transform bg-gray-600" />
          <div className="absolute top-1 left-1/2 h-2 w-0.5 origin-bottom -translate-x-1/2 rotate-45 transform bg-gray-600" />
        </div>
      </div>

      {/* Bookshelf */}
      <div className="absolute top-8 right-8 h-24 w-20 rounded bg-amber-600 shadow-md">
        <div className="flex flex-col gap-1 p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="h-4 rounded-sm bg-amber-700"
              style={{ width: `${60 + Math.random() * 20}%` }}
            />
          ))}
        </div>
      </div>

      {/* Plant */}
      <div className="absolute right-12 bottom-8 h-16 w-8 rounded-full bg-green-600 shadow-md">
        <div className="absolute -top-2 left-1/2 h-8 w-12 -translate-x-1/2 transform rounded-full bg-green-500" />
      </div>

      {/* Backpack */}
      <div className="absolute bottom-8 left-12 h-16 w-12 rounded bg-blue-600 shadow-md">
        <div className="absolute top-2 left-1/2 h-2 w-8 -translate-x-1/2 transform rounded bg-blue-700" />
      </div>

      {/* Geometric shapes */}
      <div className="absolute top-1/3 right-16 h-6 w-6 rounded-full bg-red-500 shadow-sm" />
      <div className="absolute top-1/2 right-20 h-8 w-4 bg-yellow-500 shadow-sm" />
      <div className="absolute bottom-1/3 left-16 h-8 w-8 rotate-45 transform bg-purple-500 shadow-sm" />
    </div>
  );
}
