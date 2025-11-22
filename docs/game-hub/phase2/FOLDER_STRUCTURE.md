# Game Hub - Folder Structure

## 📂 Current Folder Structure

### Route Structure

```
app/[locale]/(game-hub)/
├── hub/
│   ├── layout.tsx          # Game Hub layout
│   └── page.tsx            # Game Hub homepage (list of games & launcher)
└── (route group)
```

### Access URL

```
http://localhost:3000/[locale]/game-hub
```

For example:
- `/vi/game-hub` (Vietnamese)
- `/en/game-hub` (English)
- `/fr/game-hub` (French)

---

## 📁 Component Structure

### Game Hub Components

```
src/components/game-hub/
├── index.ts                 # Exports
├── game-list.tsx            # ✅ List of available games
├── game-stage.tsx           # ✅ Game mounting area
├── game-launcher.tsx        # ✅ Game launcher with controls
├── game-stats.tsx           # ✅ Statistics overview
├── game-hub-hero.tsx        # ✨ NEW - Hero section
├── game-card-enhanced.tsx   # ✨ NEW - Enhanced game card
├── game-filters.tsx         # ✨ NEW - Filtering UI
└── game-results-modal.tsx   # ✨ NEW - Results screen
```

---

## 🔧 Core Library Structure

```
src/lib/game-hub/
├── protocol.ts              # ✅ Types & interfaces
├── bridge.ts                # ✅ GameBridge class
├── security.ts              # ✅ Security validation
├── telemetry.ts             # ✅ Telemetry batching
├── progress.ts              # ✅ Progress save/load
├── utils.ts                 # ✅ Utilities
├── performance-monitor.ts   # ✨ NEW - Performance tracking
├── analytics.ts             # ✨ NEW - Analytics events
├── sdk/                     # ✅ SDK for games
│   ├── index.ts
│   ├── iframe-game.ts
│   └── esm-game.ts
└── templates/               # ✅ Game templates
    ├── iframe-game-template.html
    └── esm-game-template.ts
```

---

## 🎮 Games Structure

```
src/games/
├── types.ts                 # ✅ Game types
├── registry.ts              # ✅ Game registry
├── manager.ts              # ✅ Game manager
├── bootstrap.ts            # ✅ Game bootstrap
├── tap/                    # ✅ Existing (adapt for hub)
│   ├── adapter.ts
│   └── TapGame.tsx
├── match-pairs/            # ✅ Existing (adapt for hub)
│   ├── adapter.ts
│   └── MatchPairsGame.tsx
├── memory-match-pro/       # ✨ NEW - Phase 2
│   ├── adapter.ts
│   └── MemoryMatchProGame.tsx
└── quick-draw/             # ✨ NEW - Phase 2 (optional)
    ├── adapter.ts
    └── QuickDrawGame.tsx

public/games/               # ✨ NEW - Phase 2 iframe games
├── math-blitz/
│   ├── index.html
│   ├── game.js
│   └── styles.css
├── word-scramble/
│   ├── index.html
│   ├── game.js
│   └── styles.css
└── number-ninja/
    ├── index.html
    ├── game.js
    └── styles.css
```

---

## 🗂️ API Routes Structure

```
src/app/[locale]/api/game-hub/
├── games/
│   └── route.ts            # ✅ GET /games
├── sessions/
│   ├── start/route.ts     # ✅ POST /sessions/start
│   └── [id]/
│       └── finish/route.ts # ✅ POST /sessions/[id]/finish
├── progress/
│   └── [gameId]/
│       ├── save/route.ts   # ✅ POST /progress/[gameId]/save
│       └── load/route.ts   # ✅ GET /progress/[gameId]/load
└── telemetry/
    └── route.ts            # ✅ POST /telemetry
```

---

## 🏪 Store Structure

```
src/stores/
└── game-hub-store.ts      # ✅ Zustand store for Game Hub state
```

### Store Structure

```typescript
type GameHubState = {
  // Games
  games: GameManifest[];
  currentGame: GameManifest | null;
  isLoadingGames: boolean;
  gamesError: string | null;

  // Session
  currentSession: GameSession | null;
  launchContext: LaunchContext | null;
  isStartingSession: boolean;
  sessionError: string | null;

  // Game state
  score: number;
  progress: any;
  isGameReady: boolean;
  isGamePaused: boolean;
  gameError: string | null;
};
```

---

## 📱 Page Flow

### User Flow

```
1. User navigates to /game-hub
   └── hub/page.tsx
       ├── Shows hero section
       ├── Lists available games
       ├── Displays stats
       └── Waits for user to select game

2. User clicks "Play" on a game
   └── handleLaunch() called
       ├── Creates session via API
       ├── Creates launch context
       ├── Sets currentGame, currentSession, launchContext
       └── Conditionally renders GameLauncher

3. GameLauncher mounts
   └── Shows game with controls
       ├── Pause/Resume
       ├── Quit (with confirmation)
       ├── Score display
       └── GameStage (iframe/ESM mount point)

4. Game completes
   └── handleComplete() called
       ├── Submits score via API
       ├── Shows results modal
       └── Navigates back to game list
```

---

## 🔄 Phase 2 Additions

### New Files to Create

**Components** (5 files):
```
src/components/game-hub/
  ├── game-hub-hero.tsx           # ✨ Hero section
  ├── game-card-enhanced.tsx      # ✨ Enhanced card with hover
  ├── game-filters.tsx            # ✨ Search & filter UI
  ├── game-results-modal.tsx      # ✨ Results screen
  └── (keep existing: game-list, game-stage, game-launcher, game-stats)
```

**Games** (2-3 folders):
```
src/games/
  ├── memory-match-pro/           # ✨ ESM game
  └── quick-draw/                 # ✨ ESM game (optional)

public/games/
  ├── math-blitz/                 # ✨ iframe game
  ├── word-scramble/              # ✨ iframe game
  └── number-ninja/              # ✨ iframe game
```

**Infrastructure**:
```
src/lib/game-hub/
  ├── performance-monitor.ts      # ✨ Performance tracking
  └── analytics.ts                # ✨ Analytics events

src/hooks/
  ├── useLeaderboard.ts           # ⛔ DEFERRED to Phase 3
  ├── usePlayerRank.ts            # ⛔ DEFERRED to Phase 3
  └── useSubmitScore.ts           # ⛔ DEFERRED to Phase 3
```

---

## 📝 Next Steps

1. **Modify existing page**: `src/app/[locale]/(game-hub)/hub/page.tsx`
   - Add hero section
   - Add filters
   - Add enhanced game cards
   - Add results modal

2. **Create new components**:
   - Start with `game-hub-hero.tsx`
   - Then `game-card-enhanced.tsx`
   - Then `game-filters.tsx`
   - Finally `game-results-modal.tsx`

3. **Create mini games**:
   - Start with `public/games/math-blitz/` (simplest)
   - Then adapt existing ESM games
   - Add new ESM games

---

**Version**: 2.0.0
**Created**: October 26, 2025
**Status**: ✅ Structure Documented
