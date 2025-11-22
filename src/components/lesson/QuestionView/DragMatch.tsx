// Rules applied: brace-style:1tbs

'use client';

import type { QDragMatch } from './types';
import Image from 'next/image';

type DragMatchProps = {
  q: QDragMatch;
  pairs: Array<{ leftId: string; rightId: string }>;
  onChange: (pairs: Array<{ leftId: string; rightId: string }>) => void;
};

export function DragMatch({ q, pairs, onChange }: DragMatchProps) {
  const handleLeftClick = (leftId: string) => {
    const existingPair = pairs.find(p => p.leftId === leftId);
    if (existingPair) {
      // Remove existing pair
      onChange(pairs.filter(p => p.leftId !== leftId));
    }
  };

  const handleRightClick = (rightId: string) => {
    const existingPair = pairs.find(p => p.rightId === rightId);
    if (existingPair) {
      // Remove existing pair
      onChange(pairs.filter(p => p.rightId !== rightId));
    } else {
      // Find selected left item
      const selectedLeft = q.left.find(left => !pairs.some(p => p.leftId === left.id));
      if (selectedLeft) {
        onChange([...pairs, { leftId: selectedLeft.id, rightId }]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-4 text-xl font-semibold">{q.prompt}</h2>
        {q.assets?.image && <Image src={q.assets.image} alt="Question" className="mx-auto mb-4 h-auto max-w-full" />}
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8">
        {/* Left side */}
        <div className="space-y-4">
          <h3 className="text-center text-lg font-semibold">Số</h3>
          <div className="space-y-2">
            {q.left.map((item) => {
              const isSelected = pairs.some(p => p.leftId === item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleLeftClick(item.id)}
                  className={`w-full rounded-lg border-2 p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-center">
                    {item.imageUrl
                      ? (
                        <Image src={item.imageUrl} alt={item.text} className="mx-auto mb-2 h-16 w-16" />
                      )
                      : (
                        <div className="text-2xl font-bold">{item.text}</div>
                      )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-4">
          <h3 className="text-center text-lg font-semibold">Nhóm đồ vật</h3>
          <div className="space-y-2">
            {q.right.map((item) => {
              const isSelected = pairs.some(p => p.rightId === item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRightClick(item.id)}
                  className={`w-full rounded-lg border-2 p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="text-center">
                    {item.imageUrl
                      ? (
                        <Image src={item.imageUrl} alt={item.text} className="mx-auto mb-2 h-16 w-16" />
                      )
                      : (
                        <div className="text-2xl font-bold">{item.text}</div>
                      )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
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
