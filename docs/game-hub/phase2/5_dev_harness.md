# Phase 2.5 - Developer Harness & Playground

## 🛠️ Overview

Công cụ để game developers dễ dàng test và debug games trong môi trường sandbox.

---

## 1. Game Playground Page

### Purpose

- Test games mà không cần deploy
- Mock different contexts (devices, locales, difficulties)
- View events và messages realtime
- Profile performance
- Debug telemetry

---

### Page Structure

```
┌─────────────────────────────────────────────────────────┐
│  🎮 Game Playground                          [Settings] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐  ┌──────────────────────────────┐  │
│  │  Control Panel │  │                              │  │
│  │                │  │                              │  │
│  │ [Game Select]  │  │      Game Stage              │  │
│  │ [Runtime]      │  │                              │  │
│  │ [Difficulty]   │  │                              │  │
│  │ [Locale]       │  │                              │  │
│  │                │  │                              │  │
│  │ [▶️ Launch]    │  │                              │  │
│  │ [⏸️ Pause]     │  │                              │  │
│  │ [🔄 Restart]   │  │                              │  │
│  │ [⏹️ Stop]      │  │                              │  │
│  │                │  │                              │  │
│  └────────────────┘  └──────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Event Logger                 [Clear] [Export]   │  │
│  │  ──────────────────────────────────────────────  │  │
│  │  > READY { ts: 123456 }                          │  │
│  │  > SCORE_UPDATE { score: 100, delta: 10 }       │  │
│  │  > PROGRESS { level: 2 }                         │  │
│  │  > COMPLETE { score: 500, timeMs: 60000 }       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Implementation

### Route

```typescript
// src/app/[locale]/(dev)/game-playground/page.tsx

'use client';

import { useState } from 'react';
import { GameStage } from '@/components/game-hub/game-stage';
import { DevControls } from './components/dev-controls';
import { EventLogger } from './components/event-logger';
import { ContextMocker } from './components/context-mocker';
import type { GameManifest, LaunchContext, GameEvent } from '@/lib/game-hub/protocol';

export default function GamePlaygroundPage() {
  const [selectedGame, setSelectedGame] = useState<GameManifest | null>(null);
  const [launchContext, setLaunchContext] = useState<LaunchContext | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleLaunch = (game: GameManifest, context: LaunchContext) => {
    setSelectedGame(game);
    setLaunchContext(context);
    setIsRunning(true);
    setEvents([]);
  };

  const handleEvent = (event: GameEvent) => {
    setEvents(prev => [...prev, { ...event, timestamp: Date.now() }]);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSelectedGame(null);
    setLaunchContext(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">🎮 Game Playground</h1>
          <p className="text-sm text-gray-600">
            Test và debug games trong môi trường sandbox
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Control Panel */}
          <div className="col-span-3">
            <DevControls
              onLaunch={handleLaunch}
              onStop={handleStop}
              isRunning={isRunning}
            />
          </div>

          {/* Game Stage */}
          <div className="col-span-9">
            {isRunning && selectedGame && launchContext ? (
              <div className="bg-white rounded-lg shadow-lg p-4 h-[600px]">
                <GameStage
                  manifest={selectedGame}
                  context={launchContext}
                  onEvent={handleEvent}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Gamepad2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a game and click Launch to start testing</p>
                </div>
              </div>
            )}
          </div>

          {/* Event Logger */}
          <div className="col-span-12">
            <EventLogger events={events} />
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## 3. Dev Controls Component

```typescript
// src/app/[locale]/(dev)/game-playground/components/dev-controls.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GameManifest, LaunchContext, Difficulty } from '@/lib/game-hub/protocol';
import { SDK_VERSION } from '@/lib/game-hub/protocol';

interface DevControlsProps {
  onLaunch: (game: GameManifest, context: LaunchContext) => void;
  onStop: () => void;
  isRunning: boolean;
}

export function DevControls({ onLaunch, onStop, isRunning }: DevControlsProps) {
  const [games, setGames] = useState<GameManifest[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [locale, setLocale] = useState('vi-VN');
  const [customEntryUrl, setCustomEntryUrl] = useState('');

  // Load games
  useEffect(() => {
    fetch('/api/game-hub/games')
      .then(res => res.json())
      .then(setGames);
  }, []);

  const handleLaunch = () => {
    const game = games.find(g => g.id === selectedGameId);
    if (!game) return;

    // Allow custom entry URL for testing
    const gameToLaunch = customEntryUrl
      ? { ...game, entryUrl: customEntryUrl }
      : game;

    const context: LaunchContext = {
      sdkVersion: SDK_VERSION,
      playerId: 'dev-player',
      sessionId: `dev-session-${Date.now()}`,
      gameId: game.id,
      locale,
      difficulty,
      seed: Math.floor(Math.random() * 1000000),
      launchToken: 'dev-token',
      sizeHint: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
    };

    onLaunch(gameToLaunch, context);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-bold mb-4">Control Panel</h2>

      {/* Game Selection */}
      <div>
        <Label>Select Game</Label>
        <Select
          value={selectedGameId}
          onValueChange={setSelectedGameId}
          disabled={isRunning}
        >
          <option value="">-- Choose a game --</option>
          {games.map(game => (
            <option key={game.id} value={game.id}>
              {game.title} ({game.runtime})
            </option>
          ))}
        </Select>
      </div>

      {/* Custom Entry URL */}
      <div>
        <Label>Custom Entry URL (Optional)</Label>
        <Input
          value={customEntryUrl}
          onChange={e => setCustomEntryUrl(e.target.value)}
          placeholder="http://localhost:3000/my-game.html"
          disabled={isRunning}
        />
        <p className="text-xs text-gray-500 mt-1">
          For testing local games
        </p>
      </div>

      {/* Difficulty */}
      <div>
        <Label>Difficulty</Label>
        <Select
          value={difficulty}
          onValueChange={setDifficulty as any}
          disabled={isRunning}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="adaptive">Adaptive</option>
        </Select>
      </div>

      {/* Locale */}
      <div>
        <Label>Locale</Label>
        <Select
          value={locale}
          onValueChange={setLocale}
          disabled={isRunning}
        >
          <option value="vi-VN">🇻🇳 Tiếng Việt</option>
          <option value="en-US">🇺🇸 English</option>
          <option value="fr-FR">🇫🇷 Français</option>
        </Select>
      </div>

      {/* Actions */}
      <div className="pt-4 space-y-2">
        {!isRunning ? (
          <Button
            onClick={handleLaunch}
            disabled={!selectedGameId}
            className="w-full"
          >
            ▶️ Launch Game
          </Button>
        ) : (
          <>
            <Button onClick={onStop} variant="destructive" className="w-full">
              ⏹️ Stop Game
            </Button>
          </>
        )}
      </div>

      {/* Device Simulation */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-2">Device Simulation</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.resizeTo(375, 667)}
          >
            📱 iPhone SE
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.resizeTo(768, 1024)}
          >
            📱 iPad
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.resizeTo(1920, 1080)}
          >
            🖥️ Desktop
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Event Logger Component

```typescript
// src/app/[locale]/(dev)/game-playground/components/event-logger.tsx

'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import type { GameEvent } from '@/lib/game-hub/protocol';

interface EventLoggerProps {
  events: Array<GameEvent & { timestamp: number }>;
}

export function EventLogger({ events }: EventLoggerProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `events-${Date.now()}.json`);
    link.click();
  };

  const handleClear = () => {
    // Implement via parent
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Event Logger</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={events.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={events.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div
        ref={logRef}
        className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded h-64 overflow-y-auto"
      >
        {events.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No events yet. Launch a game to see events.
          </div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="mb-1">
              <span className="text-gray-500">
                [{new Date(event.timestamp).toLocaleTimeString()}]
              </span>
              <span className="text-yellow-400 ml-2">{event.type}</span>
              <span className="text-green-400 ml-2">
                {JSON.stringify(event.payload || {})}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-600">
        Total events: {events.length}
      </div>
    </div>
  );
}
```

---

## 5. Context Mocker

```typescript
// src/app/[locale]/(dev)/game-playground/components/context-mocker.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { LaunchContext } from '@/lib/game-hub/protocol';

interface ContextMockerProps {
  onChange: (context: Partial<LaunchContext>) => void;
}

export function ContextMocker({ onChange }: ContextMockerProps) {
  const [contextJson, setContextJson] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    try {
      const context = JSON.parse(contextJson);
      onChange(context);
      setError('');
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold mb-4">Custom Context</h2>

      <Textarea
        value={contextJson}
        onChange={e => setContextJson(e.target.value)}
        placeholder={`{\n  "difficulty": "hard",\n  "seed": 12345\n}`}
        rows={10}
        className="font-mono text-sm"
      />

      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}

      <Button onClick={handleApply} className="mt-4 w-full">
        Apply Custom Context
      </Button>
    </div>
  );
}
```

---

## 6. Performance Profiler

```typescript
// src/app/[locale]/(dev)/game-playground/components/performance-profiler.tsx

'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

interface PerformanceProfilerProps {
  gameId: string;
  sessionId: string;
}

export function PerformanceProfiler({ gameId, sessionId }: PerformanceProfilerProps) {
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      const fps = 1000 / delta;

      setFpsHistory(prev => [...prev.slice(-59), fps]);

      // Measure memory if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usageMB = memory.usedJSHeapSize / (1024 * 1024);
        setMemoryHistory(prev => [...prev.slice(-59), usageMB]);
      }

      lastTime = now;
      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }, []);

  const fpsData = {
    labels: fpsHistory.map((_, i) => i),
    datasets: [
      {
        label: 'FPS',
        data: fpsHistory,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold mb-4">Performance Profiler</h2>

      {/* FPS Chart */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">FPS (Frames Per Second)</h3>
        <Line data={fpsData} options={{ animation: false }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold">
            {Math.round(fpsHistory[fpsHistory.length - 1] || 0)}
          </div>
          <div className="text-sm text-gray-600">Current FPS</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length || 0)}
          </div>
          <div className="text-sm text-gray-600">Avg FPS</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {memoryHistory.length > 0
              ? Math.round(memoryHistory[memoryHistory.length - 1])
              : 0}
          </div>
          <div className="text-sm text-gray-600">Memory (MB)</div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Network Inspector

```typescript
// src/app/[locale]/(dev)/game-playground/components/network-inspector.tsx

'use client';

import { useState, useEffect } from 'react';

interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: number;
}

export function NetworkInspector() {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const response = await originalFetch(...args);
      const endTime = performance.now();

      setRequests(prev => [
        ...prev,
        {
          url: args[0].toString(),
          method: args[1]?.method || 'GET',
          status: response.status,
          duration: endTime - startTime,
          timestamp: Date.now(),
        },
      ]);

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold mb-4">Network Inspector</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Method</th>
              <th className="text-left p-2">URL</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono">{req.method}</td>
                <td className="p-2 truncate max-w-xs">{req.url}</td>
                <td className="p-2">
                  <span
                    className={
                      req.status >= 200 && req.status < 300
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {req.status}
                  </span>
                </td>
                <td className="p-2">{Math.round(req.duration)}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 8. Implementation Checklist

### Phase 2.5.1 - Basic Playground
- [ ] Create playground page route
- [ ] Create `DevControls` component
- [ ] Create `EventLogger` component
- [ ] Implement game launching
- [ ] Add export functionality

### Phase 2.5.2 - Advanced Features
- [ ] Create `ContextMocker` component
- [ ] Create `PerformanceProfiler` component
- [ ] Create `NetworkInspector` component
- [ ] Add device simulation
- [ ] Add custom entry URL support

### Phase 2.5.3 - Documentation
- [ ] Write dev harness guide
- [ ] Create video tutorial
- [ ] Add troubleshooting tips

---

**Next**: [6_demo_checklist.md](./6_demo_checklist.md)
