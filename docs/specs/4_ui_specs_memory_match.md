# Iruka UI Spec — Memory Match (Number Pairs on Blackboard)

> Mục tiêu: Có thể **clone y hệt** màn chơi trong ảnh (bảng xanh + thẻ vàng úp mặt → lật ra số nhiều màu) bằng Next.js 15 + Tailwind + Zustand (hoặc React state). Tài liệu này mô tả **layout → component → props → state machine → event bus → a11y → telemetry** và **mapping với model** đã định nghĩa (`ItemType: "match_pairs"`).

---

## 1) Tổng quan màn hình

**Bối cảnh**: Lớp học (background), khung bảng phấn ở giữa, 2 hàng x 4 thẻ trên bảng. Góc trái có nút đóng (x), đồng hồ tường. Góc phải có kệ sách, chậu cây, khối hình. Phần viền hồng 2 bên là viền an toàn (safe area).

**Trạng thái chính**:

- `INIT` → preload assets/âm thanh
- `READY` → thẻ úp mặt (back side: vàng)
- `FIRST_FLIP` → đã chọn thẻ 1
- `SECOND_FLIP` → đã chọn thẻ 2
- `CHECKING` → khoá input, so khớp
- `RESOLVE_MATCH | RESOLVE_MISMATCH`
- `COMPLETE` → tất cả cặp đã khớp

---

## 2) Layout & kích thước (responsive)

- **Canvas**: `aspect-video` (16:9), min-w 320px, max-w 1366px; center theo chiều ngang, có `bg-[#FDE1EC]` (hồng nhạt như hình).
- **ClassroomBackground**: lớp nền SVG/PNG (đồng hồ, kệ, ba lô) — **không tương tác**.
- **BlackboardFrame**: tỉ lệ ~ `width: 86%` của canvas, `height: 56%`, bo góc lớn;
  - Viền gỗ: 16px
  - Mặt bảng: `bg-[#0E7269]` (xanh đậm) + `inset-shadow` nhẹ.

- **CardGrid**: lưới 2 hàng × 4 cột, `gap` 28–32px (tuỳ breakpoint). Card **xoay nhẹ** (~`rotate-[-4..+4deg]`) để giống hình.
- **Card**:
  - Tỉ lệ vuông `1:1`, kích thước dựa trên khung bảng: `calc((blackboardInnerWidth - 3*gap)/4)`.
  - Hai mặt: `Front` (số, viền chấm bi màu) / `Back` (vàng có hoạ tiết chéo). Animation flip 3D.

- **HUD**:
  - **CloseButton**: góc trái trên, tròn, nền tím, icon “×”.
  - **ClockWidget**: dưới nút X, không bắt buộc chạy thời gian; chỉ là decor.
  - **ChalkShelf**: thanh phấn ở cạnh dưới bảng (decor).

> **Màu tham chiếu** (gợi ý Tailwind custom): `--teal-board:#0E7269`, `--wood:#D7A86E`, `--chalk:#F4F6F7`, `--card-back:#F7D54A`, `--pink-side:#FDE1EC`.

---

## 3) Cây component

```
SceneRoot
├─ ClassroomBackground (decor)
├─ BlackboardFrame
│  ├─ CardGrid (rows=2, cols=4)
│  │  ├─ Card x8
│  │  │  ├─ CardFaceBack (vàng)  // default visible
│  │  │  └─ CardFaceFront (số)   // visible khi flipped
│  └─ ChalkShelf (decor)
├─ HUD
│  ├─ CloseButton
│  └─ (tuỳ chọn) ProgressDots / Stars / Attempts
└─ AudioBus (play sfx)
```

---

## 4) Contract với **model** (match_pairs)

- **ItemType**: `"match_pairs"`
- **GeneratedItem** (ví dụ):

```ts
{
  id: "item.match_pairs.board2x4",
  type: "match_pairs",
  prompt: "Lật thẻ và ghép các cặp giống nhau",
  ui: { input: "tap", autoSubmit: false },
  difficulty: 0.3,
  skillId: "skill.numbers.recognize_1_10",
  answerKey: [ ["2","2"], ["3","3"], ["5","5"], ["10","10"] ],
  meta: {
    grid: { rows: 2, cols: 4 },
    pairs: ["2","2","5","5","3","3","10","10"],
    colors: { "2":"green", "5":"blue", "3":"red", "10":"green" },
    shuffleSeed: "MM-001"
  }
}
```

- FE **không cần** biết đáp án trước; `answerKey` chỉ dùng để verify khi `CHECKING`.
- `meta.pairs` cung cấp chuỗi giá trị cho 8 thẻ (đã xáo trộn theo seed). **Nếu BE không xáo trộn**, FE dùng `shuffleSeed` để trộn local (deterministic).

---

## 5) Props/Types (FE)

```ts
export type MatchPairsProps = {
  item: GeneratedItem & { type: 'match_pairs' };
  onComplete: (summary: { attempts: number; timeMs: number; mistakes: number }) => void;
  onTelemetry?: (e: TelemetryEvent) => void;
};

export type CardState = 'faceDown' | 'flipping' | 'faceUp' | 'matched';

export type CardVM = {
  id: string; // stable key
  value: string; // "2" | "5" | ...
  color?: 'green' | 'blue' | 'red' | string;
  state: CardState;
  index: number; // position in grid
};
```

---

## 6) State machine (pseudo)

```
INIT → READY
READY -(CARD_TAP)→ FIRST_FLIP
FIRST_FLIP -(CARD_TAP on different card)→ SECOND_FLIP → CHECKING
CHECKING -(match)→ RESOLVE_MATCH → READY (giữ 2 thẻ ở state matched)
CHECKING -(mismatch)→ RESOLVE_MISMATCH (delay 600ms flip back) → READY
READY -(all matched)→ COMPLETE
```

**Guard/Rules**:

- Không cho tap card đang `flipping | faceUp | matched`.
- Trong `CHECKING`, khoá input toàn grid (`pointer-events: none`).
- Delay sau mismatch: 600–800ms để thấy mặt số.

**Timers**: `elapsedMs` (bắt đầu từ READY), reset khi mount item.

---

## 7) Event bus & Telemetry

- `question_view` khi vào READY.
- `answer_submit` khi mở thẻ thứ 2 (payload: `{aIndex, bIndex, aValue, bValue}`)
- `answer_result` khi CHECKING xong (isCorrect, latency)
- `lesson_complete` khi COMPLETE (nếu đây là item cuối của lesson)

---

## 8) Animation & interaction

**Card Flip**:

- CSS 3D: `transform-style: preserve-3d; perspective: 1000px;`.
- Keyframes: `flipIn` (180° Y), `flipOut`.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.

**Card Layout jitter** (giống hình):

- Mỗi card có `rotateZ` ngẫu nhiên `[-4°, +4°]` dựa trên `index` + `seed` để ổn định giữa re-render.

**SFX (t tuỳ chọn)**:

- `flip.mp3`, `match.mp3`, `mismatch.mp3`, `complete.mp3`.

---

## 9) A11y & Input

- Mỗi card là `button` với `aria-pressed` = `state === "faceUp"`.
- `aria-label`: "Card vị trí r1c3, đang úp mặt" / "Card số 5".
- Hỗ trợ bàn phím: `Tab` → focus card; `Space/Enter` → flip.
- Focus ring rõ ràng, contrast ≥ 3:1 cho trẻ (Tailwind `focus:outline` + `focus:ring-4`).

---

## 10) Styles (Tailwind tokens gợi ý)

```css
:root {
  --teal-board: #0e7269;
  --wood: #d7a86e;
  --chalk: #f4f6f7;
  --card-back: #f7d54a;
  --pink-side: #fde1ec;
}
```

- Blackboard: `bg-[var(--teal-board)] rounded-3xl shadow-[inset_0_6px_0_rgba(0,0,0,0.08)]`
- Frame gỗ: `bg-[var(--wood)] p-4` (bọc ngoài blackboard)
- Card back: `bg-[var(--card-back)] pattern-diagonal` (CSS background-image pattern)
- Card front: `bg-chalk border-8 border-dotted rounded-2xl`
- Viền màu theo giá trị số: `green/blue/red` map vào `border-[color]` + text `text-[color]`

---

## 11) API hiển thị

```tsx
// Component cấp màn
<MatchPairs item={generatedItem} onComplete={...} onTelemetry={...} />
```

**Lifecycle**:

- `useEffect`(on mount): emit `question_view`.
- Khi COMPLETE: call `onComplete({ attempts, timeMs, mistakes })`.

---

## 12) Pseudocode render & logic

```tsx
function MatchPairs({ item, onComplete, onTelemetry }: MatchPairsProps) {
  const [cards, setCards] = useState<CardVM[]>(() => buildCardsFromItem(item));
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const t0 = useRef(performance.now());

  useEffect(
    () =>
      onTelemetry?.({
        type: 'question_view',
        lessonId: '-',
        itemId: item.id,
        ts: new Date().toISOString(),
      }),
    [],
  );

  const onTap = (idx: number) => {
    const c = cards[idx];
    if (c.state !== 'faceDown' || second !== null) {
      return;
    } // lock if resolving

    flipUp(idx);

    if (first === null) {
      setFirst(idx);
      return;
    }
    setSecond(idx);

    // now checking
    const a = cards[first];
    const b = c;
    onTelemetry?.({
      type: 'answer_submit',
      lessonId: '-',
      itemId: item.id,
      attempt: attempts + 1,
      payload: { aIndex: first, bIndex: idx, aValue: a.value, bValue: b.value },
      ts: new Date().toISOString(),
    });

    const isCorrect = a.value === b.value;
    setAttempts(x => x + 1);

    setTimeout(() => {
      if (isCorrect) {
        markMatched([first, idx]);
        setMatchedCount(m => m + 2);
      } else {
        flipDown([first, idx]);
      }
      onTelemetry?.({
        type: 'answer_result',
        lessonId: '-',
        itemId: item.id,
        isCorrect,
        latencyMs: Math.round(performance.now() - t0.current),
        ts: new Date().toISOString(),
      });
      setFirst(null);
      setSecond(null);
    }, 650);
  };

  useEffect(() => {
    if (matchedCount === cards.length) {
      onComplete?.({
        attempts,
        timeMs: Math.round(performance.now() - t0.current),
        mistakes: attempts - cards.length / 2,
      });
    }
  }, [matchedCount]);

  return (
    <SceneRoot>
      <ClassroomBackground />
      <BlackboardFrame>
        <CardGrid rows={item.meta.grid.rows} cols={item.meta.grid.cols}>
          {cards.map((c, i) => (
            <Card key={c.id} vm={c} onTap={() => onTap(i)} />
          ))}
        </CardGrid>
        <ChalkShelf />
      </BlackboardFrame>
      <HUD>
        <CloseButton />
      </HUD>
    </SceneRoot>
  );
}
```

---

## 13) Mapping màu & số như hình

- `2` → viền chấm bi **xanh lá** (#3BA55D)
- `5` → viền chấm bi **xanh dương** (#5DA7E1)
- `3` → viền chấm bi **đỏ hồng** (#F0728C)
- `10` → viền chấm bi **xanh lá** (cùng nhóm với 2)

> Các mã màu chỉ mang tính gần đúng để clone cảm giác thị giác.

---

## 14) Kiểm thử (QA checklist)

- [ ] Card không thể bấm trong lúc `CHECKING`.
- [ ] Hai thẻ giống nhau giữ nguyên `matched` (không lật lại khi hover/click).
- [ ] Khi hoàn tất, phát `complete.mp3` (tuỳ chọn) và tải hiệu ứng confetti 1 lần.
- [ ] A11y: điều hướng bàn phím được, thông báo `aria-live` khi “Khớp rồi!” / “Chưa khớp, thử lại nhé”.
- [ ] Telemetry: đủ 4 sự kiện như mục 7.

---

## 15) Thư mục & tên file gợi ý

```
src/
  components/match-pairs/
    MatchPairs.tsx
    Card.tsx
    BlackboardFrame.tsx
    ClassroomBackground.tsx
    audio.ts
    styles.css
  types/
    core.ts     // import từ file mocks đã tạo hoặc .d.ts chung
  pages/
    demo/match-pairs.tsx
```

---

## 16) Extension (tuỳ chọn)

- **Timer/Stars**: chấm sao theo số lần sai hoặc thời gian.
- **Hint**: lật gợi ý 2 thẻ bất kỳ trong 800ms → giảm 1 sao.
- **Adaptive**: nếu sai liên tiếp 3 lần, giảm grid `3x4` → `2x4` ở vòng sau.

---

### Kết

Spec này đủ để frontend clone y hệt bố cục và tương tác trong ảnh, nối với `ItemType: match_pairs` của core model. Nếu bạn muốn, mình sẽ xuất kèm **starter code** `MatchPairs.tsx` + `Card.tsx` trong 1 file riêng.
