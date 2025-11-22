# Tap Game Implementation

## Overview

Created a new "tap" game to match the backend API response structure for game activities.

## Backend Structure Support

The tap game handles this backend response format:

```json
{
  "activity_id": "act_002",
  "phase": "main",
  "type": "game",
  "content": {
    "game_type": "tap",
    "instructions": "Thực hành Sample Skill",
    "problems": [
      {
        "question": "Câu 1",
        "answer": "Đáp án 1"
      },
      {
        "question": "Câu 2",
        "answer": "Đáp án 2"
      }
    ]
  },
  "duration": 16
}
```

## Implementation Details

### Files Created

1. **`src/games/tap/TapGame.tsx`** - Main game component
2. **`src/games/tap/adapter.ts`** - Game adapter for session integration
3. **Updated `src/games/bootstrap.ts`** - Registered the tap game

### Game Features

- ✅ **Multiple Choice Questions**: Displays questions with answer options
- ✅ **Smart Distractors**: Generates wrong answers from other problems
- ✅ **Progress Tracking**: Shows current question number and progress bar
- ✅ **Instructions Display**: Shows backend instructions if provided
- ✅ **Score Calculation**: Tracks correct/incorrect answers
- ✅ **Time Tracking**: Measures total game duration
- ✅ **Event System**: Emits game events for analytics
- ✅ **Responsive UI**: Works on mobile and desktop

### Game Flow

1. **Start**: Game begins, emits 'start' event
2. **For each problem**:
   - Display question and answer options
   - User selects an answer
   - Submit answer (emits 'answer' event)
   - Move to next problem
3. **Complete**: Calculate final score, emit 'end' event

### Score Calculation

```typescript
score = correctAnswers / totalProblems;
```

### Answer Options Generation

- Takes correct answer from `problems[].answer`
- Generates 2-3 distractors from other problems' answers
- Shuffles all options randomly

## Integration with ActivityGame

The tap game integrates seamlessly with `ActivityGame.tsx`:

1. **Game Type Detection**: `game_type: "tap"` → loads TapGame component
2. **Config Passing**: Full `content` object passed as `config`
3. **Result Handling**: Game result includes score, timing, and answer details

## Usage Example

```typescript
// Backend sends this in activity content
const gameConfig = {
  game_type: "tap",
  instructions: "Chọn đáp án đúng",
  problems: [
    { question: "2 + 2 = ?", answer: "4" },
    { question: "3 + 3 = ?", answer: "6" }
  ]
};

// ActivityGame automatically loads TapGame component
<GameComponent config={gameConfig} onComplete={handleComplete} />
```

## Game Registry

The tap game is registered with:

```typescript
{
  id: 'tap',
  title: 'Tap Game',
  component: TapGame,
  adapters: tapAdapter,
  defaultConfig: {
    game_type: 'tap',
    instructions: 'Chọn đáp án đúng cho mỗi câu hỏi',
    problems: [
      { question: 'Câu hỏi mẫu 1?', answer: 'Đáp án A' },
      { question: 'Câu hỏi mẫu 2?', answer: 'Đáp án B' }
    ]
  },
  tags: ['quiz', 'tap', 'multiple-choice'],
  description: 'Tap to select the correct answer'
}
```

## Testing

To test the tap game:

1. **Backend Setup**: Ensure backend sends `game_type: "tap"` in activity content
2. **Session Flow**:
   - Generate session with game activity
   - Click on path node to start session
   - Complete tap game activities
3. **Verify**: Check that correct score and timing are submitted

## Future Enhancements

- **Difficulty Levels**: Support different difficulty based on problem complexity
- **Visual Feedback**: Add animations for correct/incorrect answers
- **Hint System**: Provide hints for difficult questions
- **Custom Styling**: Allow backend to specify colors/themes

---

**Status**: ✅ Tap game implemented and integrated
**Date**: 2025-10-17
**Ready for**: Backend testing with tap game activities
