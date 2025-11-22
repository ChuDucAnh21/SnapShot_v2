# Math Components Usage Guide

## Tổng quan

Hướng dẫn sử dụng các atomic components cho hệ thống học toán trẻ em Iruka (4-8 tuổi), tuân theo nguyên tắc atomic design và tối ưu cho các bài tập tương tác.

## 📚 Danh sách Components

### 🧱 Atoms (Thành phần cơ bản)

#### 1. MathIcon

**Mục đích**: Hiển thị icon số học với animation

```typescript
<MathIcon value={1} type="apple" size="lg" animated={true} />
```

**Props**:

- `value`: Số hiển thị
- `type`: Loại icon ('apple' | 'star' | 'circle' | 'square' | 'triangle')
- `size`: Kích thước ('sm' | 'md' | 'lg')
- `animated`: Hiệu ứng animation
- `className`: CSS tùy chỉnh

**Sử dụng**: Đếm số lượng, hiển thị đối tượng trong bài toán

#### 2. NumberBubble

**Mục đích**: Nút số tương tác với trạng thái

```typescript
<NumberBubble
  number={5}
  state="selected"
  onClick={(n) => setSelected(n)}
  size="lg"
/>
```

**Props**:

- `number`: Số hiển thị
- `state`: Trạng thái ('idle' | 'selected' | 'correct' | 'incorrect')
- `onClick`: Callback khi click
- `disabled`: Vô hiệu hóa
- `size`: Kích thước

**Sử dụng**: Chọn số, hiển thị kết quả

#### 3. Confetti

**Mục đích**: Hiệu ứng confetti khi trả lời đúng

```typescript
<Confetti trigger={isCorrect} duration={2000} />
```

**Props**:

- `trigger`: Kích hoạt animation
- `duration`: Thời gian hiển thị (ms)

**Sử dụng**: Phản hồi tích cực khi trả lời đúng

#### 4. ShakeAnimation

**Mục đích**: Hiệu ứng rung khi trả lời sai

```typescript
<ShakeAnimation trigger={isIncorrect}>
  <NumberBubble number={3} state="incorrect" />
</ShakeAnimation>
```

**Props**:

- `trigger`: Kích hoạt animation
- `children`: Component con cần animation

**Sử dụng**: Phản hồi tiêu cực khi trả lời sai

### 🧬 Molecules (Thành phần phức hợp)

#### 1. ChoiceCard

**Mục đích**: Thẻ lựa chọn đáp án

```typescript
<ChoiceCard
  text="5"
  selected={selected === 5}
  correct={correct === 5}
  onClick={() => setSelected(5)}
/>
```

**Props**:

- `text`: Nội dung hiển thị
- `selected`: Đã chọn
- `correct`: Đáp án đúng
- `onClick`: Callback khi click
- `variant`: Kích thước ('default' | 'large')

**Sử dụng**: Multiple choice, true/false

#### 2. NumberLine

**Mục đích**: Dãy số với khả năng điền số thiếu

```typescript
<NumberLine
  min={1}
  max={10}
  current={selected}
  missing={[3, 7]}
  onSelect={setSelected}
/>
```

**Props**:

- `min`: Số nhỏ nhất
- `max`: Số lớn nhất
- `current`: Số đang chọn
- `missing`: Mảng số thiếu
- `onSelect`: Callback khi chọn số

**Sử dụng**: Điền số thiếu, hoàn thành dãy số

#### 3. TenFrame

**Mục đích**: Khung 10 ô để đếm

```typescript
<TenFrame
  count={count}
  onTap={(index) => setCount(index + 1)}
  showNumbers={true}
/>
```

**Props**:

- `count`: Số lượng đã đếm
- `max`: Số ô tối đa (mặc định 10)
- `onTap`: Callback khi tap vào ô
- `showNumbers`: Hiển thị số trong ô

**Sử dụng**: Đếm trong khung 10, cộng trừ cơ bản

## 🎯 Các loại bài tập được hỗ trợ

### 1. Đếm số (Counting)

```typescript
// Tap to count
function CountingExercise() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <MathIcon key={i} value={1} type="apple" size="lg" />
        ))}
      </div>
      <TenFrame count={count} onTap={setCount} />
    </div>
  );
}
```

### 2. Chọn đáp án (Multiple Choice)

```typescript
// Choose one
function MultipleChoiceExercise() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex gap-2">
      {[3, 4, 5, 6].map((number) => (
        <ChoiceCard
          key={number}
          text={number.toString()}
          selected={selected === number}
          onClick={() => setSelected(number)}
        />
      ))}
    </div>
  );
}
```

### 3. Điền số thiếu (Fill Missing)

```typescript
// Complete number line
function FillMissingExercise() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <NumberLine
      min={1}
      max={10}
      current={selected}
      missing={[3, 7]}
      onSelect={setSelected}
    />
  );
}
```

### 4. So sánh số (Compare Numbers)

```typescript
// Compare numbers
function CompareExercise() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <p>So sánh: 5 và 3</p>
      <div className="flex gap-2">
        <ChoiceCard text="5 > 3" selected={selected === 1} onClick={() => setSelected(1)} />
        <ChoiceCard text="5 < 3" selected={selected === 2} onClick={() => setSelected(2)} />
        <ChoiceCard text="5 = 3" selected={selected === 3} onClick={() => setSelected(3)} />
      </div>
    </div>
  );
}
```

## 🎨 Animation và Feedback

### 1. Phản hồi tích cực

```typescript
function PositiveFeedback() {
  const [isCorrect, setIsCorrect] = useState(false);

  return (
    <div>
      <Confetti trigger={isCorrect} />
      <NumberBubble number={5} state="correct" />
    </div>
  );
}
```

### 2. Phản hồi tiêu cực

```typescript
function NegativeFeedback() {
  const [isIncorrect, setIsIncorrect] = useState(false);

  return (
    <ShakeAnimation trigger={isIncorrect}>
      <NumberBubble number={3} state="incorrect" />
    </ShakeAnimation>
  );
}
```

## 🎯 Best Practices

### 1. Accessibility

- Luôn sử dụng `aria-label` cho screen readers
- Hỗ trợ keyboard navigation
- Đảm bảo contrast ratio cao
- Sử dụng semantic HTML

### 2. Performance

- Sử dụng `React.memo` cho components tĩnh
- Tối ưu re-render với `useCallback`
- Lazy load animations nặng

### 3. UX cho trẻ em

- Kích thước nút tối thiểu 56px
- Màu sắc tương phản cao
- Animation mượt mà, không quá nhanh
- Phản hồi tức thì

### 4. Responsive Design

```typescript
// Sử dụng size variants
<MathIcon size="sm" /> // Mobile
<MathIcon size="md" /> // Tablet
<MathIcon size="lg" /> // Desktop
```

## 🔧 Customization

### 1. Theme Colors

```typescript
// Tùy chỉnh màu sắc
const customTheme = {
  apple: 'text-pink-500',
  star: 'text-orange-500',
  circle: 'text-cyan-500',
};
```

### 2. Animation Timing

```typescript
// Tùy chỉnh thời gian animation
<Confetti trigger={true} duration={3000} />
<ShakeAnimation trigger={true} duration={800} />
```

### 3. Size Variants

```typescript
// Tùy chỉnh kích thước
<NumberBubble size="sm" /> // 32px
<NumberBubble size="md" /> // 48px
<NumberBubble size="lg" /> // 64px
```

## 📱 Mobile Optimization

### 1. Touch Targets

- Tối thiểu 44px cho touch targets
- Spacing 12px giữa các elements
- Hit slop 8px cho dễ tap

### 2. Gestures

```typescript
// Hỗ trợ swipe gestures
<div className="touch-pan-x">
  <NumberLine min={1} max={20} />
</div>
```

## 🧪 Testing

### 1. Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MathIcon from './MathIcon';

describe('MathIcon', () => {
  it('renders with correct value', () => {
    render(<MathIcon value={5} type="apple" size="md" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

```typescript
describe('CountingExercise', () => {
  it('allows user to count and select answer', async () => {
    render(<CountingExercise />);

    // Tap to count
    const apples = screen.getAllByRole('img');
    fireEvent.click(apples[0]);

    // Select answer
    const answer5 = screen.getByText('5');
    fireEvent.click(answer5);

    expect(screen.getByText('5')).toHaveClass('bg-green-500');
  });
});
```

## 🚀 Deployment

### 1. Bundle Size

- Tree-shaking enabled
- Dynamic imports cho animations
- Optimized images và icons

### 2. Performance Monitoring

```typescript
// Monitor component performance
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

<Profiler id="MathIcon" onRender={onRenderCallback}>
  <MathIcon value={5} type="apple" size="md" />
</Profiler>
```

## 📚 Tài liệu tham khảo

- [Atomic Design Principles](https://atomicdesign.bradfrost.com/)
- [React Accessibility Guidelines](https://reactjs.org/docs/accessibility.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Contributing

1. Tuân theo atomic design principles
2. Viết tests cho mọi component
3. Đảm bảo accessibility
4. Cập nhật documentation
5. Sử dụng TypeScript strict mode

---

**Lưu ý**: Tài liệu này được cập nhật thường xuyên. Vui lòng kiểm tra phiên bản mới nhất trước khi sử dụng.
