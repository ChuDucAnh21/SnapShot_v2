# Session Type System - Usage Guide

## Overview
The FE now uses a unified **Session** type system with Zustand for state management. All rendering is based on `session.type`.

## Session Types
- `quiz` → SessionQuiz component
- `practice` → SessionPractice component
- `video` → SessionVideo component
- `reading` → SessionReading component
- `game` → SessionGame component

## Zustand Store Usage

```tsx
import { useSession, useSessionActions } from '@/stores/session-store';

// Read state
const { currentSession, loading, error } = useSession();

// Actions
const { setSession, clear, setLoading, setError } = useSessionActions();
```

## Type Definitions

```typescript
type Session = {
  session_id: string;
  subject_id: string;
  type: 'quiz' | 'practice' | 'video' | 'reading' | 'game';
  title: string;
  description: string;
  items: SessionItem[];
};

type SessionItem = {
  id: string;
  type: 'mcq' | 'fill' | 'dragdrop' | 'step' | 'content';
  payload: unknown;
};
```

## Component Props

All session components accept:
```tsx
type SessionProps = {
  session: Session;
  onItemComplete?: (itemId: string, result: { score: number; answer: unknown }) => void;
  onComplete?: () => void;
};
```

## Routing
- New route: `/learn/session/[id]` → SessionClient (uses Zustand + new types)
- Legacy route: `/learn/lesson/[id]` → LessonClient (uses React Query, backward compatible)

## Migration Checklist
✓ No `lesson` props/variables in new FE code
✓ All imports resolve
✓ TypeScript strict mode passes
✓ UI renders correctly for all 5 session types
✓ Zustand store manages session state
✓ A11y: aria-labels on interactive elements, focus-visible support
