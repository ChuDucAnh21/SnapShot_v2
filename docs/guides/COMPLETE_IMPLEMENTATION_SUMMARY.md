# Session Activity Flow - Complete Implementation Summary

## Overview
Updated the session flow to properly display activities based on the session data structure returned from the API.

## Session Data Structure

```typescript
{
  session_id: string;
  learner_id: string;
  node_id: string;
  skill_name: string;
  duration: number;
  activities: Activity[];
}
```

### Activity Types

1. **Question** (`type: 'question'`)
   - `content.prompt`: Question text
   - `content.choices`: Array of `{ id, label }` for MCQ
   - `content.correct_choice_id`: Correct answer ID
   - `content.rationale`: Feedback text
   - `content.input`: 'mcq' | 'free_text'

2. **Quiz** (`type: 'quiz'`)
   - `content.items`: Array of quiz questions
   - Each item: `{ id, prompt, input, choices?, correct_choice_index?, answer_key? }`
   - Supports both MCQ and short text answers

3. **Game** (`type: 'game'`)
   - `content.name`: Game identifier (e.g., 'drag_match')
   - Game-specific config (items, rules, scoring, etc.)

4. **Video** (`type: 'video'`)
   - `content.video_url` or `content.url`
   - `content.description`

## Components Updated

### 1. ActivityQuestion (`src/components/sessions/ActivityQuestion.tsx`)
- ✅ Renders MCQ with choices from `content.choices`
- ✅ Supports free text input
- ✅ Validates against `content.correct_choice_id`
- ✅ Shows feedback with `content.rationale`

### 2. ActivityQuiz (`src/components/sessions/ActivityQuiz.tsx`)
- ✅ Iterates through `content.items` array
- ✅ Renders each question with `prompt`
- ✅ Supports MCQ (`input: 'mcq'`) with `choices` and `correct_choice_index`
- ✅ Supports short text (`input: 'short_text'`) with `answer_key`
- ✅ Calculates score based on correct answers

### 3. ActivityGame (`src/components/sessions/ActivityGame.tsx`)
- ✅ Uses game registry to resolve game by `content.name`
- ✅ Renders game component dynamically
- ✅ Handles game events and completion
- ✅ Submits game results with score and metrics

### 4. ActivityHost (`src/components/sessions/ActivityHost.tsx`)
- ✅ Routes to correct component based on `activity.type`
- ✅ Passes activity data to child components

## Games System

### New Game: drag_match

**Location:** `src/games/drag-match/`

**Files:**
- `DragMatchGame.tsx`: Game component
- `adapter.ts`: Data adapter for session integration

**Registered in:** `src/games/bootstrap.ts`

**Config Structure:**
```typescript
{
  goal: string;
  items: Array<{
    id: string;
    target: string;        // correct number
    sprites: string[];     // emoji array
  }>;
  rules: string[];
  scoring: { per_correct, target, bonus_perfect };
}
```

**Bootstrap:** Games are auto-initialized in `src/instrumentation-client.ts`

## Removed Components

Deleted unused session components (old editor-only):
- ❌ SessionHost.tsx
- ❌ SessionGameHost.tsx
- ❌ SessionGame.tsx
- ❌ SessionPractice.tsx
- ❌ SessionQuiz.tsx
- ❌ SessionVideo.tsx
- ❌ SessionReading.tsx

## Flow Summary

1. **SessionClient** fetches session data
2. **ActivityHost** receives current activity
3. Based on `activity.type`:
   - `question` → **ActivityQuestion** (MCQ or free text)
   - `quiz` → **ActivityQuiz** (multiple questions)
   - `game` → **ActivityGame** (loads game from registry)
   - `video` → **ActivityVideo**
4. Each component:
   - Marks start time in store
   - Handles user interaction
   - Calls `onSubmit()` with result
   - Calls `onNext()` to advance
5. **SessionClient** tracks progress and completes session

## Example Session Data (node-001)

```json
{
  "session_id": "node-001",
  "skill_name": "Number Recognition 0–5",
  "activities": [
    {
      "activity_id": "act-001-01",
      "type": "question",
      "phase": "warm_up",
      "content": {
        "prompt": "Nhìn chấm ●●● và chọn số đúng:",
        "choices": [
          { "id": "A", "label": "2" },
          { "id": "B", "label": "3" },
          { "id": "C", "label": "5" }
        ],
        "correct_choice_id": "B",
        "rationale": "Có 3 chấm, nên chọn số 3."
      }
    },
    {
      "activity_id": "act-001-02",
      "type": "game",
      "phase": "main",
      "content": {
        "name": "drag_match",
        "items": [
          { "id": "i1", "target": "3", "sprites": ["🍎", "🍎", "🍎"] }
        ]
      }
    },
    {
      "activity_id": "act-001-03",
      "type": "quiz",
      "phase": "practice",
      "content": {
        "items": [
          {
            "id": "q1",
            "prompt": "Có bao nhiêu con cá? 🐠🐠",
            "input": "mcq",
            "choices": ["1", "2", "4"],
            "correct_choice_index": 1
          }
        ]
      }
    }
  ]
}
```

## Testing

To test the flow:
1. Navigate to `/learn/session/node-001`
2. Verify each activity type renders correctly
3. Check progression through activities
4. Confirm session completion

## Notes

- QuestionView components (`src/components/lesson/QuestionView/`) are separate and not used in this flow
- MatchPairs component (`src/components/match-pairs/`) is separate from the drag_match game
- Game registry must be bootstrapped before use (done in instrumentation-client.ts)
