# Math Atomic Components Specification

## Overview

This document outlines the atomic design components needed for Iruka Kids Math Learning System (ages 4-8), following atomic design principles and optimized for interactive math exercises.

## A) Classification & Rationale

| Component Name     | Level    | Responsibility                           | Key Props                           | Why This Level?                 |
| ------------------ | -------- | ---------------------------------------- | ----------------------------------- | ------------------------------- |
| `MathIcon`         | Atom     | Visual representation of numbers/objects | `value`, `type`, `size`             | Single responsibility, reusable |
| `NumberBubble`     | Atom     | Interactive number display               | `number`, `state`, `onClick`        | Basic interactive element       |
| `DragHandle`       | Atom     | Draggable interaction point              | `disabled`, `onDrag`                | Single interaction concern      |
| `DropZone`         | Atom     | Target area for drag operations          | `accepts`, `filled`, `onDrop`       | Single drop behavior            |
| `CountButton`      | Atom     | Tap-to-count interaction                 | `count`, `max`, `onCount`           | Simple counting logic           |
| `ChoiceCard`       | Molecule | Multiple choice option                   | `text`, `selected`, `correct`       | Combines text + state           |
| `NumberLine`       | Molecule | Visual number sequence                   | `min`, `max`, `current`, `onSelect` | Multiple atoms working together |
| `TenFrame`         | Molecule | Base-10 counting aid                     | `count`, `max`, `onTap`             | Complex counting visualization  |
| `DragBucket`       | Molecule | Drag-and-drop container                  | `items`, `capacity`, `onDrop`       | Combines multiple drop zones    |
| `MathQuestion`     | Organism | Complete question interface              | `question`, `type`, `onAnswer`      | Complex interaction system      |
| `ExerciseViewport` | Template | Question layout scaffold                 | `children`, `progress`              | Layout structure                |

## B) Props & Contracts

### Atoms

#### MathIcon

```typescript
type MathIconProps = {
  value: number;
  type: 'apple' | 'star' | 'circle' | 'square' | 'triangle';
  size: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
};
```

#### NumberBubble

```typescript
type NumberBubbleProps = {
  number: number;
  state: 'idle' | 'selected' | 'correct' | 'incorrect';
  onClick?: (number: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};
```

#### DragHandle

```typescript
type DragHandleProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onDragStart?: (data: any) => void;
  onDragEnd?: (data: any) => void;
  dragData?: any;
};
```

#### DropZone

```typescript
type DropZoneProps = {
  accepts: string[];
  filled?: boolean;
  onDrop?: (data: any) => void;
  children?: React.ReactNode;
  className?: string;
};
```

#### CountButton

```typescript
type CountButtonProps = {
  count: number;
  max?: number;
  onCount: (count: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};
```

### Molecules

#### ChoiceCard

```typescript
type ChoiceCardProps = {
  text: string;
  selected?: boolean;
  correct?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'large';
};
```

#### NumberLine

```typescript
type NumberLineProps = {
  min: number;
  max: number;
  current?: number;
  onSelect?: (number: number) => void;
  missing?: number[];
  disabled?: boolean;
};
```

#### TenFrame

```typescript
type TenFrameProps = {
  count: number;
  max?: number;
  onTap?: (index: number) => void;
  disabled?: boolean;
  showNumbers?: boolean;
};
```

#### DragBucket

```typescript
type DragBucketProps = {
  items: Array<{ id: string; label: string; value: any }>;
  capacity: number;
  onDrop: (item: any, index: number) => void;
  onRemove?: (index: number) => void;
  disabled?: boolean;
};
```

### Organisms

#### MathQuestion

```typescript
type MathQuestionProps = {
  question: {
    id: string;
    type: 'select_one' | 'counting' | 'drag_match' | 'number_line';
    prompt: string;
    data: any;
  };
  onAnswer: (answer: any) => void;
  disabled?: boolean;
  showHint?: boolean;
};
```

## C) Implementation Steps

### 1) Skeleton Components

Create basic structure without styling or interactions.

### 2) A11y & States

- Add ARIA labels and roles
- Implement keyboard navigation
- Add focus management
- Handle disabled states

### 3) Styling (Tailwind)

- Use consistent color tokens
- Implement size variants
- Add hover/focus states
- No outer spacing in atoms

### 4) Animation Integration

- Use Framer Motion for complex animations
- CSS transitions for simple state changes
- Confetti for correct answers
- Gentle shake for incorrect answers

### 5) Usage Examples

Show realistic composition patterns.

## D) Code Implementation

### MathIcon Atom

```typescript
// src/components/atoms/MathIcon.tsx
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type MathIconProps = {
  value: number;
  type: 'apple' | 'star' | 'circle' | 'square' | 'triangle';
  size: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const typeClasses = {
  apple: 'text-red-500',
  star: 'text-yellow-500',
  circle: 'text-blue-500',
  square: 'text-green-500',
  triangle: 'text-purple-500',
};

export default function MathIcon({
  value,
  type,
  size,
  animated = false,
  className,
}: MathIconProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-white/10',
        sizeClasses[size],
        typeClasses[type],
        animated && 'animate-pulse',
        className,
      )}
      role="img"
      aria-label={`${value} ${type}`}
    >
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}
```

### NumberBubble Atom

```typescript
// src/components/atoms/NumberBubble.tsx
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type NumberBubbleProps = {
  number: number;
  state: 'idle' | 'selected' | 'correct' | 'incorrect';
  onClick?: (number: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
};

const stateClasses = {
  idle: 'bg-white/20 text-white hover:bg-white/30',
  selected: 'bg-blue-500 text-white ring-2 ring-blue-300',
  correct: 'bg-green-500 text-white',
  incorrect: 'bg-red-500 text-white animate-pulse',
};

export default function NumberBubble({
  number,
  state,
  onClick,
  disabled = false,
  size = 'md',
}: NumberBubbleProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(number)}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center rounded-full font-bold transition-all',
        sizeClasses[size],
        stateClasses[state],
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      aria-label={`Number ${number}`}
    >
      {number}
    </button>
  );
}
```

### ChoiceCard Molecule

```typescript
// src/components/molecules/ChoiceCard.tsx
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type ChoiceCardProps = {
  text: string;
  selected?: boolean;
  correct?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'large';
};

const variantClasses = {
  default: 'h-12 px-4 text-base',
  large: 'h-16 px-6 text-lg',
};

export default function ChoiceCard({
  text,
  selected = false,
  correct = false,
  onClick,
  disabled = false,
  variant = 'default',
}: ChoiceCardProps) {
  const getStateClasses = () => {
    if (correct) return 'bg-green-500 text-white border-green-400';
    if (selected) return 'bg-blue-500 text-white border-blue-400';
    return 'bg-white/20 text-white border-white/30 hover:bg-white/30';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center rounded-lg border-2 font-medium transition-all',
        variantClasses[variant],
        getStateClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      aria-label={`Option: ${text}`}
    >
      {text}
    </button>
  );
}
```

### NumberLine Molecule

```typescript
// src/components/molecules/NumberLine.tsx
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import NumberBubble from '@/components/atoms/NumberBubble';

export type NumberLineProps = {
  min: number;
  max: number;
  current?: number;
  onSelect?: (number: number) => void;
  missing?: number[];
  disabled?: boolean;
};

export default function NumberLine({
  min,
  max,
  current,
  onSelect,
  missing = [],
  disabled = false,
}: NumberLineProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex items-center gap-2 p-4" role="group" aria-label="Number line">
      {numbers.map((number) => {
        const isMissing = missing.includes(number);
        const isCurrent = current === number;

        if (isMissing) {
          return (
            <div
              key={number}
              className="h-12 w-12 rounded-full border-2 border-dashed border-white/30"
              aria-label={`Missing number ${number}`}
            />
          );
        }

        return (
          <NumberBubble
            key={number}
            number={number}
            state={isCurrent ? 'selected' : 'idle'}
            onClick={onSelect}
            disabled={disabled}
            size="md"
          />
        );
      })}
    </div>
  );
}
```

### TenFrame Molecule

```typescript
// src/components/molecules/TenFrame.tsx
'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type TenFrameProps = {
  count: number;
  max?: number;
  onTap?: (index: number) => void;
  disabled?: boolean;
  showNumbers?: boolean;
};

export default function TenFrame({
  count,
  max = 10,
  onTap,
  disabled = false,
  showNumbers = false,
}: TenFrameProps) {
  const cells = Array.from({ length: max }, (_, i) => i);

  return (
    <div className="grid grid-cols-5 gap-2 p-4" role="group" aria-label="Ten frame">
      {cells.map((index) => {
        const isFilled = index < count;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onTap?.(index)}
            disabled={disabled}
            className={cn(
              'h-12 w-12 rounded-lg border-2 transition-all',
              isFilled
                ? 'bg-blue-500 border-blue-400'
                : 'bg-white/20 border-white/30',
              !disabled && 'hover:bg-white/30',
              disabled && 'cursor-not-allowed',
            )}
            aria-label={`Cell ${index + 1}, ${isFilled ? 'filled' : 'empty'}`}
          >
            {showNumbers && (
              <span className="text-xs font-bold text-white">
                {index + 1}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

## E) Animation Libraries & Integration

### Primary Animation Library: Framer Motion

```bash
npm install framer-motion
```

### Animation Components

#### Confetti Animation

```typescript
// src/components/atoms/Confetti.tsx
'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

export default function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 bg-yellow-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
```

#### Shake Animation

```typescript
// src/components/atoms/ShakeAnimation.tsx
'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

export type ShakeAnimationProps = {
  children: React.ReactNode;
  trigger: boolean;
};

export default function ShakeAnimation({ children, trigger }: ShakeAnimationProps) {
  return (
    <motion.div
      animate={trigger ? {
        x: [-10, 10, -10, 10, 0],
      } : {}}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
```

### CSS Transitions for Simple States

```css
/* src/styles/animations.css */
@keyframes pulse-correct {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pulse-correct {
  animation: pulse-correct 0.6s ease-in-out;
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
```

## F) Usage Examples

### Counting Exercise

```typescript
// Example: Tap to count apples
function CountingExercise() {
  const [count, setCount] = React.useState(0);
  const [correct, setCorrect] = React.useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl text-white">Đếm số táo</h2>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <MathIcon
            key={i}
            value={1}
            type="apple"
            size="lg"
            animated={i < count}
          />
        ))}
      </div>

      <div className="flex gap-2">
        {[3, 4, 5, 6].map((number) => (
          <ChoiceCard
            key={number}
            text={number.toString()}
            selected={count === number}
            correct={number === 5 && correct}
            onClick={() => {
              setCount(number);
              setCorrect(number === 5);
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Number Line Exercise

```typescript
// Example: Complete number line
function NumberLineExercise() {
  const [selected, setSelected] = React.useState<number | null>(null);
  const missing = [3, 7];

  return (
    <div className="space-y-6">
      <h2 className="text-xl text-white">Điền số còn thiếu</h2>

      <NumberLine
        min={1}
        max={10}
        current={selected}
        missing={missing}
        onSelect={setSelected}
      />
    </div>
  );
}
```

### Ten Frame Exercise

```typescript
// Example: Ten frame counting
function TenFrameExercise() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl text-white">Đếm trong khung 10</h2>

      <TenFrame
        count={count}
        onTap={(index) => setCount(index + 1)}
        showNumbers={true}
      />

      <p className="text-white">Số đếm: {count}</p>
    </div>
  );
}
```

## G) Storybook Stories

### MathIcon Story

```typescript
// src/components/atoms/MathIcon.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import MathIcon from './MathIcon';

const meta: Meta<typeof MathIcon> = {
  title: 'Atoms/MathIcon',
  component: MathIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['apple', 'star', 'circle', 'square', 'triangle'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 1,
    type: 'apple',
    size: 'md',
  },
};

export const Animated: Story = {
  args: {
    value: 1,
    type: 'star',
    size: 'lg',
    animated: true,
  },
};
```

## H) Tests

### MathIcon Test

```typescript
// src/components/atoms/MathIcon.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MathIcon from './MathIcon';

describe('MathIcon', () => {
  it('renders with correct value and type', () => {
    render(<MathIcon value={5} type="apple" size="md" />);

    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '5 apple');
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    render(<MathIcon value={3} type="star" size="lg" />);

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('h-12', 'w-12');
  });
});
```

## I) Do / Avoid Checklist

### Do:

- ✅ Use consistent size tokens (sm, md, lg)
- ✅ Implement proper ARIA labels and roles
- ✅ Add keyboard navigation support
- ✅ Use semantic HTML elements
- ✅ Implement proper focus management
- ✅ Add loading and error states
- ✅ Use TypeScript for type safety
- ✅ Follow atomic design principles
- ✅ Use Tailwind for styling consistency
- ✅ Implement proper animation performance

### Avoid:

- ❌ Don't add margins or positioning in atoms
- ❌ Don't fetch data in atoms/molecules
- ❌ Don't use inline styles
- ❌ Don't forget accessibility requirements
- ❌ Don't create overly complex components
- ❌ Don't use hardcoded colors
- ❌ Don't forget error boundaries
- ❌ Don't use deprecated React patterns

## J) Assumptions

- Target age group: 4-8 years old
- Primary interaction: Touch/tap on tablets
- Color scheme: High contrast, child-friendly colors
- Animation: Smooth, not overwhelming
- Accessibility: Screen reader support, keyboard navigation
- Performance: Optimized for mobile devices
- Localization: Support for Vietnamese language
- Audio: TTS support for all prompts

## K) Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@storybook/react": "^7.5.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

## L) File Structure

```
src/components/
├── atoms/
│   ├── MathIcon.tsx
│   ├── MathIcon.stories.tsx
│   ├── MathIcon.test.tsx
│   ├── NumberBubble.tsx
│   ├── DragHandle.tsx
│   ├── DropZone.tsx
│   ├── CountButton.tsx
│   └── Confetti.tsx
├── molecules/
│   ├── ChoiceCard.tsx
│   ├── NumberLine.tsx
│   ├── TenFrame.tsx
│   └── DragBucket.tsx
├── organisms/
│   ├── MathQuestion.tsx
│   └── ExerciseViewport.tsx
└── templates/
    └── LessonFrame.tsx
```

This specification provides a comprehensive foundation for building interactive math learning components that are accessible, performant, and engaging for young learners.
