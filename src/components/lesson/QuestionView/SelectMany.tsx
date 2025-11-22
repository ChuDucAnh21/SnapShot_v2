// Rules applied: brace-style:1tbs

'use client';

import type { QSelectMany } from './types';
import Image from 'next/image';

type SelectManyProps = {
  q: QSelectMany;
  selected: string[];
  onToggle: (id: string) => void;
};

export function SelectMany({ q, selected, onToggle }: SelectManyProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-4 text-xl font-semibold">{q.prompt}</h2>
        {q.assets?.image && <Image src={q.assets.image} alt="Question" className="mx-auto mb-4 h-auto max-w-full" />}
      </div>

      <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
        {q.choices.map(choice => (
          <button
            type="button"
            key={choice.id}
            onClick={() => onToggle(choice.id)}
            className={`rounded-lg border-2 p-4 transition-all duration-200 ${
              selected.includes(choice.id)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="text-center">
              {choice.imageUrl
                ? (
                  <Image src={choice.imageUrl} alt={choice.text} className="mx-auto mb-2 h-16 w-16" />
                )
                : (
                  <div className="mb-2 text-2xl font-bold">{choice.text}</div>
                )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            /* Submit logic handled by parent */
          }}
          className="rounded-lg bg-green-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-600"
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
}
