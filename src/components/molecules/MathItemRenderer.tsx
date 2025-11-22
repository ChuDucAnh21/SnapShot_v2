// Rules applied: brace-style:1tbs, react/prefer-destructuring-assignment:off

'use client';

import type { Choice, GeneratedItem } from '@/types/math-core';
import Image from 'next/image';
import { useState } from 'react';
import NumberBubble from '@/components/atoms/NumberBubble';
import ChoiceCard from '@/components/molecules/ChoiceCard';
import DragDropContainer from '@/components/molecules/DragDropContainer';
import NumberLine from '@/components/molecules/NumberLine';
import TenFrame from '@/components/molecules/TenFrame';

type MathItemRendererProps = {
  item: GeneratedItem;
  onAnswer: (answer: unknown) => void;
  disabled?: boolean;
};

export function MathItemRenderer({ item, onAnswer, disabled = false }: MathItemRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);
  const [showFeedback] = useState(false);

  const handleChoiceSelect = (choice: Choice) => {
    if (disabled) {
      return;
    }

    setSelectedAnswer(choice.value);

    if (item.ui.autoSubmit) {
      onAnswer(choice.value);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
    }
  };

  const renderChoices = () => {
    if (!item.choices) {
      return null;
    }

    return (
      <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
        {item.choices.map(choice => (
          <ChoiceCard
            key={choice.id}
            text={choice.label ?? ''}
            onClick={() => handleChoiceSelect(choice)}
            selected={selectedAnswer === choice.value}
            disabled={disabled}
          />
        ))}
      </div>
    );
  };

  const renderByType = () => {
    switch (item.type) {
      case 'choose_one':
        return renderChoices();

      case 'tap_to_count': {
        const count = (item.meta?.objectCount as number) || 5;
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: count }, (_, i) => (
                  <NumberBubble
                    key={i}
                    number={i + 1}
                    onClick={() => setSelectedAnswer(i + 1)}
                    state="idle"
                    size="md"
                  />
                ))}
              </div>
            </div>
            {!item.ui.autoSubmit && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || selectedAnswer === null}
                className="mx-auto block"
              >
                Kiểm tra
              </button>
            )}
          </div>
        );
      }

      case 'compare_numbers':
        return renderChoices();

      case 'single_digit_add': {
        const a = (item.meta?.a as number) || 3;
        const b = (item.meta?.b as number) || 2;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 text-2xl">
              <TenFrame count={a} />
              <span>+</span>
              <TenFrame count={b} />
              <span>=</span>
              <span>?</span>
            </div>
            {renderChoices()}
          </div>
        );
      }

      case 'complete_number_line': {
        const missing = (item.meta?.missingNumber as number) || 5;
        return (
          <div className="space-y-4">
            <NumberLine min={1} max={10} missing={[missing]} onSelect={(num: number) => setSelectedAnswer(num)} />
            {!item.ui.autoSubmit && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || selectedAnswer === null}
                className="mx-auto block"
              >
                Kiểm tra
              </button>
            )}
          </div>
        );
      }

      case 'drag_to_count':
        return (
          <DragDropContainer
          // targetCount={item.meta?.targetCount as number || 5}
          // onDrop={(count: number) => {
          //   setSelectedAnswer(count);
          //   if (item.ui.autoSubmit) {
          //     onAnswer(count);
          //   }
          // }}
          // disabled={disabled}
          >
            A
          </DragDropContainer>
        );

      case 'ten_frame_fill': {
        const targetCount = (item.meta?.targetCount as number) || 7;
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="mb-4 text-lg">
                Điền vào khung 10 để tạo thành
                {targetCount}
              </p>
              <TenFrame count={targetCount} onTap={(count: number) => setSelectedAnswer(count)} />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || selectedAnswer === null}
                className="mx-auto block"
              >
                Kiểm tra
              </button>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-center text-gray-500">
            <p>
              Loại bài tập này chưa được hỗ trợ:
              {item.type}
            </p>
            {renderChoices()}
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-xl font-semibold">{item.prompt}</h2>
        {item.assets?.images && (
          <div className="mb-4">
            {item.assets.images.map((imageUrl, index) => (
              <Image
                key={imageUrl}
                src={imageUrl}
                alt={`Exercise ${index + 1}`}
                className="mx-auto h-auto max-w-full"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex min-h-[200px] items-center justify-center">{renderByType()}</div>

      {showFeedback && (
        <div className="mt-6 rounded-lg bg-gray-100 p-4 text-center">
          <p className="text-sm text-gray-600">
            Độ khó:
            {' '}
            {Math.round(item.difficulty * 100)}
            % | Kỹ năng:
            {' '}
            {item.skillId}
          </p>
        </div>
      )}
    </div>
  );
}
