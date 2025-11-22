# 📝 How to Register a New Game in Game Hub

Hướng dẫn chi tiết để thêm game mới vào Game Hub - Bất kỳ game được build từ thư viện nào.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Method 1: iframe Game (Recommended)](#method-1-iframe-game-recommended)
4. [Method 2: ESM Module Game](#method-2-esm-module-game)
5. [Common Scenarios](#common-scenarios)
6. [Testing Your Game](#testing-your-game)
7. [Troubleshooting](#troubleshooting)

---

## Overview

Game Hub hỗ trợ **2 types** của games:

### 🌐 iframe Game
- Game chạy trong `<iframe>` sandbox
- **Supports**: HTML, CSS, JS (bất kỳ framework nào)
- **Pros**: Secure, isolated, flexible
- **Best for**: Phaser, PixiJS, Three.js, Unity WebGL, plain HTML games

### ⚛️ ESM Module Game
- Game chạy như React component
- **Supports**: React/TypeScript only
- **Pros**: Native integration, better performance
- **Best for**: React-based games, complex UI interactions

---

## Prerequisites

- ✅ Knowledge of HTML/CSS/JS or React
- ✅ Game code ready to integrate
- ✅ Access to `public/games/` or `src/games/` folder
- ✅ Basic understanding of Game Hub protocol

---

## Method 1: iframe Game (Recommended)

**Use this method if**:
- Game được build thành HTML file
- Sử dụng framework như Phaser, PixiJS, Three.js
- Game là standalone HTML/CSS/JS
- Bạn muốn sandbox isolation

---

### Step-by-Step Guide

#### Step 1: Place Your Game Files

Create a folder in `public/games/`:

```bash
mkdir public/games/your-game-name
```

**Put your game files here**:
```
public/games/your-game-name/
├── index.html          # Main entry point
├── game.js            # Your game logic
├── styles.css         # Your styles
├── assets/            # Images, sounds, etc.
│   ├── images/
│   └── sounds/
└── dist/              # If built from a framework
    ├── bundle.js
    └── bundle.css
```

**Important**: `index.html` must exist and be the entry point.

---

#### Step 2: Integrate Iruka SDK

**Your game MUST communicate with Game Hub**. Add this code to your `index.html`:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game</title>

    <!-- Your CSS -->
    <link rel="stylesheet" href="styles.css">

    <!-- If using external libs -->
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
</head>
<body>
    <!-- Your game container -->
    <div id="game-container">
        <!-- Your game UI here -->
    </div>

    <!-- Your game scripts -->
    <script src="game.js"></script>

    <!-- Iruka SDK Integration -->
    <script>
        // Game state
        let irukaHost = null;
        let gameStarted = false;
        let currentScore = 0;
        let startTime = null;

        // Listen for messages from Game Hub
        window.addEventListener('message', (e) => {
            const data = e.data;

            // Handle INIT command (initialization)
            if (data && data.type === 'INIT') {
                console.log('[Your Game] Received INIT:', data.payload);

                // Store context if needed
                const context = data.payload;

                // Create host API
                irukaHost = {
                    // Tell Game Hub game is ready
                    ready: () => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'READY'
                        }, '*');
                    },

                    // Report score to Game Hub
                    reportScore: (score, delta) => {
                        currentScore = score;
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'SCORE_UPDATE',
                            payload: { score: score, delta: delta }
                        }, '*');
                    },

                    // Report progress
                    reportProgress: (progress) => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'PROGRESS',
                            payload: progress
                        }, '*');
                    },

                    // Notify game completion
                    complete: (data) => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'COMPLETE',
                            payload: data
                        }, '*');
                    },

                    // Report errors
                    error: (message) => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'ERROR',
                            payload: { message: message }
                        }, '*');
                    }
                };

                // Initialize your game
                initializeYourGame(context);

                // Tell Game Hub you're ready
                irukaHost.ready();
            }

            // Handle START command (begin gameplay)
            else if (data && data.type === 'START') {
                if (!gameStarted) {
                    startTime = Date.now();
                    startYourGame();
                    gameStarted = true;
                }
            }

            // Handle PAUSE command
            else if (data && data.type === 'PAUSE') {
                pauseYourGame();
            }

            // Handle RESUME command
            else if (data && data.type === 'RESUME') {
                resumeYourGame();
            }

            // Handle QUIT command
            else if (data && data.type === 'QUIT') {
                endYourGame();
            }
        });

        // ========================================
        // YOUR GAME FUNCTIONS
        // ========================================

        function initializeYourGame(context) {
            // Called when Game Hub sends INIT
            // context contains: playerId, sessionId, difficulty, etc.

            console.log('Initializing game with context:', context);

            // Example: Initialize Phaser game
            // const config = {
            //     type: Phaser.AUTO,
            //     width: window.innerWidth,
            //     height: window.innerHeight,
            //     parent: 'game-container',
            //     scene: GameScene
            // };
            // const game = new Phaser.Game(config);
        }

        function startYourGame() {
            // Called when START command received
            // Begin gameplay here

            console.log('Game started!');
        }

        function pauseYourGame() {
            // Handle pause
            console.log('Game paused');
        }

        function resumeYourGame() {
            // Handle resume
            console.log('Game resumed');
        }

        function updateScore(score) {
            // Call this whenever score changes
            if (irukaHost) {
                irukaHost.reportScore(score);
            }
        }

        function endYourGame() {
            // Calculate final results
            const timeMs = startTime ? Date.now() - startTime : 0;

            // Send complete event to Game Hub
            if (irukaHost) {
                irukaHost.complete({
                    score: currentScore,
                    timeMs: timeMs,
                    extras: {
                        // Add any additional data you want
                        // level: currentLevel,
                        // accuracy: playerAccuracy,
                        // etc.
                    }
                });
            }
        }
    </script>
</body>
</html>
```

---

#### Step 3: Register in Mock API

Edit `src/app/[locale]/api/game-hub/games/route.ts`:

```typescript
const MOCK_GAMES: GameManifest[] = [
  // ... existing games ...

  // Add your new game
  {
    id: 'your-game-id',
    slug: 'your-game-slug',
    title: 'Your Game Title',
    description: 'Description của game',
    version: '1.0.0',
    runtime: 'iframe-html', // ← Must be 'iframe-html'
    entryUrl: '/games/your-game-name/index.html', // ← Path to your HTML
    iconUrl: '/images/games/your-game.png', // Optional
    thumbnailUrl: '/images/games/your-game-thumb.png', // Optional
    capabilities: ['score', 'telemetry'], // What your game supports
    minHubVersion: '1.0.0',
    rolloutPercentage: 100,
    disabled: false,
    metadata: {
      difficulty: 'normal', // 'easy' | 'normal' | 'hard'
      estimatedTime: 5, // Minutes to complete
      category: 'action', // 'action' | 'puzzle' | 'educational' | etc.
    },
  },
];
```

---

#### Step 4: Done!

Your game will now appear in Game Hub at `http://localhost:3000/vi/game-hub`

---

## Method 2: ESM Module Game

**Use this method if**:
- Game được viết bằng React/TypeScript
- Bạn muốn native integration với Game Hub UI
- Game có complex UI interactions

---

### Step-by-Step Guide

#### Step 1: Create Game Folder

```bash
mkdir src/games/your-game-name
```

#### Step 2: Create React Component

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
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Tell Game Hub you're ready
    host.ready();
  }, []);

  function handleScoreUpdate(newScore: number) {
    setScore(newScore);
    host.reportScore(newScore);
  }

  function handleComplete() {
    host.complete({
      score: score,
      timeMs: Date.now() - startTime,
      extras: {},
    });
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: 'white' }}>Your Game</h1>
      <div style={{ color: 'white' }}>Score: {score}</div>
      {/* Your game UI here */}
    </div>
  );
}
```

#### Step 3: Create Adapter

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
      // Handle PAUSE, RESUME, QUIT commands
      switch (cmd.type) {
        case 'PAUSE':
          // Pause game
          break;
        case 'RESUME':
          // Resume game
          break;
        case 'QUIT':
          root.unmount();
          break;
      }
    },

    destroy: () => {
      // Cleanup
      root.unmount();
    },
  };
}
```

#### Step 4: Create API Route

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

#### Step 5: Register in API

```typescript
{
  id: 'your-game-id',
  runtime: 'esm-module',  // ← Must be 'esm-module'
  entryUrl: '/games/your-game-name/entry.js',  // ← API route
  // ... other fields
}
```

---

## Common Scenarios

### Scenario 1: Phaser.js Game

**Your files**:
```
public/games/phaser-game/
├── index.html
├── dist/
│   ├── game.bundle.js   # Built from Phaser
│   └── game.bundle.css
```

**index.html**:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
</head>
<body>
    <div id="game"></div>
    <script src="dist/game.bundle.js"></script>

    <script>
        let host = null;
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'INIT') {
                host = { ready, reportScore, complete };
                initPhaserGame();
                host.ready();
            }
        });

        function initPhaserGame() {
            // Your Phaser game code
            const config = {
                type: Phaser.AUTO,
                parent: 'game',
                width: 800,
                height: 600,
                scene: {
                    create: create,
                    update: update
                }
            };
            const game = new Phaser.Game(config);
        }
    </script>
</body>
</html>
```

---

### Scenario 2: Three.js Game

**index.html**:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js"></script>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script src="three-game.js"></script>

    <script>
        let host = null;
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'INIT') {
                host = { ready, reportScore, complete };
                initThreeGame();
                host.ready();
            }
        });

        function initThreeGame() {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
            const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
            // ... your Three.js code
        }
    </script>
</body>
</html>
```

---

### Scenario 3: Unity WebGL Build

**Unity export structure**:
```
public/games/unity-game/
├── index.html           # Unity-generated
├── Build/
│   ├── game.data
│   ├── game.framework.js
│   ├── game.loader.js
│   └── game.wasm
```

**Modify Unity's index.html** to add Iruka SDK:

```html
<!-- Unity's generated HTML -->
...

<script>
    // Add after Unity loader
    let host = null;
    window.addEventListener('message', (e) => {
        if (e.data?.type === 'INIT') {
            host = { ready, reportScore, complete };
            // Unity will call this when gameInstance is created
            window.initializeGame = () => {
                host.ready();
            };
        }
    });

    function ready() {
        window.parent.postMessage({
            sdkVersion: '1.0.0',
            source: 'game',
            type: 'READY'
        }, '*');
    }

    function reportScore(score) {
        window.parent.postMessage({
            sdkVersion: '1.0.0',
            source: 'game',
            type: 'SCORE_UPDATE',
            payload: { score }
        }, '*');
    }

    function complete(data) {
        window.parent.postMessage({
            sdkVersion: '1.0.0',
            source: 'game',
            type: 'COMPLETE',
            payload: data
        }, '*');
    }

    // Bridge to Unity
    window.sendScoreToHub = function(score) {
        if (host) host.reportScore(score);
    };
</script>
```

**In Unity C#**:
```csharp
public class ScoreManager : MonoBehaviour {
    void UpdateScore(int score) {
        Application.ExternalCall("sendScoreToHub", score);
    }
}
```

---

### Scenario 4: Simple HTML/CSS/JS Game

**public/games/simple-game/index.html**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Game</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
        }
        #game {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        button {
            padding: 10px 20px;
            font-size: 18px;
            border: none;
            background: #667eea;
            color: white;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="game">
        <h1>Simple Game</h1>
        <p>Score: <span id="score">0</span></p>
        <button onclick="incrementScore()">Click Me!</button>
    </div>

    <script>
        let score = 0;
        let host = null;

        window.addEventListener('message', (e) => {
            if (e.data?.type === 'INIT') {
                host = {
                    ready: () => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'READY'
                        }, '*');
                    },
                    reportScore: (s) => {
                        window.parent.postMessage({
                            sdkVersion: '1.0.0',
                            source: 'game',
                            type: 'SCORE_UPDATE',
                            payload: { score: s }
                        }, '*');
                    },
                    complete: (d) => {
                        window.parent.post prostaglandin
```

### Scenario 5: React Game (using external libs)

If you want to use React but with external game libraries:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { IrukaHost } from '@/lib/game-hub/protocol';

export default function ReactPhaserGame({ host, context }: YourGameProps) {
  const gameContainer = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    host.ready();

    if (gameContainer.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainer.current,
        width: 800,
        height: 600,
        scene: MyScene,
      };
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={gameContainer} style={{ width: '100%', height: '100%' }} />;
}
```

---

## Testing Your Game

### 1. Start Dev Server
```bash
pnpm dev
```

### 2. Open Game Hub
```
http://localhost:3000/vi/game-hub
```

### 3. Click Your Game

### 4. Check Console
- Look for `[Your Game] Received INIT` log
- Should see game load and send READY
- Score updates should appear in header

### 5. Test Complete Flow
1. Game loads ✅
2. Score updates when action happens ✅
3. Game sends COMPLETE when finished ✅
4. Results screen appears ✅

---

## Troubleshooting

### Game doesn't appear in list

**Check**:
- ✅ File added to `src/app/[locale]/api/game-hub/games/route.ts`
- ✅ `id` is unique
- ✅ `disabled: false`
- ✅ `entryUrl` path is correct

### Game loads but nothing happens

**Check**:
- ✅ `index.html` exists at path
- ✅ Iruka SDK code added
- ✅ `host.ready()` called
- ✅ Console for errors

### Score doesn't update

**Check**:
- ✅ `host.reportScore()` called with number
- ✅ Called after game started
- ✅ Check console for errors

### Game doesn't complete

**Check**:
- ✅ `host.complete()` called with proper data
- ✅ `score` and `timeMs` included
- ✅ No errors in console

---

## Quick Reference

### Required Events

**INIT** → Your game receives context
**START** → Begin gameplay
**READY** → Tell Game Hub ready
**SCORE_UPDATE** → Update score
**COMPLETE** → End game

### File Locations

**iframe games**: `public/games/your-game/`
**ESM games**: `src/games/your-game/`
**API registration**: `src/app/[locale]/api/game-hub/games/route.ts`

### Entry Point

**iframe**: `index.html` (in public folder)
**ESM**: `adapter.ts` exports `init()` function

---

## Need Help?

- **Examples**: Check `public/games/math-blitz/` for iframe example
- **ESM Example**: Check `src/games/memory-match-pro/`
- **Full Guide**: See `docs/game-hub/GAME_HUB_COMPLETE_GUIDE.md`

---

**Good luck creating your game! 🎮**
