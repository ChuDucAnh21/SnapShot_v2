# Session Learning Flow - Documentation

## 📖 Tổng quan

Hệ thống luồng học session cho phép user thực hiện các bài tập từ đầu đến cuối, bao gồm:

- Tải session từ API
- Bắt đầu session
- Làm từng activity (question/quiz/video/game)
- Gửi kết quả từng activity
- Hoàn tất session và quay về Home

## 🏗️ Kiến trúc

### Tech Stack

- **Next.js 15** (App Router)
- **React Query** (@tanstack/react-query) - Data fetching & caching
- **Zustand** - Local state management
- **Tailwind CSS** - Styling

### File Structure

```
src/
├── app/[locale]/(shell)/learn/session/[id]/
│   ├── page.tsx                          # Main session page
│   └── SessionClient.tsx                 # Session client component
├── components/sessions/
│   ├── ActivityHost.tsx                  # Route activities by type
│   ├── ActivityQuestion.tsx              # Question activity
│   ├── ActivityQuiz.tsx                  # Quiz activity (multiple questions)
│   ├── ActivityVideo.tsx                 # Video activity
│   └── ActivityGame.tsx                  # Game activity
├── stores/
│   └── session-flow-store.ts             # Zustand store for session flow
└── features/sessions/
    ├── types.ts                          # Session & Activity types
    ├── api.ts                            # API functions
    └── hooks.ts                          # React Query hooks
```

## 🔄 User Flow

### 1. Vào màn Learn

```
User → /learn → Chọn môn học → Chọn node → Generate Session
```

### 2. Session Page Load

```typescript
// URL: /learn/session/[id]
GET / api / sessions / { id }; // Load session data
POST / api / sessions / { id } / start; // Auto-start on mount
```

### 3. Làm từng Activity

```
Activity 1 → Submit → Activity 2 → Submit → ... → Activity N
```

### 4. Hoàn tất và về Home

```
Complete Session → POST /api/sessions/{sessionId}/complete → Redirect to /learn
```

## 📦 APIs Sử dụng

### 4.1 Get Session

```http
GET /api/sessions/{session_id}
```

**Response:**

```typescript
{
  status: 'success',
  session: {
    session_id: string,
    learner_id: string,
    node_id: string,
    skill_name: string,
    duration: number,
    activities: Activity[]
  }
}
```

### 4.2 Start Session

```http
POST /api/sessions/{session_id}/start
```

**Response:**

```typescript
{
  status: 'success',
  session_id: string,
  started_at: string
}
```

### 4.3 Submit Activity Result

```http
POST /api/sessions/{session_id}/activities/{activity_id}/result
```

**Body:**

```typescript
{
  completed: boolean,
  score: number,        // 0..1
  time_spent: number,   // seconds
  answer?: any
}
```

### 4.4 Complete Session

```http
POST /api/sessions/{session_id}/complete
```

**Body:**

```typescript
{
  overall_feedback?: string
}
```

## 🎣 React Query Hooks

### useSession

```typescript
const { data, isLoading, isError, refetch } = useSession(sessionId, enabled);
```

### useStartSession

```typescript
const startSession = useStartSession();
startSession.mutate(sessionId, { onSuccess: ... });
```

### useSubmitActivityResult

```typescript
const submitActivity = useSubmitActivityResult();
submitActivity.mutate({ sessionId, activityId, body }, { onSuccess: ... });
```

### useCompleteSession

```typescript
const completeSession = useCompleteSession();
completeSession.mutate({ sessionId, body }, { onSuccess: ... });
```

## 🏪 Zustand Store

### State

```typescript
{
  currentIndex: number,              // Current activity index
  started: boolean,                  // Session started flag
  activityStartTimes: Record<string, number>  // Track time per activity
}
```

### Actions

```typescript
setStarted(boolean)                  // Mark session as started
next(total: number)                  // Move to next activity
reset()                              // Reset store
markActivityStart(activityId)        // Mark when activity starts
getActivityTimeSpent(activityId)     // Get elapsed time in seconds
```

### Selectors

```typescript
const currentIndex = useCurrentIndex();
const isStarted = useIsStarted();
```

## 🎨 Activity Types

### 1. Question (`type: 'question'`)

- User nhập text answer
- Submit → Next activity

### 2. Quiz (`type: 'quiz'`)

- Multiple choice questions
- Progress through all questions
- Calculate final score
- Submit all at end

### 3. Video (`type: 'video'`)

- Display video player
- Mark as watched
- Submit completion

### 4. Game (`type: 'game'`)

- Start game
- Play (simulated for now)
- Submit score

## 📝 Activity Component Props

```typescript
type ActivityProps = {
  readonly activity: Activity;
  readonly onSubmit: (result: SubmitActivityResultReq) => void;
  readonly onNext: () => void;
  readonly isSubmitting: boolean;
};
```

## 🔧 Cách sử dụng

### Tạo Session mới (từ Learning Path)

```typescript
const generateSession = useGenerateSession();

generateSession.mutate(
  {
    learner_id: 'xxx',
    node_id: 'yyy',
  },
  {
    onSuccess: (res) => {
      router.push(`/learn/session/${res.session_id}`);
    },
  },
);
```

### Session Page Logic

```typescript
// 1. Load session
const sessionQuery = useSession(sessionId);

// 2. Auto-start (once)
useEffect(() => {
  if (session && !isStarted) {
    startSession.mutate(sessionId);
    setStarted(true);
  }
}, [session, isStarted]);

// 3. Submit activity
const handleSubmit = (body) => {
  submitActivity.mutate({ sessionId, activityId, body });
};

// 4. Navigate
const handleNext = () => {
  if (isLastActivity) {
    setShowCompleteModal(true);
  } else {
    next(totalActivities);
  }
};

// 5. Complete session
const handleComplete = () => {
  completeSession.mutate(
    { sessionId, body: {} },
    {
      onSuccess: () => router.replace('/learn'),
    },
  );
};
```

## ✅ Acceptance Criteria

- [x] Start session chỉ gọi 1 lần khi load page
- [x] Đi qua hết N activities theo đúng thứ tự
- [x] Mỗi activity submit kết quả về BE
- [x] Hoàn tất session → gọi complete API → redirect về /learn
- [x] Xử lý được 4 loại activity: question, quiz, video, game
- [x] Progress bar hiển thị đúng tiến độ
- [x] Loading/Error states được handle đầy đủ
- [x] React Query cache được invalidate sau mỗi mutation

## 🚀 Next Steps

1. **Tích hợp GameTypeManager**: Thay thế simulation trong `ActivityGame` bằng các game thật
2. **Rich feedback**: Hiển thị feedback chi tiết từ API response
3. **Offline support**: Cache session data để user có thể làm offline
4. **Analytics**: Track user behavior và time spent
5. **Accessibility**: Thêm keyboard shortcuts và screen reader support

## 🐛 Troubleshooting

### Session không start

- Check authentication token
- Verify session_id exists
- Check network tab for API errors

### Activity không submit

- Verify activity_id matches
- Check request body format
- Ensure time_spent is calculated correctly

### Complete không redirect

- Check router.replace() path
- Verify onSuccess callback được gọi
- Check console for navigation errors

---

**Tác giả**: AI Assistant
**Ngày**: 2025-01-16
**Version**: 1.0
