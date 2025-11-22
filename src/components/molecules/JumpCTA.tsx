'use client';

import { FastForward } from 'lucide-react';
import * as React from 'react';

export type JumpCTAProps = {
  readonly onClick: () => void;
  readonly label?: string;
  readonly helperText?: string;
};

export default function JumpCTA({
  onClick,
  label = 'Jump here?',
  helperText = 'Skip ahead with a quick review.',
}: JumpCTAProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-gray-800">
      <span className="rounded-[12px] border border-gray-200 bg-white px-4 py-2 text-sm font-extrabold tracking-[0.24em] text-purple-600 uppercase shadow-sm">
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex aspect-square size-[57px] items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-[28px] text-white shadow-lg transition-transform duration-150 hover:translate-y-[-4px] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none active:translate-y-[2px]"
        aria-label="Jump to this skill"
      >
        <FastForward className="size-7" />
      </button>
      <p className="max-w-[12rem] text-center text-xs font-medium text-gray-600">{helperText}</p>
    </div>
  );
}
