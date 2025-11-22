# Phase 2.3 - Mini Games Specifications

## 🎮 Overview

Phát triển 5 mini games chất lượng cao, mỗi game có gameplay độc đáo, educational value và replayability cao.

**Tiêu chí chọn games**:
- ✅ Educational value (Toán, Logic, Ngôn ngữ, Trí nhớ)
- ✅ Fun & engaging gameplay
- ✅ 5-10 phút per session
- ✅ Mobile-friendly
- ✅ Easy to understand, hard to master
- ✅ Leaderboard-ready (có score system rõ ràng)

---

## Game 1: Math Blitz 🧮

### Concept

**Mô tả**: Giải các phép toán đơn giản trong thời gian giới hạn. Tốc độ và độ chính xác quyết định điểm số.

**Target audience**: 7-14 tuổi

**Core loop**:
1. Hiển thị phép toán
2. Player nhập đáp án
3. Feedback ngay lập tức (correct/wrong)
4. Next question
5. Repeat until time's up

---

### Game Design

**Modes**:
- **Addition** (Cộng): 1-99 + 1-99
- **Subtraction** (Trừ): 1-99 - 1-99
- **Multiplication** (Nhân): 1-12 × 1-12
- **Division** (Chia): Chia hết
- **Mixed** (Trộn): All of the above

**Difficulty**:
- **Easy**: Single digit (1-9)
- **Normal**: Two digits (10-99)
- **Hard**: Three digits (100-999)

**Time**: 60 seconds per round

**Score System**:
- +10 points per correct answer
- -5 points per wrong answer
- Combo bonus: +2 extra per consecutive correct (max +20)
- Time bonus: +1 point per second remaining if accuracy > 80%

**Power-ups** (optional):
- ⏰ +10 seconds
- 🔄 Skip question
- 💡 Hint (show one digit)

---

### UI Layout

```
┌────────────────────────────────────────┐
│  Math Blitz          ⏱️ 0:45    🔥 x3  │
├────────────────────────────────────────┤
│                                        │
│            45 + 67 = ?                 │
│                                        │
│         ┌──────────────────┐          │
│         │      112         │          │
│         └──────────────────┘          │
│                                        │
│         [1] [2] [3]  [←]              │
│         [4] [5] [6]  [✓]              │
│         [7] [8] [9]                    │
│         [0]      [⌫]                   │
│                                        │
├────────────────────────────────────────┤
│  Score: 250    Correct: 25/28   85%   │
└────────────────────────────────────────┘
```

---

### Tech Stack

**Runtime**: `iframe-html`

**Files**:
```
public/games/math-blitz/
├── index.html          # Main game file
├── game.js             # Game logic
├── styles.css          # Styling
├── sounds/
│   ├── correct.mp3
│   ├── wrong.mp3
│   ├── combo.mp3
│   └── tick.mp3
└── manifest.json       # Game metadata
```

---

### Implementation

**game.js**:
```javascript
class MathBlitz {
  constructor(container, context, host) {
    this.container = container;
    this.context = context;
    this.host = host;

    this.score = 0;
    this.correct = 0;
    this.total = 0;
    this.combo = 0;
    this.timeLeft = 60;

    this.init();
  }

  init() {
    this.renderUI();
    this.generateQuestion();
    this.startTimer();
    this.host.ready();
  }

  generateQuestion() {
    const mode = this.context.difficulty || 'easy';
    const { num1, num2, op } = this.getRandomProblem(mode);

    this.currentQuestion = {
      num1,
      num2,
      op,
      answer: this.calculate(num1, num2, op),
      display: `${num1} ${op} ${num2}`,
    };

    this.displayQuestion();
  }

  checkAnswer(userAnswer) {
    this.total++;

    if (userAnswer === this.currentQuestion.answer) {
      this.correct++;
      this.combo++;
      this.score += 10 + Math.min(this.combo * 2, 20);
      this.playSound('correct');
      this.showFeedback('✓', 'green');
    } else {
      this.combo = 0;
      this.score = Math.max(0, this.score - 5);
      this.playSound('wrong');
      this.showFeedback('✗', 'red');
    }

    this.host.reportScore(this.score);
    this.generateQuestion();
  }

  gameOver() {
    this.host.complete({
      score: this.score,
      timeMs: 60000,
      extras: {
        correct: this.correct,
        total: this.total,
        accuracy: Math.round((this.correct / this.total) * 100),
      },
    });
  }
}

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
  // Wait for INIT from hub
  window.addEventListener('message', (e) => {
    if (e.data.type === 'INIT') {
      const game = new MathBlitz(
        document.body,
        e.data.payload,
        createHostBridge()
      );
    }
  });
});
```

---

## Game 2: Memory Match Pro 🧠

### Concept

**Mô tả**: Lật thẻ và tìm các cặp hình giống nhau. Classic memory game với themes và progressive difficulty.

**Target audience**: 5-12 tuổi

**Core loop**:
1. Cards face down
2. Player flips 2 cards
3. If match → remove, if not → flip back
4. Repeat until all pairs found
5. Track moves and time

---

### Game Design

**Themes**:
- 🔢 **Numbers**: 1-20
- 🎨 **Colors**: Color names + swatches
- 🐾 **Animals**: Animal emojis + names
- ➕ **Math**: Math equations (e.g., "2+3" matches "5")
- 🔤 **Letters**: Uppercase/lowercase pairs

**Grid Sizes**:
- **Easy**: 4×4 (8 pairs)
- **Normal**: 6×6 (18 pairs)
- **Hard**: 8×8 (32 pairs)

**Score System**:
- Base score: 1000
- -10 per move
- -1 per second
- Perfect match bonus (no mistakes): +500
- Speed bonus: +200 if < 1 min (4×4), +500 if < 3 min (6×6)

**Features**:
- Smooth flip animation
- Particle effects on match
- Combo counter
- Undo last flip (1 use per game)

---

### UI Layout

```
┌────────────────────────────────────────┐
│  Memory Match Pro   ⏱️ 1:23   Moves: 15│
├────────────────────────────────────────┤
│                                        │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│    │🐶│ │??│ │??│ │??│               │
│    └──┘ └──┘ └──┘ └──┘               │
│                                        │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│    │??│ │🐱│ │??│ │🐶│               │
│    └──┘ └──┘ └──┘ └──┘               │
│                                        │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│    │??│ │??│ │??│ │??│               │
│    └──┘ └──┘ └──┘ └──┘               │
│                                        │
│    ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│    │??│ │??│ │🐱│ │??│               │
│    └──┘ └──┘ └──┘ └──┘               │
│                                        │
├────────────────────────────────────────┤
│  Score: 750   Pairs: 2/8   🔥 Combo x2│
└────────────────────────────────────────┘
```

---

### Tech Stack

**Runtime**: `esm-module` (React component)

**Files**:
```
src/games/memory-match-pro/
├── adapter.ts                  # GameHub adapter
├── MemoryMatchProGame.tsx      # Main component
├── components/
│   ├── Card.tsx                # Flip card component
│   ├── Grid.tsx                # Card grid
│   ├── Timer.tsx               # Timer display
│   └── StatsBar.tsx            # Score, moves, combos
├── hooks/
│   ├── useMemoryGame.ts        # Game logic hook
│   └── useCardFlip.ts          # Flip animation
├── lib/
│   ├── generate-pairs.ts       # Generate card pairs
│   └── themes.ts               # Theme definitions
└── styles.module.css           # Component styles
```

---

### Implementation

**MemoryMatchProGame.tsx**:
```tsx
import { useEffect } from 'react';
import { Grid } from './components/Grid';
import { StatsBar } from './components/StatsBar';
import { useMemoryGame } from './hooks/useMemoryGame';

export function MemoryMatchProGame({ config, onEvent, onComplete }) {
  const {
    cards,
    flippedCards,
    matchedPairs,
    moves,
    score,
    isComplete,
    handleCardClick,
  } = useMemoryGame(config);

  // Report score updates
  useEffect(() => {
    onEvent({
      type: 'progress',
      payload: { score, moves, matched: matchedPairs.length },
      ts: Date.now(),
    });
  }, [score, moves, matchedPairs]);

  // Handle game complete
  useEffect(() => {
    if (isComplete) {
      onComplete({
        score,
        correct: matchedPairs.length,
        incorrect: moves - matchedPairs.length * 2,
        durationMs: Date.now() - startTime,
        meta: { moves, perfectMatch: moves === matchedPairs.length * 2 },
      });
    }
  }, [isComplete]);

  return (
    <div className="memory-match-game">
      <StatsBar score={score} moves={moves} matched={matchedPairs.length} />
      <Grid
        cards={cards}
        flippedCards={flippedCards}
        matchedPairs={matchedPairs}
        onCardClick={handleCardClick}
      />
    </div>
  );
}
```

**useMemoryGame.ts**:
```tsx
export function useMemoryGame(config: GameConfig) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(1000);

  // Initialize cards
  useEffect(() => {
    const theme = config.theme || 'animals';
    const gridSize = config.gridSize || 4;
    const pairs = generatePairs(theme, (gridSize * gridSize) / 2);
    const shuffled = shuffle([...pairs, ...pairs]);
    setCards(shuffled);
  }, [config]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2) {
      return;
    }
    if (flippedCards.includes(index)) {
      return;
    }
    if (matchedPairs.includes(cards[index].id)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setScore(s => s - 10);

      const [idx1, idx2] = newFlipped;
      if (cards[idx1].id === cards[idx2].id) {
        // Match!
        setMatchedPairs(p => [...p, cards[idx1].id]);
        setFlippedCards([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isComplete = matchedPairs.length === cards.length / 2;

  return {
    cards,
    flippedCards,
    matchedPairs,
    moves,
    score,
    isComplete,
    handleCardClick,
  };
}
```

---

## Game 3: Word Scramble 📝

### Concept

**Mô tả**: Sắp xếp các chữ cái bị xáo trộn để tạo thành từ đúng.

**Target audience**: 8-15 tuổi

**Core loop**:
1. Hiển thị từ bị scramble
2. Player sắp xếp lại các chữ
3. Submit answer
4. Feedback + next word
5. Complete 10-15 words per round

---

### Game Design

**Categories**:
- 🐾 Animals
- 🍎 Food
- 🏫 School
- 🌳 Nature
- 🏠 Home
- 🎨 Random

**Difficulty**:
- **Easy**: 3-5 letters
- **Normal**: 6-8 letters
- **Hard**: 9-12 letters

**Score System**:
- Base: +100 per word
- Time bonus: +5 per second remaining (max 30s per word)
- Hint penalty: -20 per hint used
- Streak bonus: +10 per consecutive solve

**Features**:
- Drag & drop letters
- Or type answer
- Hints: Reveal 1 letter (3 uses per game)
- Skip word (1 use per game)
- Vietnamese + English support

---

### UI Layout

```
┌────────────────────────────────────────┐
│  Word Scramble       Category: Animals │
│  Score: 450   Word 5/10   ⏱️ 0:18     │
├────────────────────────────────────────┤
│                                        │
│           HPNEETLA                     │
│           ▔▔▔▔▔▔▔▔                     │
│                                        │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│  │  │ │  │ │  │ │  │ │  │ │  │       │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘       │
│                                        │
│       [💡 Hint]      [➜ Skip]         │
│                                        │
│            [✓ Submit]                  │
│                                        │
├────────────────────────────────────────┤
│  🔥 Streak: 4      Hints left: 2/3    │
└────────────────────────────────────────┘
```

---

### Tech Stack

**Runtime**: `iframe-html`

**Files**:
```
public/games/word-scramble/
├── index.html
├── game.js
├── styles.css
├── words/
│   ├── vi-animals.json
│   ├── vi-food.json
│   ├── en-animals.json
│   └── en-food.json
└── sounds/
    ├── correct.mp3
    ├── wrong.mp3
    └── hint.mp3
```

---

## Game 4: Quick Draw ✏️

### Concept

**Mô tả**: Vẽ hình theo prompt trong 20 giây. Simple pattern matching để nhận diện.

**Target audience**: 6-12 tuổi

**Core loop**:
1. Show prompt (e.g., "Draw a circle")
2. Player draws on canvas
3. Submit drawing
4. AI checks if it matches (simple)
5. Next prompt

---

### Game Design

**Prompts**:
- 🔴 Shapes: Circle, Square, Triangle, Star
- 🐶 Simple objects: House, Tree, Sun, Cloud
- 🔢 Numbers: 0-9
- 🔤 Letters: A-Z

**Difficulty**:
- **Easy**: Geometric shapes
- **Normal**: Simple objects
- **Hard**: Complex combinations

**Score System**:
- +100 per correct drawing
- Time bonus: +5 per second remaining
- Accuracy bonus: +50 if very accurate
- Creativity bonus: +25 for unique drawings

**Recognition**:
- Simple pattern matching (not ML)
- Check for basic features (e.g., circle = closed loop)
- Very forgiving

---

### UI Layout

```
┌────────────────────────────────────────┐
│  Quick Draw          Round 3/10  ⏱️ 15 │
├────────────────────────────────────────┤
│                                        │
│         Draw a: HOUSE                  │
│                                        │
│  ┌────────────────────────────────┐   │
│  │                                │   │
│  │      [Canvas area]             │   │
│  │                                │   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                        │
│  🎨 [Black] [Red] [Blue] [Green]      │
│  📏 [Thin] [Medium] [Thick]            │
│                                        │
│  [🗑️ Clear]   [✓ Done]                │
│                                        │
├────────────────────────────────────────┤
│  Score: 650   Correct: 2/3            │
└────────────────────────────────────────┘
```

---

### Tech Stack

**Runtime**: `esm-module`

**Files**:
```
src/games/quick-draw/
├── adapter.ts
├── QuickDrawGame.tsx
├── components/
│   ├── Canvas.tsx              # Drawing canvas
│   ├── Toolbar.tsx             # Color/size picker
│   ├── Prompt.tsx              # Current prompt display
│   └── Timer.tsx
├── lib/
│   ├── shape-matcher.ts        # Simple pattern recognition
│   └── prompts.ts              # Prompt definitions
└── styles.module.css
```

---

## Game 5: Number Ninja 🥷

### Concept

**Mô tả**: Tap numbers in correct sequence as fast as possible. Tests speed and accuracy.

**Target audience**: 6-14 tuổi

**Core loop**:
1. Numbers appear randomly on screen
2. Player taps them in order (1, 2, 3...)
3. Timer tracks speed
4. Complete sequence to win

---

### Game Design

**Modes**:
- **Ascending**: 1 → 10/25/50
- **Descending**: 50 → 1
- **Even/Odd**: Only evens or odds
- **Skip count**: 2, 4, 6, 8...

**Difficulty**:
- **Easy**: 1-10
- **Normal**: 1-25
- **Hard**: 1-50

**Score System**:
- Base: 1000 points
- Speed bonus: +10 per second under par time
- Accuracy: -50 per wrong tap
- Perfect bonus: +500 if no mistakes

**Metrics**:
- Numbers per second
- Accuracy %
- Total time

---

### UI Layout

```
┌────────────────────────────────────────┐
│  Number Ninja        Mode: Ascending   │
│  Next: 5          ⏱️ 0:12      Score: 850│
├────────────────────────────────────────┤
│                                        │
│    23        7           15            │
│          31      9                     │
│      19            3        11         │
│  5             21      17              │
│         13                    25       │
│                                        │
│                                        │
├────────────────────────────────────────┤
│  Progress: 4/25  ■■■□□□□□□□   16%     │
└────────────────────────────────────────┘
```

---

### Tech Stack

**Runtime**: `iframe-html`

**Files**:
```
public/games/number-ninja/
├── index.html
├── game.js
├── styles.css
└── sounds/
    ├── tap.mp3
    ├── correct.mp3
    ├── wrong.mp3
    └── complete.mp3
```

---

## Implementation Priority

### Sprint 1 (Days 1-2): Math Blitz
- Simple, straightforward
- Good for testing iframe integration
- **Estimate**: 1-2 days

### Sprint 2 (Days 3-4): Memory Match Pro
- More complex, ESM module
- Tests React integration
- **Estimate**: 2 days

### Sprint 3 (Days 5-6): Word Scramble
- Medium complexity
- Tests i18n support
- **Estimate**: 1-2 days

### Sprint 4 (Day 7): Number Ninja
- Simple, quick to implement
- **Estimate**: 1 day

### Sprint 5 (Day 8-9): Quick Draw
- Most complex (canvas)
- Optional if time limited
- **Estimate**: 2 days

---

## Shared Components & Utilities

### Timer Component

```tsx
export function GameTimer({
  duration,
  onTick,
  onComplete
}: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
      onTick?.(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="timer">
      ⏱️
      {' '}
      {formatTime(timeLeft)}
    </div>
  );
}
```

### Score Display

```tsx
export function ScoreDisplay({
  score,
  animate = false
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    // Count up animation
    const step = (score - displayScore) / 20;
    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        const next = prev + step;
        if ((step > 0 && next >= score) || (step < 0 && next <= score)) {
          clearInterval(interval);
          return score;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="score-display">
      Score:
      {' '}
      {Math.round(displayScore)}
    </div>
  );
}
```

---

## Testing Checklist

### Per Game
- [ ] Load in iframe/ESM
- [ ] Start game
- [ ] Play full round
- [ ] Submit score
- [ ] Check leaderboard
- [ ] Mobile responsive
- [ ] Sound effects work
- [ ] Pause/resume
- [ ] Error handling

---

**Note**: No leaderboard integration needed for Phase 2

**Next**: [4_performance_monitoring.md](./4_performance_monitoring.md)
