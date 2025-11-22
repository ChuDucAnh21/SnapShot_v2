// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { CardVM } from './types';
import * as React from 'react';

type CardProps = {
  readonly vm: CardVM;
  readonly onTap: () => void;
  readonly disabled?: boolean;
};

export function Card({ vm, onTap, disabled = false }: CardProps) {
  const [isFlipping, setIsFlipping] = React.useState(false);

  // Random rotation for jitter effect
  const rotation = React.useMemo(() => {
    const seed = vm.index * 7 + 13; // deterministic based on index
    return (seed % 9) - 4; // -4 to +4 degrees
  }, [vm.index]);

  const handleClick = React.useCallback(() => {
    if (disabled || vm.state !== 'faceDown') {
      return;
    }

    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 300);
    onTap();
  }, [disabled, vm.state, onTap]);

  const getCardColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'border-green-500 text-green-600';
      case 'blue':
        return 'border-blue-500 text-blue-600';
      case 'red':
        return 'border-red-500 text-red-600';
      default:
        return 'border-gray-500 text-gray-600';
    }
  };

  return (
    <div className="relative aspect-square" style={{ transform: `rotate(${rotation}deg)` }}>
      <button
        type="button"
        className={`
          relative h-full w-full transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          ${vm.state === 'faceDown' ? 'hover:scale-105' : ''}
          ${disabled ? 'pointer-events-none' : ''}
          focus:ring-4 focus:ring-blue-300 focus:outline-none
        `}
        onClick={handleClick}
        disabled={disabled}
        aria-label={
          vm.state === 'faceDown'
            ? `Card vị trí ${Math.floor(vm.index / 4) + 1}c${(vm.index % 4) + 1}, đang úp mặt`
            : `Card số ${vm.value}`
        }
        aria-pressed={vm.state === 'faceUp'}
      >
        {/* Card Container with 3D flip effect */}
        <div
          className={`
            relative h-full w-full transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${vm.state === 'faceUp' || vm.state === 'matched' ? 'rotate-y-180' : ''}
            ${isFlipping ? 'scale-105' : ''}
          `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Back Face (Yellow) */}
          <div
            className={`
              absolute inset-0 h-full w-full rounded-2xl border-4
              border-[#E6C042] bg-[#F7D54A] shadow-lg
              ${vm.state === 'faceDown' ? 'block' : 'hidden'}
            `}
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 8px,
                  rgba(0,0,0,0.1) 8px,
                  rgba(0,0,0,0.1) 16px
                )
              `,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-[#E6C042] shadow-inner" />
            </div>
          </div>

          {/* Front Face (Number) */}
          <div
            className={`
              absolute inset-0 h-full w-full rounded-2xl border-8
              border-dotted bg-[#F4F6F7] shadow-lg
              ${getCardColor(vm.color || 'green')}
              ${vm.state === 'faceUp' || vm.state === 'matched' ? 'block' : 'hidden'}
              ${vm.state === 'matched' ? 'opacity-80' : ''}
            `}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold drop-shadow-sm">{vm.value}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
