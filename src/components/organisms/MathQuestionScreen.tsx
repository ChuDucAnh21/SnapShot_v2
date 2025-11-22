/* eslint-disable react/no-unstable-default-props */

// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { Bucket, DragItem } from '@molecules/DragBuckets';
import type { ObjectGridItem } from '@molecules/ObjectGrid';
import BigChoiceCard from '@molecules/BigChoiceCard';
import DragBuckets from '@molecules/DragBuckets';
import NumberLine from '@molecules/NumberLine';
import ObjectGrid from '@molecules/ObjectGrid';
import TracingPad from '@molecules/TracingPad';
import * as React from 'react';

export type MathQuestionKind = 'tap_count' | 'choice_big' | 'number_line_pick' | 'drag_to_bucket' | 'tracing';

export type MathQuestionScreenProps = {
  readonly progress: number; // 0..1
  readonly lives?: number; // stars/hearts
  readonly title: string;
  readonly kind: MathQuestionKind;
  readonly grid?: { items: ObjectGridItem[] };
  readonly numberLine?: { min: number; max: number };
  readonly buckets?: { items: DragItem[]; buckets: Bucket[] };
  readonly tracing?: { glyph: string; thresholdPct?: number };
  readonly choices?: Array<number | string>;
  readonly answer?: number | string;
  readonly onCheck?: (isCorrect: boolean) => void;
};

export default function MathQuestionScreen(props: MathQuestionScreenProps) {
  const { title, kind, grid, numberLine, buckets, tracing, choices = [], answer, onCheck } = props;
  const [selected, setSelected] = React.useState<number | string | null>(null);
  const [linePick, setLinePick] = React.useState<number | null>(null);
  const [tracePct, setTracePct] = React.useState(0);

  function handleCheck() {
    let isCorrect = false;
    if (kind === 'number_line_pick') {
      isCorrect = answer != null && String(linePick) === String(answer);
    } else if (kind === 'tracing') {
      const threshold = tracing?.thresholdPct ?? 0.7;
      isCorrect = tracePct >= threshold;
    } else if (kind === 'drag_to_bucket') {
      // Leave scoring to parent or future logic; default to true for demo
      isCorrect = true;
    } else {
      isCorrect = selected != null && answer != null && String(selected) === String(answer);
    }
    onCheck?.(isCorrect);
  }

  return (
    <div className="grid min-h-[70dvh] grid-rows-[auto_1fr_auto] gap-6 rounded-[20px] bg-[#132129] p-6 text-[#f5fafd] shadow-[0_16px_0_rgba(0,0,0,0.35)]">
      {/* Content */}
      <div className="grid content-start gap-6 px-6">
        <div className="space-y-2">
          <div className="text-sm font-extrabold tracking-[0.24em] text-[#ffd166] uppercase">LET'S COUNT</div>
          <h2 className="text-[38px] leading-tight font-black">{title}</h2>
        </div>

        {kind === 'tap_count' && grid ? <ObjectGrid items={grid.items} cols={5} gap={16} maxSize={120} /> : null}

        {kind === 'number_line_pick' && numberLine
          ? (
            <NumberLine
              min={numberLine.min}
              max={numberLine.max}
              current={linePick ?? undefined}
              onSelect={setLinePick}
            />
          )
          : null}

        {kind === 'drag_to_bucket' && buckets ? <DragBuckets items={buckets.items} buckets={buckets.buckets} /> : null}

        {kind === 'tracing' && tracing ? <TracingPad targetGlyph={tracing.glyph} onProgress={setTracePct} /> : null}

        {/* Answers */}
        {(kind === 'tap_count' || kind === 'choice_big') && (
          <div className="mt-2 flex flex-wrap gap-4">
            {choices.map(c => (
              <BigChoiceCard key={String(c)} label={c} selected={selected === c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-end border-t border-[rgba(255,255,255,0.08)] pt-4">
        <button
          type="button"
          disabled={
            kind === 'tap_count' || kind === 'choice_big'
              ? selected == null
              : kind === 'number_line_pick'
                ? linePick == null
                : kind === 'tracing'
                  ? tracePct < (tracing?.thresholdPct ?? 0.7)
                  : false
          }
          onClick={handleCheck}
          className="h-20 w-60 rounded-[28px] bg-[#7fe318] text-[18px] font-black tracking-wide text-[#0f1a20] uppercase disabled:opacity-50"
        >
          Check
        </button>
      </div>
    </div>
  );
}
