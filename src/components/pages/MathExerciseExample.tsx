// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import Confetti from '@/components/atoms/Confetti';
import MathIcon from '@/components/atoms/MathIcon';
import NumberBubble from '@/components/atoms/NumberBubble';
import ShakeAnimation from '@/components/atoms/ShakeAnimation';
import ChoiceCard from '@/components/molecules/ChoiceCard';
import NumberLine from '@/components/molecules/NumberLine';
import TenFrame from '@/components/molecules/TenFrame';

export default function MathExerciseExample() {
  const [count, setCount] = React.useState(0);
  const [selectedNumber, setSelectedNumber] = React.useState<number | null>(null);
  const [correct, setCorrect] = React.useState(false);
  const [incorrect, setIncorrect] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleAnswer = (answer: number) => {
    setSelectedNumber(answer);
    if (answer === 5) {
      setCorrect(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setIncorrect(true);
      setTimeout(() => setIncorrect(false), 1000);
    }
  };

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
  };

  return (
    <div className="min-h-screen space-y-8 bg-slate-900 p-8">
      <h1 className="text-center text-3xl font-bold text-white">Math Exercise Examples</h1>

      {/* Counting Exercise */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-6">
        <h2 className="text-xl text-white">1. Counting Exercise - Tap to Count</h2>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <MathIcon
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              value={1}
              type="apple"
              size="lg"
              animated={i < count}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {[3, 4, 5, 6].map(number => (
            <ChoiceCard
              key={number}
              text={number.toString()}
              selected={selectedNumber === number}
              correct={number === 5 && correct}
              onClick={() => handleAnswer(number)}
            />
          ))}
        </div>

        <Confetti trigger={showConfetti} />
      </div>

      {/* Number Line Exercise */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-6">
        <h2 className="text-xl text-white">2. Number Line - Fill Missing Numbers</h2>

        <ShakeAnimation trigger={incorrect}>
          <NumberLine
            min={1}
            max={10}
            current={selectedNumber ?? undefined}
            missing={[3, 7]}
            onSelect={setSelectedNumber}
          />
        </ShakeAnimation>
      </div>

      {/* Ten Frame Exercise */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-6">
        <h2 className="text-xl text-white">3. Ten Frame Counting</h2>

        <TenFrame count={count} onTap={handleCountChange} showNumbers={true} />

        <p className="text-white">
          Count:
          {count}
        </p>
      </div>

      {/* Number Bubble Exercise */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-6">
        <h2 className="text-xl text-white">4. Number Bubble Selection</h2>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(number => (
            <NumberBubble
              key={number}
              number={number}
              state={selectedNumber === number ? 'selected' : 'idle'}
              onClick={setSelectedNumber}
              size="lg"
            />
          ))}
        </div>
      </div>

      {/* Exercise Types from Meeting Notes */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-6">
        <h2 className="text-xl text-white">5. Exercise Types (from Meeting Notes)</h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h3 className="mb-2 font-semibold text-white">Basic Types:</h3>
            <ul className="space-y-1">
              <li>• Choose one</li>
              <li>• True/false</li>
              <li>• Type number</li>
              <li>• Tap to count</li>
              <li>• Drag to count</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-white">Advanced Types:</h3>
            <ul className="space-y-1">
              <li>• Compare numbers</li>
              <li>• Complete number line</li>
              <li>• Fill missing number</li>
              <li>• Ten frame fill</li>
              <li>• Single digit add/subtract</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
