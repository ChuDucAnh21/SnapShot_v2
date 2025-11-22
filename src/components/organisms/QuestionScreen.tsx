// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { ClampedNumber } from '@/components/atoms/ProgressTrack';
import ProgressTrack from '@atoms/ProgressTrack';
import AnswerDropZone from '@molecules/AnswerDropZone';
import TokenChip from '@molecules/TokenChip';
import * as React from 'react';

export type QuestionScreenProps = {
  readonly progress: number; // 0..1
  readonly hearts: number;
  readonly promptTitle: string;
  readonly bankTokens: string[];
  readonly onSkip?: () => void;
  readonly onCheck?: (answerTokens: string[]) => void;
};

export default function QuestionScreen({ hearts, promptTitle, bankTokens, onSkip, onCheck }: QuestionScreenProps) {
  const [selected, setSelected] = React.useState<string[]>([]);

  function toggleToken(token: string) {
    setSelected(prev => (prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]));
  }

  const canCheck = selected.length > 0;

  return (
    <div className="grid min-h-[70dvh] grid-rows-[auto_1fr_auto] gap-4 rounded-[20px] bg-[#132129] p-6 text-[#eaf2f5] shadow-[0_16px_0_rgba(0,0,0,0.35)]">
      {/* TopBar */}
      <div className="flex items-center justify-between gap-6">
        <button
          type="button"
          aria-label="Exit lesson"
          className="grid h-12 w-12 place-items-center rounded-[12px] bg-[#0c171d] text-xl text-[#3c4a52] hover:text-[#637682]"
        >
          ✖
        </button>
        <div className="w-full max-w-[1020px]">
          <ProgressTrack value={0.3 as ClampedNumber} ariaLabel="Lesson progress" />
        </div>
        <div className="grid place-items-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#112028] shadow-[0_10px_0_rgba(0,0,0,0.3)]">
            <span className="text-xl">❤️</span>
          </div>
          <div className="mt-1 text-sm font-semibold">{hearts}</div>
        </div>
      </div>

      {/* Content */}
      <div className="grid content-start gap-6 px-6">
        <div className="space-y-1">
          <div className="text-sm font-extrabold tracking-[0.24em] text-[#cfaaff] uppercase">NEW WORD</div>
          <h2 className="text-3xl leading-tight font-black">{promptTitle}</h2>
        </div>

        <AnswerDropZone tokens={selected} />

        <div className="flex flex-wrap gap-4">
          {bankTokens.map(token => (
            <TokenChip
              key={token}
              text={token}
              selected={selected.includes(token)}
              onClick={() => toggleToken(token)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] pt-4">
        <button
          type="button"
          className="h-18 w-44 rounded-full border border-[rgba(255,255,255,0.08)] bg-transparent text-sm font-extrabold tracking-wide uppercase"
          onClick={() => onSkip?.()}
        >
          Skip
        </button>

        <button
          type="button"
          disabled={!canCheck}
          className="h-18 w-56 rounded-[16px] bg-[#7fe318] text-sm font-black tracking-wide text-[#0f1a20] uppercase disabled:opacity-50"
          onClick={() => canCheck && onCheck?.(selected)}
        >
          Check
        </button>
      </div>
    </div>
  );
}
