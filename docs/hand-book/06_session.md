# Session Flow - Học Bài Tập

## Tổng Quan

Session flow là phần chính của learning experience, cho phép user học các activities trong một session:
- Làm activity
- Submit kết quả
- Move to next activity
- Complete session

**Route:** `/learn/session/[id]`

---

## Files Involved

### Pages
- `src/app/[locale]/(shell)/learn/session/[id]/page.tsx` - Route handler
- `src/app/[locale]/(shell)/learn/session/[id]/SessionClient.tsx` - Main component

### Features
- `src/features/sessions/api.ts` - Session API
- `src/features/sessions/hooks.ts` - React Query hooks
- `src/features/sessions/types.ts` - TypeScript types

### Components
- `src/components/sessions/ActivityHost.tsx` - Activity router
- `src/components/sessions/ActivityQuestion.tsx` - Question activity
- `src/components/sessions/ActivityQuiz.tsx` - Quiz activity
- `src/components/sessions/ActivityVideo.tsx` - Video activity
- `src/components/sessions/ActivityGame.tsx` - Game activity

### Stores
- `src/stores/session-flow-store.ts` - Zustand store for session state

---

## SessionClient Component

### Structure

```typescript:src/app/[locale]/(shell)/learn/session/[id]/SessionClient.tsx
export default function SessionClient({ id }) {
  // React Query hooks
  const sessionQuery = useSession(id);
  const startSessionMutation = useStartSession();
  const submitActivityMutation = useSubmitActivityResult();
  const completeSessionMutation = useCompleteSession();

  // Zustand store
  const currentIndex = useCurrentIndex();
  const isStarted = useIsStarted();
  const { setStarted, next, reset } = useSessionFlowStore();

  // Local state
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Extract data
  const session = sessionQuery.data?.session;
  const activities = session?.activities || [];
  const currentActivity = activities[currentIndex];
  const isLastActivity = currentIndex === totalActivities - 1;
}
```

### Render States

#### 1. Loading State
```typescript
if (sessionQuery.isLoading || !session) {
  return (
    <div className="flex items-center justify-center">
      <div className="h-12 w-12 animate-spin border-4" />
      <p>Đang tải bài học...</p>
    </div>
  );
}
```

#### 2. Error State
```typescript
if (sessionQuery.isError) {
  return (
    <div className="rounded-2xl bg-red-500/10 p-6">
      <h2>Lỗi tải bài học</h2>
      <Button onClick={() => sessionQuery.refetch()}>Thử lại</Button>
      <Button onClick={() => router.back()}>Quay lại</Button>
    </div>
  );
}
```

#### 3. No Activities
```typescript
if (totalActivities === 0) {
  return (
    <div className="rounded-2xl bg-yellow-500/10 p-6">
      <h2>Không có hoạt động</h2>
      <Button onClick={() => router.back()}>Quay lại</Button>
    </div>
  );
}
```

#### 4. Session UI
```typescript
return (
  <div className="min-h-screen">
    {/* Header with progress */}
    <div className="border-b border-white/10 bg-black/20 px-4 py-4">
      <div>← Quay lại</div>
      <div>{currentIndex + 1} / {totalActivities}</div>
      {/* Progress bar */}
      <div className="h-2 bg-white/10">
        <div
          className="h-full bg-[#6ac21a]"
          style={{ width: `${((currentIndex + 1) / totalActivities) * 100}%` }}
        />
      </div>
      <h1>{session.skill_name}</h1>
    </div>

    {/* Activity content */}
    <div className="py-6">
      <ActivityHost
        activity={currentActivity}
        onSubmit={handleActivitySubmit}
        onNext={handleNext}
        isSubmitting={submitActivityMutation.isPending}
      />
    </div>
  </div>
);
```

---

## Session Flow States

### Zustand Store

```typescript:src/stores/session-flow-store.ts
type SessionFlowStore = {
  currentIndex: number;        // Current activity index
  started: boolean;           // Session started flag
  activityStartTimes: {};     // Track time per activity
};

// Actions
setStarted: (started) => void;
next: (total) => void;
reset: () => void;
markActivityStart: (id) => void;
getActivityTimeSpent: (id) => number;
```

**Usage:**
```typescript
const currentIndex = useCurrentIndex();
const isStarted = useIsStarted();
const { setStarted, next, reset } = useSessionFlowStore();
```

---

## Start Session

### Auto-Start on Mount

```typescript
useEffect(() => {
  if (session && !isStarted && !startSessionMutation.isPending) {
    startSessionMutation.mutate(id, {
      onSuccess: () => {
        setStarted(true);
      },
    });
  }
}, [session, isStarted, startSessionMutation, id, setStarted]);
```

**API Call:**
```typescript
POST /api/sessions/:sessionId/start
```

**Purpose:** Mark session as started on backend.

---

## Activity Submission

### Submit Logic

```typescript
const handleActivitySubmit = (resultBody: any) => {
  submitActivityMutation.mutate({
    sessionId: id,
    activityId: currentActivity.activity_id,
    body: resultBody,
  }, {
    onSuccess: (response) => {
      console.log('Activity submitted:', response);
    },
  });
};
```

**API Call:**
```typescript
POST /api/sessions/:sessionId/activities/:activityId/result
{
  "score": 0.85,
  "answer": {...},
  "time_spent": 120
}
```

**Purpose:** Submit activity result, track progress.

---

## Next Activity

### Navigation Logic

```typescript
const handleNext = () => {
  if (isLastActivity) {
    setShowCompleteModal(true);
  } else {
    next(totalActivities); // Increment currentIndex
  }
};
```

**Flow:**
- If last activity → Show complete modal
- Else → Move to next activity (increment index)

---

## Complete Session

### Complete Logic

```typescript
const handleCompleteSession = (feedback?: string) => {
  completeSessionMutation.mutate({
    sessionId: id,
    body: { overall_feedback: feedback },
  }, {
    onSuccess: () => {
      router.replace('/learn');
    },
  });
};
```

**API Call:**
```typescript
POST /api/sessions/:sessionId/complete
{
  "overall_feedback": "..."
}
```

**Navigation:** Redirect back to `/learn` page.

---

## Complete Modal

### UI Flow

```typescript
{showCompleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="rounded-2xl bg-[#1a1a2e] p-6">
      <div className="mb-6 text-center">
        <div className="text-6xl">🎉</div>
        <h2>Hoàn thành bài học!</h2>
        <p>Bạn đã hoàn thành {totalActivities} hoạt động.</p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setShowCompleteModal(false)}>
          Đóng
        </Button>
        <Button onClick={() => handleCompleteSession()}>
          Hoàn tất
        </Button>
      </div>
    </div>
  </div>
)}
```

---

## Activity Components

### ActivityHost (Router)

```typescript:src/components/sessions/ActivityHost.tsx
export default function ActivityHost({ activity, onSubmit, onNext, isSubmitting }) {
  switch (activity.type) {
    case 'question':
      return <ActivityQuestion {...props} />;
    case 'quiz':
      return <ActivityQuiz {...props} />;
    case 'video':
      return <ActivityVideo {...props} />;
    case 'game':
      return <ActivityGame {...props} />;
    default:
      return <div>Unknown activity type</div>;
  }
}
```

**Purpose:** Route activity based on `activity.type`.

---

### Activity Types

#### Question Activity
- Single question, text answer
- Submit with answer text
- Track time spent

#### Quiz Activity
- Multiple questions
- Multiple choice answers
- Calculate score based on correct answers
- Submit total score

#### Video Activity
- Video player
- Auto-complete after watching duration
- Submit watched status

#### Game Activity
- Game play
- Track score
- Submit game result

---

## Cleanup

### Reset Store on Unmount

```typescript
useEffect(() => {
  return () => {
    reset(); // Clear session state
  };
}, [reset]);
```

**Purpose:** Ensure clean state for next session.

---

## API Integration

### useSession()

```typescript:src/features/sessions/hooks.ts
export function useSession(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: QK.session(sessionId),
    queryFn: () => SessionsApi.getSession(sessionId),
    enabled,
  });
}
```

**API:** `GET /api/sessions/:sessionId`

### useStartSession()

```typescript
export function useStartSession() {
  return useMutation({
    mutationFn: (sessionId: string) => SessionsApi.startSession(sessionId),
  });
}
```

**API:** `POST /api/sessions/:sessionId/start`

### useSubmitActivityResult()

```typescript
export function useSubmitActivityResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { sessionId; activityId; body }) =>
      SessionsApi.submitActivityResult(p.sessionId, p.activityId, p.body),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: QK.session(vars.sessionId) });
    },
  });
}
```

**API:** `POST /api/sessions/:sessionId/activities/:activityId/result`

### useCompleteSession()

```typescript
export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { sessionId; body }) =>
      SessionsApi.completeSession(p.sessionId, p.body),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: QK.session(vars.sessionId) });
    },
  });
}
```

**API:** `POST /api/sessions/:sessionId/complete`

---

## Progress Tracking

### Progress Bar

```typescript
<div className="h-2 bg-white/10">
  <div
    className="h-full bg-[#6ac21a]"
    style={{ width: `${((currentIndex + 1) / totalActivities) * 100}%` }}
  />
</div>
```

**Formula:** `(currentIndex + 1) / totalActivities * 100`

---

## Complete Flow

```
Load Session
    ↓
Start Session (auto)
    ↓
Show Activity 1
    ↓
User completes activity
    ↓
Submit activity result
    ↓
Next activity (if not last)
    ↓
... repeat ...
    ↓
Show complete modal (last activity)
    ↓
Complete session
    ↓
Redirect to /learn
```

---

## Common Issues

### Issue 1: Session Not Starting

**Symptom:** Activities don't load
**Cause:** Start session API call fails
**Fix:** Check backend API logs, retry start

### Issue 2: Activity Submission Fails

**Symptom:** Cannot move to next activity
**Cause:** Submit API returns error
**Fix:** Check activity data format, validate input

### Issue 3: Progress Not Saved

**Symptom:** Page refresh loses progress
**Cause:** State not persisted
**Fix:** Use React Query cache hoặc save to localStorage

---

## Next Flow

Sau khi complete session:
- User được redirect về `/learn`
- Learning path updated với completed session
- Progress saved on backend
- User có thể chọn session tiếp theo

**→ [Learn Flow](./05_learn.md)** (Back to learn page)
