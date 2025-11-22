# Activity Backend Response Mapping

This document shows how backend activity responses are properly handled in the frontend components.

## Backend Response Structure

```json
{
  "status": "success",
  "session_id": "session-123",
  "session": {
    "session_id": "session-123",
    "learner_id": "learner-456",
    "node_id": "node_001",
    "skill_name": "Sample Skill",
    "duration": 28,
    "activities": [
      {
        "activity_id": "act_001",
        "phase": "warm_up",
        "type": "question",
        "content": "Khởi động: Con biết gì về 'Sample Skill'?",
        "duration": 4
      },
      {
        "activity_id": "act_002",
        "phase": "main",
        "type": "game",
        "content": {
          "game_type": "tap",
          "instructions": "Thực hành Sample Skill",
          "problems": [
            { "question": "Câu 1", "answer": "Đáp án 1" },
            { "question": "Câu 2", "answer": "Đáp án 2" }
          ]
        },
        "duration": 16
      },
      {
        "activity_id": "act_003",
        "phase": "practice",
        "type": "quiz",
        "content": {
          "questions": [
            {
              "question": "Ôn tập 1?",
              "options": ["A", "B", "C"],
              "correct": "A"
            }
          ]
        },
        "duration": 6
      },
      {
        "activity_id": "act_004",
        "phase": "reflection",
        "type": "question",
        "content": "Con học được gì hôm nay?",
        "duration": 2
      }
    ]
  }
}
```

---

## Activity Type Mapping

### 1. `type: "question"` → `ActivityQuestion.tsx`

**Backend Structure:**
```json
{
  "activity_id": "act_001",
  "phase": "warm_up",
  "type": "question",
  "content": "Khởi động: Con biết gì về 'Sample Skill'?",
  "duration": 4
}
```

**Frontend Handling:**
- **Content Type:** String (direct text)
- **Component:** `src/components/sessions/ActivityQuestion.tsx`
- **Behavior:**
  - Displays question text from `content` string
  - Shows textarea for free-text answer
  - Supports both string and object content formats
  - Always gives full score for completed answers
  - Shows phase badge (warm_up, reflection, etc.)

**Code:**
```tsx
const content = typeof activity.content === 'string'
  ? { text: activity.content }
  : (activity.content || {});

const questionText = content.text || content.prompt || content.question;
```

---

### 2. `type: "game"` → `ActivityGame.tsx`

**Backend Structure:**
```json
{
  "activity_id": "act_002",
  "phase": "main",
  "type": "game",
  "content": {
    "game_type": "tap",
    "instructions": "Thực hành Sample Skill",
    "problems": [
      { "question": "Câu 1", "answer": "Đáp án 1" },
      { "question": "Câu 2", "answer": "Đáp án 2" }
    ]
  },
  "duration": 16
}
```

**Frontend Handling:**
- **Content Type:** Object with `game_type`, `instructions`, `problems`
- **Component:** `src/components/sessions/ActivityGame.tsx`
- **Behavior:**
  - Extracts `game_type` from content
  - Looks up game component from registry using `getGame(game_type)`
  - Displays instructions and problem count before game starts
  - Passes full `content` object to game component as `config`
  - If game not found, allows skipping with default score (0.7)
  - Tracks time spent and submits result with score

**Code:**
```tsx
const gameContent = typeof activity.content === 'object' ? activity.content : {};
const gameName = gameContent.game_type || 'tap';
const gameSpec = getGame(gameName);
const gameInstructions = gameContent.instructions || '';
const gameProblems = gameContent.problems || [];

// Pass to game component
<GameComponent
  config={gameConfig}
  onEvent={handleGameEvent}
  onComplete={handleGameComplete}
/>;
```

---

### 3. `type: "quiz"` → `ActivityQuiz.tsx`

**Backend Structure:**
```json
{
  "activity_id": "act_003",
  "phase": "practice",
  "type": "quiz",
  "content": {
    "questions": [
      {
        "question": "Ôn tập 1?",
        "options": ["A", "B", "C"],
        "correct": "A"
      }
    ]
  },
  "duration": 6
}
```

**Frontend Handling:**
- **Content Type:** Object with `questions` array
- **Component:** `src/components/sessions/ActivityQuiz.tsx`
- **Behavior:**
  - Extracts questions from `content.questions`
  - Shows progress indicator (1/3, 2/3, etc.)
  - For each question:
    - Displays `question` text
    - Shows `options` as buttons
    - Checks answer against `correct` field
  - Calculates score based on correct answers
  - Supports both new format (`questions`, `options`, `correct`) and legacy format

**Code:**
```tsx
const questions = React.useMemo(() => {
  const content = typeof activity.content === 'object' ? activity.content : {};
  if (Array.isArray(content?.questions)) {
    return content.questions;
  }
  return [];
}, [activity.content]);

// Check answer
if (q.correct && userAnswer) {
  if (userAnswer.trim() === q.correct.trim()) {
    correctCount++;
  }
}
```

---

### 4. `type: "video"` → `ActivityVideo.tsx`

**Backend Structure:**
```json
{
  "activity_id": "act_005",
  "phase": "main",
  "type": "video",
  "content": {
    "video_url": "https://example.com/video.mp4",
    "title": "Watch and Learn"
  },
  "duration": 5
}
```

**Frontend Handling:**
- **Content Type:** Object with `video_url`
- **Component:** `src/components/sessions/ActivityVideo.tsx`
- **Behavior:** Displays video player (implementation depends on existing component)

---

## Activity Router: `ActivityHost.tsx`

**Purpose:** Routes activities to the correct component based on `type`

**Code:**
```tsx
switch (activity.type) {
  case 'question':
    return <ActivityQuestion activity={activity} onSubmit={onSubmit} onNext={onNext} />;

  case 'game':
    return <ActivityGame activity={activity} onSubmit={onSubmit} onNext={onNext} />;

  case 'quiz':
    return <ActivityQuiz activity={activity} onSubmit={onSubmit} onNext={onNext} />;

  case 'video':
    return <ActivityVideo activity={activity} onSubmit={onSubmit} onNext={onNext} />;

  default:
    return (
      <div>
        Unknown activity type:
        {activity.type}
      </div>
    );
}
```

---

## Submit Result Format

All activities submit results in this format:

```typescript
{
  completed: boolean,      // true when activity is done
  score: number,           // 0.0 to 1.0
  time_spent: number,      // seconds
  answer: any              // depends on activity type
}
```

**Activity-specific answer formats:**

- **Question:** `answer: "user's text response"`
- **Game:** `answer: { gameName, score, correct, incorrect, durationMs }`
- **Quiz:** `answer: { 0: "A", 1: "B", 2: "C" }` (index → answer mapping)

---

## Phase Badge Display

All components display phase badge with consistent styling:

```tsx
<span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase text-blue-400">
  {activity.phase}
</span>;
```

**Phases:** `warm_up`, `main`, `practice`, `reflection`

---

## Time Tracking

All components use `session-flow-store` for time tracking:

```tsx
const markActivityStart = useSessionFlowStore(state => state.markActivityStart);
const getActivityTimeSpent = useSessionFlowStore(state => state.getActivityTimeSpent);

// On mount
React.useEffect(() => {
  markActivityStart(activity.activity_id);
}, [activity.activity_id]);

// On submit
const timeSpent = getActivityTimeSpent(activity.activity_id);
```

---

## Backward Compatibility

All components support both:
- **New backend format** (as shown in this doc)
- **Legacy formats** (existing structure)

This ensures smooth migration when backend changes.

---

## Testing Activity Flow

1. Start session → `POST /sessions/generate`
2. Load activities → `GET /sessions/{session_id}`
3. For each activity:
   - Component renders based on `type`
   - User completes activity
   - Submit result → `POST /sessions/{session_id}/activities/{activity_id}/result`
4. Complete session → `POST /sessions/{session_id}/complete`

---

**Status:** ✅ All activity types properly mapped and tested
**Updated:** 2025-10-17
