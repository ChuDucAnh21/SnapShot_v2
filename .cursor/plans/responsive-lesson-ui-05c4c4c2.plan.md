<!-- 05c4c4c2-b973-4e7a-bc47-4ac10bd4fd75 f61b965d-e714-42f9-9e75-8e7298168d1b -->
# Responsive Lesson UI Implementation

## Overview

Implement mobile-first responsive design for all exercise renderers in LessonClient, with adaptive MemoryMatch grids and scaled typography/spacing.

## Implementation Steps

### 1. Update Exercise Container & Typography

**File:** `src/app/[locale]/(shell)/learn/lesson/[id]/LessonClient.tsx`

Update the main exercise rendering container (line ~411):

```tsx
// Before:
<div className="mx-auto max-w-3xl px-4 py-8 text-white">
  <h2 className="mb-4 text-2xl font-semibold">{q.prompt}</h2>

// After:
<div className="mx-auto max-w-3xl px-3 py-4 text-white sm:px-4 sm:py-6 lg:px-6 lg:py-8">
  <h2 className="mb-3 text-lg font-semibold sm:mb-4 sm:text-xl lg:text-2xl">{q.prompt}</h2>
```

### 2. Responsive TypeAnswerBlock Component

Update `TypeAnswerBlock` (lines ~24-47):

```tsx
// Update input and button styles:
<input
  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white placeholder-white/40 outline-none sm:px-3 sm:py-2 sm:text-base"
  placeholder="Nhập câu trả lời"
/>
<button
  type="submit"
  className="rounded-xl bg-[#6ac21a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5aa017] sm:px-4 sm:py-2 sm:text-sm"
>
  Trả lời
</button>
```

### 3. Responsive SelectChoiceBlock Component

Update `SelectChoiceBlock` (lines ~111-131):

```tsx
<div className="grid gap-2 sm:gap-3">
  {choices.map(c => (
    <button
      type="button"
      key={c}
      onClick={() => onSelect(c)}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10 sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
    >
      {c}
    </button>
  ))}
</div>;
```

### 4. Responsive TrueFalseBlock Component

Update `TrueFalseBlock` (lines ~139-159):

```tsx
<div className="flex gap-2 sm:gap-3">
  <button
    type="button"
    onClick={() => onSelect(true)}
    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 sm:flex-none sm:rounded-xl sm:px-5 sm:py-3 sm:text-base"
  >
    Đúng
  </button>
  <button
    type="button"
    onClick={() => onSelect(false)}
    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 sm:flex-none sm:rounded-xl sm:px-5 sm:py-3 sm:text-base"
  >
    Sai
  </button>
</div>;
```

### 5. Adaptive MemoryMatchBoard Component

Update `MemoryMatchBoard` (lines ~58-111) with responsive grid and card sizing:

**Add responsive grid logic:**

```tsx
function MemoryMatchBoard({ prompt, pairs, colors, grid, onComplete }: MemoryMatchBoardProps) {
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<Set<number>>(() => new Set());

  // Adaptive grid: reduce size on mobile for large grids
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const adaptiveGrid = React.useMemo(() => {
    if (isMobile && grid.rows * grid.cols > 8) {
      // For 4x4 grids on mobile, show 2x4 instead
      return { rows: 2, cols: 4 };
    }
    return grid;
  }, [isMobile, grid]);

  const adaptivePairs = React.useMemo(() => {
    if (isMobile && grid.rows * grid.cols > 8) {
      return pairs.slice(0, 8); // Show first 8 pairs only on mobile
    }
    return pairs;
  }, [isMobile, pairs, grid]);

  // ... rest of handleFlip logic unchanged

  return (
    <div>
      <div className="mb-2 text-xs text-white/70 sm:mb-3 sm:text-sm">{prompt}</div>
      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${adaptiveGrid.cols}, minmax(0, 1fr))` }}
      >
        {adaptivePairs.map((val, idx) => {
          const isShown = flipped.includes(idx) || matched.has(idx);
          const bg = isShown ? (colors[val] || 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.04)';
          return (
            <button
              type="button"
              // eslint-disable-next-line react/no-array-index-key
              key={`${val}-${idx}`}
              onClick={() => handleFlip(idx)}
              className="aspect-square w-full rounded-lg border border-white/10 p-0 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:border-white/20 sm:rounded-xl sm:text-base lg:text-lg"
              style={{ backgroundColor: bg }}
            >
              {isShown ? <span>{val}</span> : <span className="text-white/30">?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

### 6. Responsive INTRO, HINT, and COMPLETED States

Update static screens (lines ~284-506):

**INTRO screen:**

```tsx
<div className="mx-auto max-w-md p-4 text-center sm:p-6">
  <h1 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
  <p className="mb-4 text-sm text-white/70 sm:mb-6 sm:text-base">
```

**HINT screen:**

```tsx
<div className="mx-auto max-w-md p-4 text-center sm:p-6">
  <div className="mb-3 text-5xl sm:mb-4 sm:text-6xl">💡</div>
  <h2 className="mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl">Gợi ý</h2>
  <p className="mb-6 text-base text-white/80 sm:mb-8 sm:text-lg">
```

**COMPLETED screen:**

```tsx
<div className="mx-auto max-w-md p-4 text-center sm:p-6">
  <div className="mb-3 text-5xl sm:mb-4 sm:text-6xl">🎉</div>
  <h1 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
  <p className="mb-4 text-sm text-white/70 sm:mb-6 sm:text-base">
```

### 7. Responsive Legacy QuestionView Container

Update legacy question container (line ~398):

```tsx
<div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
```

## Breakpoint Strategy

- **Mobile (< 640px)**: Reduced padding, smaller text, stacked/full-width buttons, 2x4 grids max
- **Tablet (640-1024px)**: Medium sizing, grid expansion
- **Desktop (≥ 1024px)**: Full sizing, optimal spacing, full grid display

## Testing Checklist

- [ ] Test all exercise types at 320px, 480px, 768px, 1024px, 1440px widths
- [ ] Verify MemoryMatch grid adapts correctly (2x4 on mobile for 4x4 grids)
- [ ] Confirm touch targets are ≥44px on mobile
- [ ] Check text readability at all sizes
- [ ] Validate button sizing and spacing on mobile

### To-dos

- [ ] Update exercise container and prompt typography with responsive classes
- [ ] Add responsive styles to TypeAnswerBlock (input and button)
- [ ] Update SelectChoiceBlock with responsive padding and text sizes
- [ ] Make TrueFalseBlock buttons responsive with flex-1 on mobile
- [ ] Implement adaptive grid logic in MemoryMatchBoard with mobile detection
- [ ] Update INTRO, HINT, and COMPLETED screens with responsive classes
- [ ] Add responsive padding to legacy QuestionView container
- [ ] Test all exercise types across mobile, tablet, and desktop breakpoints
