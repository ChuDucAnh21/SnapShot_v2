// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';

export type TracingPadProps = {
  readonly targetGlyph: string;
  readonly onProgress?: (pct: number) => void;
};

export default function TracingPad({ targetGlyph, onProgress }: TracingPadProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = React.useState(false);
  const [strokes, setStrokes] = React.useState<number>(0);

  React.useEffect(() => {
    const pct = Math.min(1, strokes / 50);
    onProgress?.(pct);
  }, [strokes, onProgress]);

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    setDrawing(true);
    const c = canvasRef.current;
    if (!c) {
      return;
    }
    const ctx = c.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#7FE318';
    ctx.shadowColor = 'rgba(127,227,24,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const rect = c.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) {
      return;
    }
    const c = canvasRef.current;
    if (!c) {
      return;
    }
    const ctx = c.getContext('2d');
    if (!ctx) {
      return;
    }
    const rect = c.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setStrokes(s => s + 1);
  }

  function end() {
    setDrawing(false);
  }

  return (
    <div
      className="grid grid-cols-[160px_1fr] items-center gap-4 rounded-[20px] bg-[#0f1a20] p-4 text-[#f5fafd]"
      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
    >
      <div className="grid h-40 w-40 place-items-center rounded-[20px] bg-[#132129] text-6xl shadow-[0_10px_0_rgba(0,0,0,0.35)]">
        {targetGlyph}
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="h-40 w-full touch-none rounded-[20px] bg-[#132129]"
      />
    </div>
  );
}
