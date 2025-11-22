# Game Hub Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Game Hub UI (Next.js)                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │ GameList   │  │ GameStage  │  │GameLauncher│        │  │
│  │  └────────────┘  └────────────┘  └────────────┘        │  │
│  │                                                          │  │
│  │  ┌───────────────────────────────────────────────────┐  │  │
│  │  │          Zustand Store (game-hub-store)          │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                    │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   GameBridge                             │  │
│  │  ┌──────────────────┐         ┌──────────────────┐      │  │
│  │  │  iFrame Runtime  │         │  ESM Runtime     │      │  │
│  │  │                  │         │                  │      │  │
│  │  │  ┌────────────┐  │         │  ┌────────────┐  │      │  │
│  │  │  │   <iframe> │  │         │  │import()    │  │      │  │
│  │  │  │            │  │         │  │            │  │      │  │
│  │  │  │   Game A   │◄─┼─────────┼─►│   Game B   │  │      │  │
│  │  │  │            │  │         │  │            │  │      │  │
│  │  │  └────────────┘  │         │  └────────────┘  │      │  │
│  │  │  postMessage     │         │  Direct Call     │      │  │
│  │  └──────────────────┘         └──────────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FE API Layer (Next.js)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   /games   │  │ /sessions  │  │ /progress  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│  ┌────────────┐  ┌────────────┐                                │
│  │/telemetry  │  │/leaderboard│                                │
│  └────────────┘  └────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Iruka)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  Manifest  │  │  Sessions  │  │  Progress  │                │
│  │   Store    │  │  Manager   │  │   Store    │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│  ┌────────────┐  ┌────────────┐                                │
│  │ Analytics  │  │Leaderboard │                                │
│  │  Pipeline  │  │  Service   │                                │
│  └────────────┘  └────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

## Component Flow

### Game Launch Flow

```
User clicks "Play"
    │
    ▼
GameList.onLaunch(game)
    │
    ▼
POST /api/game-hub/sessions/start
    │
    ▼
Create LaunchContext
    │
    ▼
GameLauncher mounts GameStage
    │
    ▼
GameStage creates GameBridge
    │
    ├─────────────────────┬─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
iframe-html          esm-module           Common
    │                     │                     │
    ▼                     ▼                     ▼
<iframe src=...>    import(entryUrl)      INIT → Game
    │                     │                     │
    ▼                     ▼                     ▼
Game loads          mod.init()            Game → READY
    │                     │                     │
    ▼                     ▼                     ▼
postMessage         Direct API            START → Game
    │                     │                     │
    ▼                     ▼                     ▼
Hub ◄───────────── Game Events ──────────────► Hub
    │                     │                     │
    ▼                     ▼                     ▼
SCORE_UPDATE        PROGRESS              TELEMETRY
    │                     │                     │
    └─────────────────────┴─────────────────────┘
                          │
                          ▼
                    Update Store
                          │
                          ▼
                    Update UI
```

### Protocol Flow (Hub ↔ Game)

```
Hub                         Game
 │                           │
 ├──────── INIT ─────────────►
 │    (LaunchContext)        │
 │                           │
 │◄──────── READY ───────────┤
 │                           │
 ├──────── START ────────────►
 │                           │
 │◄──── LOADING (50%) ───────┤
 │                           │
 │◄─── SCORE_UPDATE ─────────┤
 │    (score: 100)           │
 │                           │
 │◄──── PROGRESS ────────────┤
 │    (level: 2)             │
 │                           │
 ├──────── PAUSE ────────────►
 │                           │
 ├──────── RESUME ───────────►
 │                           │
 │◄─── REQUEST_SAVE ─────────┤
 │                           │
 ├─────► API /progress/save  │
 │                           │
 ├──────── QUIT ─────────────►
 │                           │
 │◄──── COMPLETE ────────────┤
 │    (score: 500, time: 30s)│
 │                           │
 ├─────► API /sessions/finish│
```

## Data Flow

### Telemetry Batching

```
Game Events
    │
    ▼
┌─────────────────┐
│  Telemetry      │
│  Queue          │
│  ┌───────────┐  │
│  │ Event 1   │  │
│  │ Event 2   │  │
│  │ Event 3   │  │
│  │   ...     │  │
│  │ Event 50  │  │
│  └───────────┘  │
└─────────────────┘
    │
    ├───► Every 8s OR 50 events
    │
    ▼
Flush to API
    │
    ├───► Success → Clear queue
    │
    └───► Failure → Exponential backoff
         (1s → 2s → 4s, max 3 retries)
```

### Session Lifecycle

```
┌──────────────┐
│   Idle       │
└──────┬───────┘
       │ User clicks "Play"
       ▼
┌──────────────┐
│  Starting    │◄───── POST /sessions/start
└──────┬───────┘       Generate sessionId, token
       │
       ▼
┌──────────────┐
│   Playing    │◄───── Game READY → START
└──────┬───────┘       Score updates, telemetry
       │
       ├───► User pauses ───────┐
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│   Paused     │         │  Tab Hidden  │
└──────┬───────┘         └──────┬───────┘
       │                        │
       └────── Resume ──────────┘
                │
                ▼
         ┌──────────────┐
         │   Playing    │
         └──────┬───────┘
                │
                ├───► Complete
                │
                ▼
         ┌──────────────┐
         │  Completing  │◄───── POST /sessions/finish
         └──────┬───────┘       Save score, time
                │
                ▼
         ┌──────────────┐
         │   Finished   │
         └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: CSP Headers                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ default-src 'self'                                 │ │
│  │ frame-src https://cdn.iruka.games                  │ │
│  │ script-src 'self' https://cdn.iruka.games          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Layer 2: Origin Validation                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Whitelist: cdn.iruka.games, games.iruka.tld       │ │
│  │ Check e.origin in postMessage                      │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Layer 3: iframe Sandbox                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │ allow-scripts                                      │ │
│  │ allow-pointer-lock                                 │ │
│  │ (NO allow-same-origin for untrusted)               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Layer 4: Token-based Auth                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ JWT tokens with 15 min expiry                      │ │
│  │ Scope: gameId + sessionId                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Layer 5: Data Minimization                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Pseudonymous playerId                              │ │
│  │ No PII in telemetry                                │ │
│  │ Sanitize all inputs                                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## File Structure Map

```
src/
├── lib/game-hub/
│   ├── protocol.ts          [Types & Contracts]
│   ├── bridge.ts            [GameBridge Core]
│   ├── security.ts          [Security Utils]
│   ├── telemetry.ts         [Batching Logic]
│   ├── progress.ts          [Save/Load]
│   ├── utils.ts             [Helpers]
│   ├── index.ts             [Main Export]
│   ├── sdk/
│   │   ├── iframe-game.ts   [iFrame SDK]
│   │   ├── esm-game.ts      [ESM SDK]
│   │   └── index.ts         [SDK Export]
│   └── templates/
│       ├── iframe-game-template.html
│       └── esm-game-template.ts
│
├── components/game-hub/
│   ├── game-list.tsx        [Games Grid]
│   ├── game-stage.tsx       [Game Container]
│   ├── game-launcher.tsx    [Full Session UI]
│   └── game-stats.tsx       [User Stats]
│
├── stores/
│   └── game-hub-store.ts    [Zustand Store]
│
└── app/
    ├── [locale]/(game-hub)/
    │   ├── page.tsx         [Main Page]
    │   └── layout.tsx       [Layout]
    │
    └── api/game-hub/
        ├── games/route.ts
        ├── sessions/
        │   ├── start/route.ts
        │   └── [id]/finish/route.ts
        ├── progress/[gameId]/
        │   ├── save/route.ts
        │   └── load/route.ts
        ├── telemetry/batch/route.ts
        └── leaderboard/[gameId]/route.ts
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                  Technology Stack                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Framework                                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Next.js 15 (App Router)                            │ │
│  │ React 18+                                           │ │
│  │ TypeScript (Strict Mode)                           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Styling                                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Tailwind CSS                                        │ │
│  │ shadcn/ui components                                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  State Management                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Zustand                                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Icons                                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ lucide-react                                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Package Manager                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ pnpm                                                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0
