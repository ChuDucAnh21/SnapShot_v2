# Phase 2.1 - UI/UX Enhancements

## 🎨 Overview

Nâng cấp Game Hub UI để có trải nghiệm professional, smooth như Duolingo/Kahoot.

---

## 1. Game Hub Homepage Redesign

### Hero Section

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  🎮 Game Hub                            Profile  │
├─────────────────────────────────────────────────┤
│                                                  │
│         🎯 Khám phá thế giới mini games          │
│           Học tập vui vẻ mỗi ngày               │
│                                                  │
│     [🔍 Tìm kiếm game...]    [Filter ▾]         │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Features**:
- Gradient background (blue → indigo)
- Animated game icons floating
- Search bar with autocomplete
- Filter dropdown (Category, Difficulty, Time)

**Component**: `GameHubHero`

```tsx
type GameHubHeroProps = {
  onSearch: (query: string) => void;
  onFilter: (filters: GameFilters) => void;
  stats: {
    totalGames: number;
    playedToday: number;
  };
};
```

---

### Stats Bar

**Layout**:
```
┌──────────────────────────────────────────────────┐
│  📊 Thống kê hôm nay                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 12 games │  │ 45 min   │  │ 2,340 ⭐  │       │
│  │ Đã chơi  │  │ Thời gian│  │ Điểm số  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────┘
```

**Component**: `GameStats` (already exists, enhance it)

---

### Featured Games Carousel

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  ⭐ Games nổi bật                     ← →        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ [IMG]    │ │ [IMG]    │ │ [IMG]    │        │
│  │ Math     │ │ Memory   │ │ Word     │        │
│  │ Blitz    │ │ Match    │ │ Scramble │        │
│  │ ⭐⭐⭐⭐⭐  │ │ ⭐⭐⭐⭐⭐  │ │ ⭐⭐⭐⭐⭐  │        │
│  │ [Play]   │ │ [Play]   │ │ [Play]   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────┘
```

**Component**: `FeaturedGamesCarousel`

```tsx
type FeaturedGamesCarouselProps = {
  games: GameManifest[];
  onPlay: (game: GameManifest) => void;
};
```

**Libraries**: Use `swiper` or `embla-carousel-react`

---

### Categories Section

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  📚 Danh mục                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ 🧮   │ │ 🎨   │ │ 📝   │ │ 🎯   │          │
│  │ Toán │ │ Nghệ │ │ Ngôn │ │ Logic│          │
│  │      │ │ thuật│ │ ngữ  │ │      │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
└─────────────────────────────────────────────────┘
```

**Component**: `CategoryGrid`

---

### Recent Plays

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  🕐 Chơi gần đây                                │
│  ┌────────────────────────────────────────────┐ │
│  │ Math Blitz      ⭐ 2,500    2 giờ trước   │ │
│  │ Memory Match    ⭐ 1,800    5 giờ trước   │ │
│  │ Word Scramble   ⭐ 3,200    Hôm qua       │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Component**: `RecentPlays`

---

## 2. Enhanced Game Card

### Current vs Enhanced

**Current** (simple):
```
┌──────────────┐
│ [Thumbnail]  │
│ Title        │
│ [Play]       │
└──────────────┘
```

**Enhanced**:
```
┌──────────────────────────────────┐
│ [Thumbnail with overlay]         │
│ ⭐⭐⭐⭐⭐                          │
│ Math Blitz                       │
│ 🎯 Normal • ⏱️ 10 min • 🔥 Popular│
│                                  │
│ Giải toán nhanh để đạt điểm cao │
│                                  │
│ 👥 1,234 played   🏆 Your: 2,500│
│ [▶️ Chơi ngay]                   │
└──────────────────────────────────┘
```

**Features**:
- Hover effect: Scale up + shadow
- Difficulty badge with color
- Time estimate
- Play count
- Personal best score
- Category tag

**Component**: `GameCardEnhanced`

```tsx
type GameCardEnhancedProps = {
  game: GameManifest;
  personalBest?: number;
  playCount?: number;
  onPlay: (game: GameManifest) => void;
  className?: string;
};
```

**Styling**:
```css
.game-card {
  @apply rounded-xl overflow-hidden shadow-md;
  @apply transition-transform duration-300;
  @apply hover:scale-105 hover:shadow-2xl;
}

.game-card-thumbnail {
  @apply relative aspect-video;
  @apply overflow-hidden;
}

.game-card-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/60 to-transparent;
  @apply opacity-0 hover:opacity-100;
  @apply transition-opacity duration-300;
}
```

---

## 3. Game Filters & Search

### Filter Options

```tsx
type GameFilters = {
  category?: string[]; // 'math', 'puzzle', 'word', 'memory'
  difficulty?: Difficulty[]; // 'easy', 'normal', 'hard'
  duration?: string[]; // '< 5', '5-10', '10-20', '> 20' minutes
  capabilities?: string[]; // 'leaderboard', 'save-progress'
  sort?: 'popular' | 'newest' | 'rating' | 'difficulty';
};
```

**Component**: `GameFilters`

```tsx
type GameFiltersProps = {
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
  onReset: () => void;
};
```

**Layout**:
```
┌────────────────────────────────────────────────┐
│ [Category ▾] [Difficulty ▾] [Time ▾]  [Reset] │
│                                                │
│ Selected: Math • Easy • < 10 min    [x]        │
└────────────────────────────────────────────────┘
```

---

### Search Component

**Component**: `GameSearchBar`

```tsx
type GameSearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: GameManifest[];
};
```

**Features**:
- Real-time search (debounced 300ms)
- Autocomplete dropdown
- Recent searches
- Highlight matching text

---

## 4. Game Results Modal

### Layout

```
┌────────────────────────────────────────┐
│              🎉 Hoàn thành!             │
│                                        │
│              ⭐ ⭐ ⭐                    │
│                2,500                   │
│                                        │
│   ┌──────────┐  ┌──────────┐          │
│   │ Chính xác│  │ Thời gian│          │
│   │   85%    │  │  2:34    │          │
│   └──────────┘  └──────────┘          │
│                                        │
│   🏆 #42 trên bảng xếp hạng           │
│                                        │
│   [🔄 Chơi lại]  [📊 Xem BXH]  [✕]   │
└────────────────────────────────────────┘
```

**Component**: `GameResultsModal`

```tsx
type GameResult = {
  score: number;
  stars: 1 | 2 | 3;
  accuracy: number;
  timeMs: number;
  rank?: number;
  personalBest?: boolean;
  achievements?: string[];
};

type GameResultsModalProps = {
  result: GameResult;
  game: GameManifest;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onClose: () => void;
};
```

**Animations**:
- Score count-up effect
- Stars appear one by one
- Confetti if personal best
- Slide in from bottom

---

## 5. Game Launcher Enhancements

### Current Issues
- Simple header
- Basic controls
- No settings

### Enhancements

**Full-screen mode**:
```tsx
const [isFullscreen, setIsFullscreen] = useState(false);

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    containerRef.current?.requestFullscreen();
    setIsFullscreen(true);
  } else {
    document.exitFullscreen();
    setIsFullscreen(false);
  }
};
```

**Pause Menu**:
```
┌───────────────────────────────┐
│         ⏸️ Tạm dừng            │
│                               │
│   [▶️ Tiếp tục]               │
│   [🔄 Chơi lại]               │
│   [⚙️ Cài đặt]                │
│   [📊 Xem tiến độ]            │
│   [🏠 Thoát]                  │
└───────────────────────────────┘
```

**Settings Panel**:
```
┌───────────────────────────────┐
│         ⚙️ Cài đặt             │
│                               │
│  🔊 Âm thanh    [====-----]   │
│  🎵 Nhạc nền    [======---]   │
│  🎯 Độ khó      [Normal ▾]    │
│  🌐 Ngôn ngữ    [VN ▾]        │
│                               │
│  [Lưu]        [Hủy]           │
└───────────────────────────────┘
```

**Progress Indicator** (for multi-level games):
```
┌──────────────────────────────────────┐
│ Level 3/10  ■■■□□□□□□□  30%          │
└──────────────────────────────────────┘
```

---

## 6. Loading States & Skeletons

### Game Card Skeleton

```tsx
export function GameCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 aspect-video rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        <div className="h-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
```

### Loading Overlay (during game mount)

```tsx
<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
  <div className="text-center">
    <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
    <p className="text-white text-xl">
      Đang tải
      {gameName}
      ...
    </p>
    <div className="w-64 mt-4 bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-gray-400 text-sm mt-2">
      {progress}
      %
    </p>
  </div>
</div>;
```

---

## 7. Responsive Design

### Breakpoints

```tsx
// Mobile first
const breakpoints = {
  sm: '640px', // Mobile landscape
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Large desktop
};
```

### Game Grid

```tsx
// Tailwind responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {games.map(game => <GameCard key={game.id} game={game} />)}
</div>;
```

### Mobile Optimizations

- Touch-friendly buttons (min 44px)
- Swipe gestures for carousel
- Bottom sheet for filters on mobile
- Sticky header when scrolling

---

## 8. Accessibility

### ARIA Labels

```tsx
<button
  aria-label={`Chơi ${game.title}`}
  onClick={() => onPlay(game)}
>
  Chơi ngay
</button>

<div role="status" aria-live="polite">
  Đang tải game...
</div>
```

### Keyboard Navigation

- Tab through games
- Enter to play
- Escape to close modals
- Arrow keys for carousel

### Color Contrast

- WCAG AA compliant
- High contrast mode support
- Color blind friendly badges

---

## 9. Implementation Checklist

### Phase 2.1.1 - Hero & Layout
- [ ] Create `GameHubHero` component
- [ ] Enhance `GameStats` with animations
- [ ] Add search bar with debounce
- [ ] Implement filter UI

### Phase 2.1.2 - Game Cards
- [ ] Create `GameCardEnhanced`
- [ ] Add hover effects
- [ ] Implement difficulty badges
- [ ] Add play count & personal best

### Phase 2.1.3 - Navigation
- [ ] Create `FeaturedGamesCarousel`
- [ ] Create `CategoryGrid`
- [ ] Create `RecentPlays` component
- [ ] Implement smooth scrolling

### Phase 2.1.4 - Modals & Overlays
- [ ] Create `GameResultsModal`
- [ ] Create `PauseMenu`
- [ ] Create `SettingsPanel`
- [ ] Add loading skeletons

### Phase 2.1.5 - Responsive & A11y
- [ ] Test on mobile devices
- [ ] Add touch gestures
- [ ] Implement ARIA labels
- [ ] Keyboard navigation

---

## 10. Design Tokens

### Colors

```css
:root {
  --game-hub-primary: #3b82f6; /* Blue */
  --game-hub-secondary: #8b5cf6; /* Purple */
  --game-hub-success: #10b981; /* Green */
  --game-hub-warning: #f59e0b; /* Orange */
  --game-hub-danger: #ef4444; /* Red */

  --difficulty-easy: #10b981;
  --difficulty-normal: #f59e0b;
  --difficulty-hard: #ef4444;

  --category-math: #3b82f6;
  --category-word: #8b5cf6;
  --category-puzzle: #ec4899;
  --category-memory: #06b6d4;
}
```

### Typography

```css
.game-hub-title {
  @apply text-4xl font-bold tracking-tight;
}

.game-hub-subtitle {
  @apply text-xl font-medium text-gray-600;
}

.game-card-title {
  @apply text-lg font-semibold;
}

.game-card-description {
  @apply text-sm text-gray-600;
}
```

---

**Note**: Leaderboard system deferred to Phase 3

**Next**: [3_mini_games_specs.md](./3_mini_games_specs.md)
