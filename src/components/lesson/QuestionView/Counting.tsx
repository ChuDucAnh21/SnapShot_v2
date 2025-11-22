// Rules applied: brace-style:1tbs

'use client';

import type { QCounting } from './types';
import Image from 'next/image';

type CountingProps = {
  q: QCounting;
  value?: number;
  onChange: (value: number) => void;
};

export function Counting({ q, value, onChange }: CountingProps) {
  const numbers = Array.from({ length: 21 }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-4 text-xl font-semibold">{q.prompt}</h2>
        {q.assets?.image && <Image src={q.assets.image} alt="Question" className="mx-auto mb-4 h-auto max-w-full" />}
      </div>

      {q.showKeypad
        ? (
          <div className="mx-auto grid max-w-md grid-cols-5 gap-3">
            {numbers.map(num => (
              <button
                type="button"
                key={num}
                onClick={() => onChange(num)}
                className={`rounded-lg border-2 p-3 transition-all duration-200 ${
                  value === num
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-xl font-bold">{num}</div>
              </button>
            ))}
          </div>
        )
        : (
          <div className="text-center">
            <div className="mb-4 text-4xl font-bold text-blue-600">{value !== undefined ? value : '?'}</div>
            <div className="mx-auto grid max-w-xs grid-cols-5 gap-2">
              {numbers.slice(0, 10).map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => onChange(num)}
                  className={`rounded border p-2 transition-all duration-200 ${
                    value === num
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
