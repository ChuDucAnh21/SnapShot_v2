# Iruka Kids Math Lesson Flow — Frontend Specs (Next.js 15 + Zustand)

**Mục tiêu**: Chuẩn hoá cấu trúc file và hợp đồng (contracts) để bạn tạo từng file code và sử dụng ngay trên Next.js 15 (App Router) với **Zustand**. Nội dung tập trung cho **Toán học 4–8 tuổi** (đếm số, nhận biết, phép tính đơn giản, ghép tương ứng). Tài liệu này nêu rõ: tên file, vai trò, input/output, ví dụ sử dụng, và cách xử lý xung đột với code hiện có.

> Gợi ý: nếu bạn đã có một số file tương tự, hãy dùng phần **[11] Migration & Conflict Guide** bên dưới để quyết định giữ/thay.

---

## [1] Tech Stack & Quy Ước

- **Framework**: Next.js 15 (App Router)
- **State**: Zustand (+ immer, persist)
- **UI**: React + TailwindCSS
- **DND (tùy chọn)**: @dnd-kit/core
- **Âm thanh**: Web Speech API (SpeechSynthesis)
- **Đặt tên**: snake_case cho tệp dữ liệu, PascalCase cho component, camelCase cho hàm biến.

**Root alias**: `@/` trỏ tới thư mục project (cấu hình trong `tsconfig.json` `paths`).

---

## [2] Cây Thư Mục Chuẩn

```
app/
  lessons/
    [lessonId]/
      page.tsx
      LessonClient.tsx
components/
  lesson/
    ProgressBar.tsx
    Feedback.tsx
    SkipConfirm.tsx
    PauseOverlay.tsx
    QuestionView/
      QuestionView.tsx
      types.ts
      SelectOne.tsx
      SelectMany.tsx
      Counting.tsx
      DragMatch.tsx
lib/
  store/
    lessonStore.ts
  tts.ts
  preload.ts
  score.ts
  validators.ts
  api.ts
public/
  images/
    whales_5.png (ví dụ)
```

---

## [3] Data Models (Toán học 4–8 tuổi)

**File**: `components/lesson/QuestionView/types.ts`

**Purpose**: Chuẩn hóa schema câu hỏi/bài học để FE và BE dùng chung.

**Exports**:

- `Choice`, `QuestionBase`, `QSelectOne`, `QSelectMany`, `QCounting`, `QDragMatch`, `Question`, `LessonData`.

**Input/Output**:

- Input: dữ liệu bài học từ API hoặc mock.
- Output: loại an toàn TypeScript cho UI và store.

**Ghi chú Toán học**:

- `QCounting`: dành cho bài **đếm đồ vật** hoặc **nhập kết quả phép tính** đơn giản (số tự nhiên nhỏ ≤ 20).
- `QDragMatch`: ghép **số ↔ nhóm vật thể** (tương ứng trực quan).

---

## [4] State Management (Zustand)

**File**: `lib/store/lessonStore.ts`

**Purpose**: Điều phối luồng lesson theo các `phase` tương đương máy trạng thái Duolingo-style.

**State Shape** (`Ctx`):

- `lesson?: LessonData`
- `index: number` — chỉ số câu hiện tại
- `answerBuffer: any` — đệm đáp án (string | string[] | pairs | number)
- `attemptIndex: number` — 0 hoặc 1
- `hintUsed: boolean`
- `stars: number`, `streak: number`
- `preloaded: boolean`
- `lastEvalCorrect?: boolean`
- `phase: "PRELOAD" | "INTRO" | "QUESTION_ACTIVE" | "CHECKING" | "FEEDBACK_CORRECT" | "FEEDBACK_INCORRECT" | "HINT" | "SKIP_CONFIRM" | "COMPLETED" | "EXIT_TO_PATH" | "ERROR"`

**Actions**:

- `loadLesson(lesson: LessonData): void` — nạp dữ liệu bài học.
- `assetsReady(): void` — set preloaded & `phase=INTRO`.
- `start(): void` — vào `QUESTION_ACTIVE`.
- `answerSelect(value: any): void` — cập nhật `answerBuffer`.
- `submit(): void` — chấm điểm, chuyển FEEDBACK.
- `autoSubmit(): void` — auto cho `select_one`.
- `openHint(): void`, `cancelHint(): void` — vào/ra `HINT` (đặt `hintUsed=true`).
- `askSkip(): void`, `confirmSkip(): void`, `cancelSkip(): void` — bỏ qua câu hỏi.
- `retry(): void` — sai → thử lại, tăng `attemptIndex` tối đa 1.
- `next(): void` — sang câu tiếp hoặc `COMPLETED`.
- `backToPath(): void` — điều hướng ra ngoài (để Router xử lý).
- `reset(): void` — reset lesson giữ nguyên dữ liệu.

**Business Rules**:

- `isCorrect(q, ans)` — so sánh theo từng loại câu.
- `scoreDelta(attemptIndex, hintUsed, skipped)` — 3/2/1/0 sao.

**I/O**:

- Inputs: `LessonData`, tương tác người dùng (click, drag, nhập).
- Outputs: cập nhật `phase`, `stars`, `index`, phát sự kiện FE (ví dụ: gọi TTS, gửi telemetry trong UI layer).

---

## [5] Helpers

### 5.1 `lib/tts.ts`

- `speak(text?: string): void` — đọc lời dẫn/hint (lang `vi-VN`).

### 5.2 `lib/preload.ts`

- `preloadImages(urls: (string|undefined)[]): void` — prefetch ảnh để giảm giật lag.

### 5.3 `lib/score.ts`

- `computeStars(attemptIndex:number, hintUsed:boolean, skipped:boolean): number`

### 5.4 `lib/validators.ts`

- `validateQuestion(question: Question): string[]` — trả về danh sách lỗi cấu hình (rỗng nếu hợp lệ). Dùng trong dev để đảm bảo đề bài đúng schema.

### 5.5 `lib/api.ts`

- `fetchLesson(lessonId: string): Promise<LessonData>` — mock/real API.
- `sendTelemetry(payload: {...}): Promise<void>` — (tùy chọn) log thời gian, đúng/sai, hint/skip.

---

## [6] UI Components

### 6.1 `components/lesson/ProgressBar.tsx`

- **Props**: `{ current: number; total: number }`
- **Output**: thanh tiến độ %, không state nội bộ.

### 6.2 `components/lesson/Feedback.tsx`

- **Props**: `{ correct: boolean; onNext?:()=>void; onRetry?:()=>void; onHint?:()=>void; onSkip?:()=>void }`
- **Output**: overlay phản hồi; đúng → nút Tiếp tục; sai → Retry/Hint/Skip.

### 6.3 `components/lesson/SkipConfirm.tsx`

- **Props**: `{ onConfirm:()=>void; onCancel:()=>void }`

### 6.4 `components/lesson/PauseOverlay.tsx` (tuỳ chọn)

- **Props**: `{ onResume:()=>void; onQuit:()=>void }`

### 6.5 `components/lesson/QuestionView/QuestionView.tsx`

- **Props**: `{ question: Question; answer: any; onAnswer:(v:any)=>void }`
- **Output**: router nhỏ điều phối tới renderer theo `question.type`.

### 6.6 Renderers môn Toán

- `SelectOne.tsx` — chạm chọn 1 đáp án; auto-submit.
  - **Props**: `{ q: QSelectOne; answer?: string; onSelect:(id:string)=>void }`

- `SelectMany.tsx` — chọn nhiều đáp án; cần bấm Nộp.
  - **Props**: `{ q: QSelectMany; selected: string[]; onToggle:(id:string)=>void }`

- `Counting.tsx` — đếm hoặc nhập số; có keypad lớn tùy chọn.
  - **Props**: `{ q: QCounting; value?: number; onChange:(v:number)=>void }`

- `DragMatch.tsx` — ghép số ↔ nhóm đồ vật (`@dnd-kit/core`).
  - **Props**: `{ q: QDragMatch; pairs: Array<{leftId:string; rightId:string}>; onChange:(pairs: Array<...>)=>void }`

**Accessibility**: nút ≥56px, khoảng cách ≥12px, TTS mọi prompt/hint; không dùng đồng hồ đếm ngược.

---

## [7] Pages (Next.js App Router)

### 7.1 `app/lessons/[lessonId]/page.tsx`

- **Input**: `params.lessonId`
- **Process**: gọi `fetchLesson` hoặc nạp mock; render `LessonClient`.
- **Output**: SSR shell + client interactivity.

### 7.2 `app/lessons/[lessonId]/LessonClient.tsx`

- **Input**: `lesson: LessonData`
- **Process**: kết nối Zustand store; gọi `loadLesson()`, `assetsReady()`; TTS khi `phase === QUESTION_ACTIVE`.
- **Output**: UI các phase: INTRO, QUESTION_ACTIVE, FEEDBACK, HINT, SKIP_CONFIRM, COMPLETED.

**Contract**: `LessonClient` **không** tự điều hướng Router; chỉ phát `backToPath()` để layer cha xử lý (hoặc bắt sự kiện để `router.push('/learning-path')`).

---

## [8] Telemetry Contract (tuỳ chọn)

**Sự kiện** (gợi ý):

- `lesson_start` — `{ lessonId, userId, ts }`
- `question_view` — `{ lessonId, qid, index, ts }`
- `answer_submit` — `{ lessonId, qid, attemptIndex, usedHint, latencyMs, ts }`
- `answer_result` — `{ lessonId, qid, isCorrect, starsAwarded, ts }`
- `lesson_complete` — `{ lessonId, starsTotal, correctCount, timeSpentMs, ts }`

**Điểm chèn**: trong `LessonClient` (sau khi `submit()` xong) hoặc subscribe theo `phase` trong store.

---

## [9] UX Quy Tắc Toán 4–8

- **Nhận biết/Đếm**: ưu tiên ảnh lớn, ít chữ; đọc TTS.
- **Phép tính đơn giản**: hiển thị que tính/hình minh hoạ; keypad lớn nếu cần nhập.
- **Sai số**: rung nhẹ + gợi ý ngắn (ví dụ: “Đếm từng con theo hàng”).
- **Skip**: luôn khả dụng để tránh kẹt; hệ thống tự ôn lại sau.

---

## [10] Ví dụ Dữ liệu Lesson (Toán)

Sử dụng chung cho BE/FE test.

```ts
const demoLesson: LessonData = {
  lessonId: 'math_count_1_10',
  title: 'Đếm cá voi 1–10',
  questions: [
    {
      id: 'q1',
      type: 'select_one',
      prompt: 'Đếm số cá voi. Chọn đáp án đúng.',
      assets: { image: '/images/whales_5.png', tts: 'Đếm số cá voi, chọn đáp án đúng.' },
      choices: [
        { id: 'a', text: '4' },
        { id: 'b', text: '5' },
        { id: 'c', text: '6' },
      ],
      answer_key: 'b',
      hint: 'Đếm từng con theo hàng.',
    },
    {
      id: 'q2',
      type: 'counting',
      prompt: 'Có bao nhiêu quả táo?',
      assets: { image: '/images/apples_7.png', tts: 'Có bao nhiêu quả táo?' },
      answer_key: 7,
      hint: 'Chỉ vào từng quả và đếm cùng nhau.',
    },
    {
      id: 'q3',
      type: 'drag_match',
      prompt: 'Kéo số vào nhóm đồ vật tương ứng.',
      left: [
        { id: 'n3', text: '3' },
        { id: 'n5', text: '5' },
      ],
      right: [
        { id: 'gA', image: '/images/group_3.png' },
        { id: 'gB', image: '/images/group_5.png' },
      ],
      answer_pairs: [
        { leftId: 'n3', rightId: 'gA' },
        { leftId: 'n5', rightId: 'gB' },
      ],
      hint: 'Nhìn số lượng từng nhóm.',
    },
  ],
};
```

---

## [11] Migration & Conflict Guide (Khi bạn đã có code)

1. **Types đã có**:
   - Nếu bạn đã có `Question`/`LessonData`, so sánh với `types.ts`.
   - Giữ key BE đã dùng (ví dụ `answer_key`), bổ sung trường thiếu (ví dụ `assets.tts`).

2. **Store hiện tại**:
   - Nếu đang dùng context/reducer: chuyển dần từng hành động sang `lessonStore.ts`.
   - Giai đoạn song song: nối UI vào store mới nhưng vẫn giữ util cũ (scoring, validators).

3. **Component cũ**:
   - Nếu đã có `QuestionView` riêng môn Toán, chỉ cần map props theo hợp đồng ở [6.6].
   - Tách `onAnswer`, `answer` theo kiểu mỗi loại bài.

4. **Đường dẫn alias**:
   - Cập nhật `tsconfig.json` → `paths` để `@/` hoạt động, tránh import tương đối sâu.

5. **Tailwind**:
   - Nếu đã có theme, giữ class hiện hữu; chỉ thêm các class mới ở components.

6. **TTS/Preload**:
   - Có thể giữ helper cũ; nhưng đảm bảo API tương thích: `speak(text?: string)`.

7. **Telemetry**:
   - Chưa có? Tạo `lib/api.ts: sendTelemetry()` mock trước, rồi thay bằng API thật.

8. **Routing**:
   - Bạn có thể đang `useRouter().push(...)` trực tiếp; giữ nguyên. `backToPath()` chỉ đóng vai trò phát tín hiệu từ store.

---

## [12] Testing đề xuất

- **Unit**: `validators.ts` (schema), `isCorrect`, `scoreDelta`.
- **Render**: `QuestionView` với mỗi loại bài; snapshot UI.
- **Store**: mô phỏng flow: START → trả lời đúng/sai → HINT → SKIP → COMPLETED.

---

## [13] Roadmap mở rộng

- Thêm `SelectMany`, `Counting` keypad lớn, `DragMatch` với @dnd-kit.
- Gói `i18n` key ngắn gọn, file `vi.json`.
- A/B tiny UX: confetti vs badge; sticker sưu tầm.
- Tự sinh store từ JSON spec (codegen).

---

## [14] Tên File Tổng Hợp (Bạn sẽ tạo)

- `components/lesson/QuestionView/types.ts`
- `lib/store/lessonStore.ts`
- `lib/tts.ts`
- `lib/preload.ts`
- `lib/score.ts`
- `lib/validators.ts`
- `lib/api.ts`
- `components/lesson/ProgressBar.tsx`
- `components/lesson/Feedback.tsx`
- `components/lesson/SkipConfirm.tsx`
- `components/lesson/PauseOverlay.tsx` (tùy chọn)
- `components/lesson/QuestionView/QuestionView.tsx`
- `components/lesson/QuestionView/SelectOne.tsx`
- `components/lesson/QuestionView/SelectMany.tsx`
- `components/lesson/QuestionView/Counting.tsx`
- `components/lesson/QuestionView/DragMatch.tsx`
- `app/lessons/[lessonId]/page.tsx`
- `app/lessons/[lessonId]/LessonClient.tsx`
