# 🎮 Iruka Game Hub - Complete Implementation Guide

**Version**: 2.0.0
**Last Updated**: October 26, 2025
**Status**: ✅ Production Ready

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
3. [Games Available](#games-available)
4. [How to Add New Games](#how-to-add-new-games)
5. [Architecture](#architecture)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Game Hub là hệ thống mini-games tích hợp trong Iruka Education App, hỗ trợ hai loại games:
- **iframe-html**: Games chạy trong sandbox iframe (thích hợp cho third-party)
- **esm-module**: Games chạy như React components (thích hợp cho internal games)

### Key Features
- ✅ Dual runtime support (iframe + ESM)
- ✅ Secure sandboxing
- ✅ Score tracking & session management
- ✅ Progress save/load
- ✅ Performance monitoring
- ✅ Telemetry & analytics

---

## Current Implementation

### File Structure

```
src/
├── app/[locale]/
│   ├── (game-hub)/
│   │   └── hub/
│   │       ├── layout.tsx          # Game Hub layout
│   │       └── page.tsx            # Game Hub homepage
│   └── api/
│       ├── game-hub/
│       │   ├── games/route.ts      # GET games list
│       │   ├── sessions/
│       │   │   ├── start/route.ts  # POST start session
│       │   │   └── [id]/finish/route.ts # POST finish
│       │   ├── progress/[gameId]/
│       │   │   ├── save/route.ts   # POST save progress
│       │   │   └── load/route.ts   # GET load progress
│       │   └── telemetry/route.ts  # POST telemetry
│       └── games/
│           └── memory-match-pro/
│               └── entry.js/route.ts # ESM module endpoint
│
├── components/game-hub/
│   ├── game-list.tsx               # List of games
│   ├── game-stage.tsx              # Game mounting area
│   ├── game-launcher.tsx           # Game launcher with controls
│   └── game-stats.tsx              # Statistics display
│
├── lib/game-hub/
│   ├── protocol.ts                 # Types & interfaces
│   ├── bridge.ts                   # GameBridge class
│   ├── security.ts                 # Security validation
│   ├── telemetry.ts                # Telemetry batching
│   ├── progress.ts                 # Progress save/load
│   ├── utils.ts                    # Utilities
│   ├── sdk/                        # SDKs for game developers
│   │   ├── iframe-game.ts
│   │   └── esm-game.ts
│   └── templates/                  # Game templates
│       ├── iframe-game-template.html
│       └── esm-game-template.ts
│
├── games/                          # ESM games
│   └── memory-match-pro/
│       ├── adapter.ts              # Game adapter
│       └── MemoryMatchProGame.tsx  # React component
│
└── stores/
    └── game-hub-store.ts           # Zustand store

public/games/                       # iframe games
├── math-blitz/
│   └── index.html
├── number-ninja/
│   └── index.html
└── word-scramble/
    └── index.html
```

### Access URL

```
http://localhost:3000/[locale]/game-hub
```

Examples:
- `/vi/game-hub` (Vietnamese)
- `/en/game-hub` (English)

---

## Games Available

### 1. Math Blitz 🧮 (iframe)
**Type**: iframe-html
**Location**: `public/games/math-blitz/index.html`
**Description**: Giải toán nhanh trong 60 giây

**Features**:
- 4 phép toán: +, -, ×, ÷
- Combo system
- Score: +10 per correct, -5 per wrong
- Time limit: 60 seconds

### 2. Number Ninja 🥷 (iframe)
**Type**: iframe-html
**Location**: `public/games/number-ninja/index.html`
**Description**: Tap các số theo thứ tự nhanh nhất

**Features**:
- Tap numbers 1-25 in order
- Speed tracking
- Mistake penalties
- Base score: 1000

### 3. Word Scramble 📝 (iframe)
**Type**: iframe-html
**Location**: `public/games/word-scramble/index.html`
**Description**: Sắp xếp chữ cái thành từ đúng

**Features**:
- 10 words per game
- Hint system (3 hints)
- Streak bonus
- Category: Animals

### 4. Memory Match Pro 🧠 (ESM)
**Type**: esm-module
**Location**: `src/games/memory-match-pro/`
**Description**: Lật thẻ tìm cặp giống nhau

**Features**:
- 8 pairs (16 cards)
- React component
- Smooth animations
- Move tracking

---

## How to Add New Games

### Method 1: Create iframe-html Game

**Step 1**: Create game folder in `public/games/`

```bash
mkdir public/games/your-game-name
```

**Step 2**: Create `index.html` with game

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Game</title>
    <style>
        /* Your styles */
    </style>
</head>
<body>
    <div id="game">
        <!-- Your game UI -->
    </div>

    <script>
        // Iruka SDK Communication
        let irukaHost = null;

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'INIT') {
                // Create host bridge
                irukaHost = {
                    ready: () => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'READY'
                        }, '*');
                    },
                    reportScore: (score, delta) => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'SCORE_UPDATE',
                            payload: { score, delta }
                        }, '*');
                    },
                    complete: (data) => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'COMPLETE',
                            payload: data
                        }, '*');
                    }
                };

                // Initialize your game
                startGame();

                // Send READY
                irukaHost.ready();
            } else if (e.data && e.data.type === 'START') {
                // Start game logic
            }
        });

        function startGame() {
            // Your game logic here
        }

        function endGame() {
            // Send complete when done
            if (irukaHost) {
                irukaHost.complete({
                    score: finalScore,
                    timeMs: Date.now() - startTime,
                    extras: {
                        // Any additional data
                    }
                });
            }
        }
    </script>
</body>
</html>
```

**Step 3**: Add to mock API

Edit `src/app/[locale]/api/game-hub/games/route.ts`:

```typescript
const MOCK_GAMES: GameManifest[] = [
  // ... existing games
  {
    id: 'your-game-id',
    slug: 'your-game-slug',
    title: 'Your Game Title',
    description: 'Your game description',
    version: '1.0.0',
    runtime: 'iframe-html',
    entryUrl: '/games/your-game-name/index.html',
    iconUrl: '/images/games/your-game.png',
    capabilities: ['score', 'telemetry'],
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'normal',
      estimatedTime: 5,
      category: 'puzzle',
    },
  },
];
```

**Done!** Your game will appear in Game Hub.

---

### Method 2: Create ESM Module Game (React)

**Step 1**: Create game folder in `src/games/`

```bash
mkdir src/games/your-game-name
```

**Step 2**: Create React component

`src/games/your-game-name/YourGame.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { IrukaHost, LaunchContext } from '@/lib/game-hub/protocol';

interface YourGameProps {
  host: IrukaHost;
  context: LaunchContext;
}

export default function YourGame({ host, context }: YourGameProps) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize game
    host.ready();
  }, []);

  function handleComplete() {
    host.complete({
      score,
      timeMs: Date.now() - startTime,
      extras: {},
    });
  }

  return (
    <div>
      {/* Your game UI */}
      <h1>Your Game</h1>
      <div>Score: {score}</div>
    </div>
  );
}
```

**Step 3**: Create adapter

`src/games/your-game-name/adapter.ts`:

```typescript
import type { HostCommand, IrukaGameInstance, IrukaHost, LaunchContext } from '@/lib/game-hub/protocol';
import React from 'react';
import { createRoot } from 'react-dom/client';
import YourGame from './YourGame';

export async function init(
  container: HTMLElement,
  context: LaunchContext,
  host: IrukaHost
): Promise<IrukaGameInstance> {
  const root = createRoot(container);

  root.render(
    React.createElement(YourGame, { host, context })
  );

  return {
    onHostCommand: (cmd: HostCommand) => {
      // Handle commands
    },
    destroy: () => {
      root.unmount();
    },
  };
}
```

**Step 4**: Create API route

`src/app/[locale]/api/games/your-game-name/entry.js/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const moduleCode = `
import { init } from '/src/games/your-game-name/adapter.ts';
export { init };
`;

  return new NextResponse(moduleCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
    },
  });
}
```

**Step 5**: Add to mock API

```typescript
{
  id: 'your-game-id',
  runtime: 'esm-module',
  entryUrl: '/games/your-game-name/entry.js',
  // ... other fields
}
```

**Done!** Your ESM game is ready.

---

## Architecture

### Communication Flow

```
┌─────────────┐           ┌──────────────┐           ┌─────────┐
│  Game Hub   │◄─────────►│  GameBridge  │◄─────────►│  Game   │
│  (React)    │  mount()  │              │postMessage│(iframe) │
└─────────────┘           └──────────────┘  or API   └─────────┘
      │                          │                        │
      │ fetch games              │ INIT                   │
      │ create session           │ START                  │
      │ handle events            │ PAUSE/RESUME           │
      │                          │                        │
      │                          │◄───READY               │
      │                          │◄───SCORE_UPDATE        │
      │                          │◄───COMPLETE            │
      │                          │                        │
      │◄─update UI───────────────│                        │
      │ submit score             │                        │
      │ show results             │                        │
```

### Event Types

**Host → Game (Commands)**:
- `INIT` - Initialize with context
- `START` - Start gameplay
- `PAUSE` - Pause game
- `RESUME` - Resume game
- `QUIT` - Quit game
- `RESIZE` - Resize viewport

**Game → Host (Events)**:
- `READY` - Game loaded and ready
- `LOADING` - Loading progress
- `SCORE_UPDATE` - Score changed
- `PROGRESS` - Game progress
- `COMPLETE` - Game finished
- `ERROR` - Error occurred
- `REQUEST_SAVE` - Request save
- `REQUEST_LOAD` - Request load
- `TELEMETRY` - Analytics event

---

## API Reference

### GET /api/game-hub/games

Get list of available games.

**Query Params**:
- `platform` (optional): `web` | `mobile`

**Response**:
```json
[
  {
    "id": "math-blitz",
    "slug": "math-blitz",
    "title": "Math Blitz",
    "description": "...",
    "version": "1.0.0",
    "runtime": "iframe-html",
    "entryUrl": "/games/math-blitz/index.html",
    "capabilities": ["score", "telemetry"],
    "metadata": {
      "difficulty": "normal",
      "estimatedTime": 2,
      "category": "math"
    }
  }
]
```

### POST /api/game-hub/sessions/start

Start a new game session.

**Body**:
```json
{
  "gameId": "math-blitz"
}
```

**Response**:
```json
{
  "sessionId": "session-123",
  "launchToken": "jwt-token",
  "expiry": "2025-10-26T12:00:00Z",
  "playerId": "player-123"
}
```

### POST /api/game-hub/sessions/:id/finish

Finish a game session.

**Body**:
```json
{
  "score": 2500,
  "timeMs": 60000
}
```

**Response**:
```json
{
  "success": true
}
```

### POST /api/game-hub/progress/:gameId/save

Save game progress.

**Body**:
```json
{
  "sessionId": "session-123",
  "data": {
    "level": 5,
    "health": 80
  }
}
```

### GET /api/game-hub/progress/:gameId/load

Load saved progress.

**Query**:
- `sessionId`: session ID

**Response**:
```json
{
  "data": {
    "level": 5,
    "health": 80
  },
  "timestamp": "2025-10-26T11:00:00Z"
}
```

### POST /api/game-hub/telemetry

Batch send telemetry events.

**Body**:
```json
{
  "events": [
    {
      "t": 1698345600000,
      "sid": "session-123",
      "gid": "math-blitz",
      "ver": "1.0.0",
      "evt": "level_complete",
      "payload": { "level": 1 }
    }
  ]
}
```

---

## Troubleshooting

### Game không load

**Problem**: iframe game không hiển thị

**Solutions**:
1. Check console for errors
2. Verify `entryUrl` path correct
3. Check file exists in `public/games/`
4. Verify CSP headers allow iframe

### ESM game lỗi import

**Problem**: "Failed to fetch dynamically imported module"

**Solutions**:
1. Check API route exists at `/api/games/[game-name]/entry.js`
2. Verify adapter file path correct
3. Check console for specific error
4. Make sure React/ReactDOM available

### Score không update

**Problem**: Score không hiển thị

**Solutions**:
1. Check game sends `SCORE_UPDATE` event
2. Verify `irukaHost.reportScore()` called
3. Check GameBridge receives event
4. Verify store updates correctly

### Game không kết thúc

**Problem**: Game complete nhưng không show results

**Solutions**:
1. Ensure game sends `COMPLETE` event
2. Check `irukaHost.complete()` called with correct data
3. Verify `onComplete` handler in GameLauncher
4. Check console for errors

---

## Best Practices

### For iframe Games

1. **Always send READY**: Game must send READY within 3 seconds
2. **Handle START**: Wait for START command before gameplay
3. **Report score often**: Update score as it changes
4. **Send COMPLETE**: Always send when game finishes
5. **Clean up**: Remove event listeners on game end

### For ESM Games

1. **Use TypeScript**: Type safety prevents errors
2. **Call host.ready()**: As soon as component mounts
3. **Handle cleanup**: Implement destroy() properly
4. **Avoid memory leaks**: Clear timers and listeners
5. **Test thoroughly**: ESM games harder to debug

### General

1. **Keep it simple**: Start simple, add features later
2. **Test in iframe**: ESM harder to sandbox
3. **Mobile first**: Design for touch screens
4. **Performance**: Target 60 FPS, load < 3s
5. **Error handling**: Catch and report errors

---

## Quick Reference

### iframe Game Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
</head>
<body>
    <div id="game"></div>
    <script>
        let host = null;
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'INIT') {
                host = {
                    ready: () => window.parent.postMessage({
                        sdkVersion: '1.0.0',
                        source: 'game',
                        type: 'READY'
                    }, '*'),
                    reportScore: (s) => window.parent.postMessage({
                        sdkVersion: '1.0.0',
                        source: 'game',
                        type: 'SCORE_UPDATE',
                        payload: { score: s }
                    }, '*'),
                    complete: (d) => window.parent.postMessage({
                        sdkVersion: '1.0.0',
                        source: 'game',
                        type: 'COMPLETE',
                        payload: d
                    }, '*')
                };
                init();
                host.ready();
            }
        });

        function init() { /* game logic */ }
    </script>
</body>
</html>
```

### ESM Game Template

```typescript
// YourGame.tsx
export default function YourGame({ host, context }) {
  useEffect(() => {
    host.ready();
  }, []);

  return <div>Your Game</div>;
}

// adapter.ts
export async function init(container, context, host) {
  const root = createRoot(container);
  root.render(<YourGame host={host} context={context} />);
  return {
    onHostCommand: (cmd) => {},
    destroy: () => root.unmount()
  };
}
```

---

## Next Steps

### Immediate
1. Test all 4 games end-to-end
2. Add placeholder images for game cards
3. Test on mobile devices

### Short-term
1. Add more games
2. Improve UI/UX
3. Add performance monitoring
4. Create dev playground

### Long-term
1. Real backend integration
2. Leaderboard system
3. Multiplayer support
4. Achievements
5. PWA offline support

---

## Support & Resources

- **Code**: `src/lib/game-hub/`
- **Templates**: `src/lib/game-hub/templates/`
- **Phase 1 Docs**: `docs/game-hub/phase1/`
- **Phase 2 Docs**: `docs/game-hub/phase2/`

---

**🎉 Congratulations!** You now have a fully functional Game Hub với 4 games (3 iframe + 1 ESM). Enjoy building more games!

**Version**: 2.0.0
**Created**: October 26, 2025
