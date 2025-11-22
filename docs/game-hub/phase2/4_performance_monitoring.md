# Phase 2.4 - Performance Monitoring & Analytics

## 📊 Overview

Track key metrics để optimize performance và understand user behavior.

---

## 1. Performance Metrics

### Core Web Vitals

**Metrics to track**:
- **LCP** (Largest Contentful Paint): ≤ 2.5s
- **FID** (First Input Delay): ≤ 100ms
- **CLS** (Cumulative Layout Shift): ≤ 0.1
- **TTI** (Time to Interactive): ≤ 3.5s
- **FPS** (Frames Per Second): ≥ 30fps (target 60fps)

---

### Game-Specific Metrics

```typescript
type GamePerformanceMetrics = {
  gameId: string;
  sessionId: string;

  // Load metrics
  loadStartTime: number;
  loadEndTime: number;
  loadDuration: number; // ms

  // Runtime metrics
  averageFPS: number;
  minFPS: number;
  maxFPS: number;

  // Interaction metrics
  averageInputLatency: number; // ms
  maxInputLatency: number;

  // Network metrics
  apiCalls: number;
  failedApiCalls: number;
  averageApiLatency: number;

  // Memory
  peakMemoryUsage: number; // MB
  averageMemoryUsage: number;

  // Errors
  errorCount: number;
  warningCount: number;
};
```

---

## 2. Performance Monitor Class

```typescript
// src/lib/game-hub/performance-monitor.ts

export class PerformanceMonitor {
  private gameId: string;
  private sessionId: string;
  private metrics: Partial<GamePerformanceMetrics>;
  private fpsHistory: number[] = [];
  private frameCount = 0;
  private lastFrameTime = performance.now();

  constructor(gameId: string, sessionId: string) {
    this.gameId = gameId;
    this.sessionId = sessionId;
    this.metrics = {
      gameId,
      sessionId,
      loadStartTime: performance.now(),
    };
  }

  // Track load time
  markLoadComplete() {
    this.metrics.loadEndTime = performance.now();
    this.metrics.loadDuration
      = this.metrics.loadEndTime - this.metrics.loadStartTime!;

    console.log(`Game loaded in ${this.metrics.loadDuration}ms`);
  }

  // Track FPS
  measureFPS() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    const fps = 1000 / delta;
    this.fpsHistory.push(fps);

    // Keep last 60 frames (1 second at 60fps)
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    this.frameCount++;

    // Update stats every second
    if (this.frameCount % 60 === 0) {
      this.updateFPSMetrics();
    }

    requestAnimationFrame(() => this.measureFPS());
  }

  private updateFPSMetrics() {
    if (this.fpsHistory.length === 0) {
      return;
    }

    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    this.metrics.averageFPS = sum / this.fpsHistory.length;
    this.metrics.minFPS = Math.min(...this.fpsHistory);
    this.metrics.maxFPS = Math.max(...this.fpsHistory);
  }

  // Track input latency
  measureInputLatency(inputTime: number, responseTime: number) {
    const latency = responseTime - inputTime;

    if (!this.metrics.averageInputLatency) {
      this.metrics.averageInputLatency = latency;
      this.metrics.maxInputLatency = latency;
    } else {
      // Running average
      this.metrics.averageInputLatency
        = (this.metrics.averageInputLatency + latency) / 2;
      this.metrics.maxInputLatency = Math.max(
        this.metrics.maxInputLatency,
        latency
      );
    }
  }

  // Track memory
  measureMemory() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usageMB = memory.usedJSHeapSize / (1024 * 1024);

      if (!this.metrics.peakMemoryUsage) {
        this.metrics.peakMemoryUsage = usageMB;
        this.metrics.averageMemoryUsage = usageMB;
      } else {
        this.metrics.peakMemoryUsage = Math.max(
          this.metrics.peakMemoryUsage,
          usageMB
        );
        this.metrics.averageMemoryUsage
          = (this.metrics.averageMemoryUsage + usageMB) / 2;
      }
    }
  }

  // Track errors
  recordError(error: Error) {
    this.metrics.errorCount = (this.metrics.errorCount || 0) + 1;
    console.error('Game error:', error);
  }

  recordWarning(warning: string) {
    this.metrics.warningCount = (this.metrics.warningCount || 0) + 1;
    console.warn('Game warning:', warning);
  }

  // Get report
  getReport(): GamePerformanceMetrics {
    return this.metrics as GamePerformanceMetrics;
  }

  // Send to analytics
  async sendReport() {
    try {
      await fetch('/api/game-hub/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.getReport()),
      });
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  // Start monitoring
  start() {
    this.measureFPS();

    // Measure memory every 5 seconds
    setInterval(() => this.measureMemory(), 5000);
  }

  // Stop monitoring and send report
  stop() {
    this.sendReport();
  }
}
```

---

## 3. Usage in GameBridge

```typescript
// src/lib/game-hub/bridge.ts

export class GameBridge {
  private performanceMonitor?: PerformanceMonitor;

  async mount(container: HTMLElement): Promise<void> {
    const { manifest, context } = this.options;

    // Start performance monitoring
    this.performanceMonitor = new PerformanceMonitor(
      manifest.id,
      context.sessionId
    );
    this.performanceMonitor.start();

    // ... existing mount logic

    // Mark load complete when ready
    if (manifest.runtime === 'iframe-html') {
      await this.mountIframe(container);
    } else {
      await this.mountEsm(container);
    }

    this.performanceMonitor.markLoadComplete();
  }

  dispose(): void {
    // Stop monitoring and send report
    this.performanceMonitor?.stop();

    // ... existing cleanup
  }

  // Track input latency
  post(cmd: HostCommand): void {
    const inputTime = performance.now();

    // ... send command

    // Measure response time
    requestAnimationFrame(() => {
      const responseTime = performance.now();
      this.performanceMonitor?.measureInputLatency(inputTime, responseTime);
    });
  }
}
```

---

## 4. Analytics Events

### Event Types

```typescript
type AnalyticsEvent = {
  type: 'game_start' | 'game_complete' | 'game_quit' | 'game_error' | 'game_pause' | 'game_resume';
  gameId: string;
  sessionId: string;
  playerId: string;
  timestamp: string;
  data?: Record<string, any>;
};
```

### Track Events

```typescript
// src/lib/game-hub/analytics.ts

export class Analytics {
  static track(event: AnalyticsEvent) {
    // Send to analytics service
    fetch('/api/game-hub/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch((err) => {
      console.error('Failed to track event:', err);
    });

    // Also log to console in dev
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.type, event);
    }
  }

  static trackGameStart(gameId: string, sessionId: string, playerId: string) {
    this.track({
      type: 'game_start',
      gameId,
      sessionId,
      playerId,
      timestamp: new Date().toISOString(),
    });
  }

  static trackGameComplete(
    gameId: string,
    sessionId: string,
    playerId: string,
    data: { score: number; timeMs: number }
  ) {
    this.track({
      type: 'game_complete',
      gameId,
      sessionId,
      playerId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  static trackGameQuit(gameId: string, sessionId: string, playerId: string) {
    this.track({
      type: 'game_quit',
      gameId,
      sessionId,
      playerId,
      timestamp: new Date().toISOString(),
    });
  }

  static trackGameError(
    gameId: string,
    sessionId: string,
    playerId: string,
    error: Error
  ) {
    this.track({
      type: 'game_error',
      gameId,
      sessionId,
      playerId,
      timestamp: new Date().toISOString(),
      data: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}
```

---

## 5. Analytics API Routes

### POST /api/game-hub/analytics/performance

```typescript
// src/app/[locale]/api/game-hub/analytics/performance/route.ts

export async function POST(request: NextRequest) {
  const metrics: GamePerformanceMetrics = await request.json();

  try {
    // TODO: Store in database
    console.log('Performance metrics:', metrics);

    // Check for performance issues
    if (metrics.averageFPS < 30) {
      console.warn(`Low FPS detected for ${metrics.gameId}: ${metrics.averageFPS}`);
    }

    if (metrics.loadDuration > 5000) {
      console.warn(`Slow load time for ${metrics.gameId}: ${metrics.loadDuration}ms`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to save metrics' },
      { status: 500 }
    );
  }
}
```

### POST /api/game-hub/analytics/events

```typescript
// src/app/[locale]/api/game-hub/analytics/events/route.ts

export async function POST(request: NextRequest) {
  const event: AnalyticsEvent = await request.json();

  try {
    // TODO: Store in database or send to analytics service
    console.log('Analytics event:', event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
```

---

## 6. Analytics Dashboard (Optional)

### Dashboard Page

```tsx
// src/app/[locale]/(admin)/game-hub-analytics/page.tsx

export default function GameHubAnalyticsPage() {
  const { data: stats } = useAnalyticsStats();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Game Hub Analytics</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Games"
          value={stats?.totalGames}
          icon={Gamepad2}
        />
        <StatCard
          title="Total Sessions"
          value={stats?.totalSessions}
          icon={Users}
        />
        <StatCard
          title="Avg Session Time"
          value={formatDuration(stats?.avgSessionTime)}
          icon={Clock}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate}%`}
          icon={CheckCircle}
        />
      </div>

      {/* Performance Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Average FPS by Game</CardTitle>
        </CardHeader>
        <CardContent>
          <FPSChart data={stats?.fpsByGame} />
        </CardContent>
      </Card>

      {/* Popular Games */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Most Played Games</CardTitle>
        </CardHeader>
        <CardContent>
          <PopularGamesTable data={stats?.popularGames} />
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorLogTable data={stats?.recentErrors} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 7. Real User Monitoring (RUM)

### Web Vitals Integration

```typescript
// src/lib/game-hub/web-vitals.ts

import { onCLS, onFID, onINP, onLCP, onTTFB } from 'web-vitals';

export function initWebVitals() {
  onCLS((metric) => {
    Analytics.track({
      type: 'web_vital',
      metric: 'CLS',
      value: metric.value,
      rating: metric.rating,
    });
  });

  onFID((metric) => {
    Analytics.track({
      type: 'web_vital',
      metric: 'FID',
      value: metric.value,
      rating: metric.rating,
    });
  });

  onLCP((metric) => {
    Analytics.track({
      type: 'web_vital',
      metric: 'LCP',
      value: metric.value,
      rating: metric.rating,
    });
  });

  onTTFB((metric) => {
    Analytics.track({
      type: 'web_vital',
      metric: 'TTFB',
      value: metric.value,
      rating: metric.rating,
    });
  });

  onINP((metric) => {
    Analytics.track({
      type: 'web_vital',
      metric: 'INP',
      value: metric.value,
      rating: metric.rating,
    });
  });
}

// Initialize in _app or layout
initWebVitals();
```

---

## 8. Performance Budgets

### Define Budgets

```typescript
// src/lib/game-hub/performance-budgets.ts

export const PERFORMANCE_BUDGETS = {
  // Load time
  maxLoadTime: 3000, // ms
  maxTTI: 3500, // ms

  // Runtime
  minFPS: 30,
  targetFPS: 60,
  maxInputLatency: 100, // ms

  // Network
  maxApiLatency: 500, // ms
  maxFailedApiCalls: 3,

  // Memory
  maxMemoryUsage: 50, // MB

  // Bundle size
  maxJSBundleSize: 200, // KB
  maxCSSBundleSize: 50, // KB
};

export function checkBudget(
  metrics: GamePerformanceMetrics
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  if (metrics.loadDuration > PERFORMANCE_BUDGETS.maxLoadTime) {
    violations.push(
      `Load time ${metrics.loadDuration}ms exceeds budget ${PERFORMANCE_BUDGETS.maxLoadTime}ms`
    );
  }

  if (metrics.averageFPS < PERFORMANCE_BUDGETS.minFPS) {
    violations.push(
      `Average FPS ${metrics.averageFPS} below minimum ${PERFORMANCE_BUDGETS.minFPS}`
    );
  }

  if (metrics.averageInputLatency > PERFORMANCE_BUDGETS.maxInputLatency) {
    violations.push(
      `Input latency ${metrics.averageInputLatency}ms exceeds budget ${PERFORMANCE_BUDGETS.maxInputLatency}ms`
    );
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}
```

---

## 9. Error Tracking

### Error Boundary

```tsx
// src/components/game-hub/game-error-boundary.tsx

export class GameErrorBoundary extends React.Component<
  { children: React.ReactNode; gameId: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    Analytics.trackGameError(
      this.props.gameId,
      'unknown', // sessionId
      'unknown', // playerId
      error
    );

    console.error('Game error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            The game encountered an error. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 10. Implementation Checklist

### Phase 2.4.1 - Performance Monitoring
- [ ] Create `PerformanceMonitor` class
- [ ] Integrate with `GameBridge`
- [ ] Track FPS, load time, input latency
- [ ] Track memory usage
- [ ] Send performance reports

### Phase 2.4.2 - Analytics
- [ ] Create `Analytics` class
- [ ] Track game events (start, complete, quit, error)
- [ ] Create API routes for analytics
- [ ] Store events in database

### Phase 2.4.3 - Web Vitals
- [ ] Install `web-vitals` package
- [ ] Track CLS, FID, LCP, TTFB, INP
- [ ] Send to analytics

### Phase 2.4.4 - Dashboard (Optional)
- [ ] Create analytics dashboard page
- [ ] Show overview stats
- [ ] Show performance charts
- [ ] Show error logs
- [ ] Show popular games

### Phase 2.4.5 - Error Tracking
- [ ] Create `GameErrorBoundary`
- [ ] Track JS errors
- [ ] Track API errors
- [ ] Show user-friendly error messages

---

**Next**: [5_dev_harness.md](./5_dev_harness.md)
