// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type AnswerDropZoneProps = {
  readonly tokens: string[];
};

export default function AnswerDropZone({ tokens }: AnswerDropZoneProps) {
  return (
    <div className="min-h-16 rounded-[16px] border-t border-[rgba(255,255,255,0.08)] py-4">
      <div className="flex flex-wrap gap-x-3 gap-y-3 leading-[2]">
        {tokens.length === 0
          ? (
            <span className="text-sm text-[#8fa2ae]">Tap words to form your answer…</span>
          )
          : (
            tokens.map(t => (
              <span key={`${t}`} className="rounded-[12px] bg-[#30434d] px-3 py-1 text-sm font-semibold text-[#eaf2f5]">
                {t}
              </span>
            ))
          )}
      </div>
    </div>
  );
}
