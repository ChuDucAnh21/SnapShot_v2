# Game Type System - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống **GameTypeManager** cho phép tích hợp các mini-games vào sessions. Mỗi game được đăng ký một lần, sau đó có thể tái sử dụng với config khác nhau.

## Danh Sách Games Có Sẵn

### 1. Match Pairs (`match-pairs`)

- **Mô tả**: Ghép các cặp thẻ giống nhau
- **Tags**: `memory`, `matching`
- **Config**:
  - `rows`: số hàng (mặc định: 2)
  - `cols`: số cột (mặc định: 4)
  - `pairs`: mảng giá trị cặp (mặc định: `['1','1','2','2','3','3','4','4']`)
  - `colors`: mapping màu sắc
- **Kết quả**: attempts, timeMs, mistakes

### 2. Maze Runner (`maze`)

- **Mô tả**: Di chuyển từ góc trên-trái đến góc dưới-phải
- **Tags**: `spatial`, `pathfinding`
- **Config**:
  - `rows`: số hàng (mặc định: 10)
  - `cols`: số cột (mặc định: 10)
  - `obstacles`: tỷ lệ chướng ngại vật (mặc định: 0.1)
- **Kết quả**: steps, collisions

### 3. Drag & Drop Numbers (`drag-number`)

- **Mô tả**: Sắp xếp số theo thứ tự tăng/giảm
- **Tags**: `math`, `ordering`
- **Config**:
  - `range`: khoảng số `[min, max]` (mặc định: `[1, 20]`)
  - `count`: số lượng số (mặc định: 6)
  - `mode`: `'asc'` hoặc `'desc'` (mặc định: `'asc'`)
- **Kết quả**: answer, expected, isCorrect

### 4. Road Cycle Car (`road-cycle`)

- **Mô tả**: Tránh chướng ngại vật trên đường
- **Tags**: `timing`, `reaction`
- **Config**:
  - `speed`: tốc độ (mặc định: 1)
  - `traffic`: `'low'`, `'medium'`, `'high'` (mặc định: `'medium'`)
  - `laps`: số vòng (mặc định: 3)
- **Kết quả**: laps, hits

## Sử Dụng Trong Session

### Cách 1: Tạo SessionItem với `type: 'game'`

```typescript
const sessionItem: SessionItem = {
  id: 'item-1',
  type: 'game',
  payload: {
    gameId: 'maze',
    rows: 8,
    cols: 8,
    obstacles: 0.15,
    seed: 12345,
  },
  difficulty: 'medium',
  timeLimitSec: 120,
};
```

### Cách 2: Sử dụng SessionHost

```tsx
import { SessionHost } from '@/components/sessions';

<SessionHost session={session} onComplete={() => console.log('Done!')} />;
```

SessionHost tự động:

- Phát hiện `session.type === 'game'` hoặc `item.type === 'game'`
- Resolve game từ `payload.gameId`
- Render với SessionGameHost
- Gọi `onComplete` khi game kết thúc

## Zustand Store

### State

```typescript
{
  currentSession: Session | null,
  currentIndex: number,
  results: Array<Record<string, unknown>>,
  loading: boolean,
  error: string | null
}
```

### Actions & Selectors

```typescript
import { useCurrentItem, useProgress, useSessionActions } from '@/stores/session-store';

// Actions
const { setSession, nextItem, pushResult, reset } = useSessionActions();

// Selectors
const currentItem = useCurrentItem();
const { current, total } = useProgress();
```

## Editor UI

Truy cập: `/sessions/editor`

**Tính năng**:

- Chọn session type (quiz, practice, video, reading, game)
- Thêm/xóa items với type khác nhau
- Chọn gameId nếu item type là `'game'`
- Preview session trực tiếp
- Export JSON

## Đăng Ký Game Mới

### Bước 1: Tạo Game Component

```tsx
// src/games/my-game/MyGame.tsx
import type { GameProps } from '@/games/types';

export default function MyGame({ config, seed, onEvent, onComplete }: GameProps) {
  // logic game
  onEvent({ type: 'start', payload: {}, ts: Date.now() });

  const handleFinish = () => {
    onComplete({
      score: 0.8,
      correct: 4,
      incorrect: 1,
      durationMs: 5000,
      meta: { customData: 'value' },
    });
  };

  return <div>Game UI</div>;
}
```

### Bước 2: Tạo Adapter (optional)

```typescript
// src/games/my-game/adapter.ts
import type { GameAdapters } from '../types';

export const myGameAdapter: GameAdapters = {
  fromSessionItem: item => ({
    config: {
      /* map từ item.payload */
    },
    seed: item.payload.seed,
  }),
  toSessionResult: gr => ({
    itemId: '',
    score: gr.score,
    details: {
      /* custom fields */
    },
  }),
};
```

### Bước 3: Đăng Ký trong Bootstrap

```typescript
import { myGameAdapter } from './my-game/adapter';
// src/games/bootstrap.ts
import MyGame from './my-game/MyGame';
import { register } from './registry';

export function bootstrapGames() {
  // ... các game khác

  register({
    id: 'my-game',
    title: 'My Awesome Game',
    component: MyGame,
    adapters: myGameAdapter,
    defaultConfig: { difficulty: 1 },
    tags: ['fun', 'educational'],
    description: 'An amazing game',
  });
}
```

## A11y & Telemetry

### A11y

- Tất cả controls có `aria-label`
- Hỗ trợ keyboard navigation với `focus-visible`
- Color contrast tối ưu

### Telemetry

```typescript
onEvent({
  type: 'answer',
  payload: {
    /* user action */
  },
  ts: Date.now(),
});
```

Events: `start`, `progress`, `answer`, `error`, `pause`, `resume`, `end`

## Checklist

- ✅ TypeScript strict mode pass
- ✅ All imports resolve
- ✅ SessionGameHost render được 4 games
- ✅ Editor tạo được `item.type='game'` và preview OK
- ✅ Zustand store quản lý state session
- ✅ A11y: aria-labels và focus-visible
- ✅ GameTypeManager: registry + manager + adapters

## Files Chính

```
src/
├── games/
│   ├── types.ts              # GameSpec, GameProps, GameResult, GameEvent
│   ├── registry.ts           # register(), get(), list()
│   ├── manager.ts            # resolveFromItem()
│   ├── bootstrap.ts          # bootstrapGames()
│   ├── match-pairs/
│   │   ├── MatchPairsGame.tsx
│   │   └── adapter.ts
│   ├── maze/
│   │   ├── MazeGame.tsx
│   │   └── adapter.ts
│   ├── drag-number/
│   │   ├── DragNumberGame.tsx
│   │   └── adapter.ts
│   └── road-cycle/
│       ├── RoadCycleGame.tsx
│       └── adapter.ts
├── components/sessions/
│   ├── SessionHost.tsx       # Component tổng hợp
│   ├── SessionGameHost.tsx   # Host cho game
│   ├── SessionQuiz.tsx
│   ├── SessionPractice.tsx
│   ├── SessionVideo.tsx
│   └── SessionReading.tsx
├── stores/
│   └── session-store.ts      # Zustand store
├── app/(studio)/sessions/editor/
│   └── page.tsx              # Editor UI
└── app/[locale]/(shell)/learn/session/[id]/
    ├── SessionClient.tsx     # Client component
    └── page.tsx              # Route page
```

---

**Lưu ý**: Gọi `bootstrapGames()` một lần khi app khởi động hoặc trong SessionClient để đăng ký tất cả games.
