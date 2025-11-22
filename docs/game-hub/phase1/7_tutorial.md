## File cho Game Developers: `@iruka/game-sdk`

```typescript
// @iruka/game-sdk/types.ts

/**
 * Iruka Game SDK v1.0.0
 * Type definitions và interfaces cho game developers
 */

export const SDK_VERSION = '1.0.0';

// ============================================================================
// ENUMS & TYPES
// ============================================================================

/**
 * Runtime type - game sẽ chạy trong môi trường nào
 */
export type Runtime = 'iframe-html' | 'esm-module';

/**
 * Game capabilities - những tính năng mà game hỗ trợ
 */
export type Capability
  = | 'score' // Game có điểm số
    | 'progress' // Game có tiến độ
    | 'levels' // Game có nhiều levels
    | 'hints' // Game có hệ thống gợi ý
    | 'save-progress' // Game có thể lưu tiến độ
    | 'audio' // Game có âm thanh
    | 'leaderboard' // Game có bảng xếp hạng
    | 'telemetry'; // Game gửi analytics

/**
 * Difficulty levels
 */
export type Difficulty = 'easy' | 'normal' | 'hard' | 'adaptive';

// ============================================================================
// LAUNCH CONTEXT - Hub gửi cho Game khi khởi tạo
// ============================================================================

/**
 * LaunchContext - Thông tin game nhận từ Hub khi khởi động
 */
export type LaunchContext = {
  /** SDK version của Hub */
  sdkVersion: string;

  /** Player ID (pseudonymous) - KHÔNG phải thông tin cá nhân */
  playerId: string;

  /** Session ID của phiên chơi này */
  sessionId: string;

  /** Game ID */
  gameId: string;

  /** Ngôn ngữ: "vi-VN", "en-US", etc. */
  locale: string;

  /** Độ khó (optional) */
  difficulty?: Difficulty;

  /** Seed để tái lập level (optional) */
  seed?: number;

  /** JWT token để gọi API (TTL ≤ 15 phút) */
  launchToken: string;

  /** Profile data rút gọn (optional) */
  profile?: Record<string, any>;

  /** Gợi ý kích thước màn hình */
  sizeHint?: {
    width: number;
    height: number;
    devicePixelRatio?: number;
  };
};

// ============================================================================
// COMMANDS - Hub gửi cho Game
// ============================================================================

/**
 * Commands từ Hub → Game
 */
export type HostCommand
  /** Khởi tạo game với context */
  = | { type: 'INIT'; payload: LaunchContext }

  /** Bắt đầu game */
    | { type: 'START' }

  /** Tạm dừng game */
    | { type: 'PAUSE' }

  /** Tiếp tục game */
    | { type: 'RESUME' }

  /** Thoát game (game phải gửi COMPLETE) */
    | { type: 'QUIT' }

  /** Set state (restore saved progress) */
    | { type: 'SET_STATE'; payload: any }

  /** Resize game viewport */
    | { type: 'RESIZE'; payload: { width: number; height: number; dpr?: number } };

// ============================================================================
// EVENTS - Game gửi cho Hub
// ============================================================================

/**
 * Events từ Game → Hub
 */
export type GameEvent
  /** Game đã sẵn sàng (MUST gửi ≤ 3s sau INIT) */
  = | { type: 'READY' }

  /** Đang tải assets */
    | { type: 'LOADING'; payload: { progress: number } } // 0-100

  /** Cập nhật điểm */
    | { type: 'SCORE_UPDATE'; payload: { score: number; delta?: number } }

  /** Cập nhật tiến độ */
    | { type: 'PROGRESS'; payload: any }

  /** Hoàn thành game (MUST gửi khi kết thúc) */
    | { type: 'COMPLETE'; payload: { score: number; timeMs: number; extras?: any } }

  /** Lỗi xảy ra */
    | { type: 'ERROR'; payload: { message: string; detail?: any } }

  /** Yêu cầu lưu progress */
    | { type: 'REQUEST_SAVE'; payload: any }

  /** Yêu cầu load progress */
    | { type: 'REQUEST_LOAD' }

  /** Gửi telemetry/analytics */
    | { type: 'TELEMETRY'; payload: any };

// ============================================================================
// MESSAGE ENVELOPE - Format cho postMessage
// ============================================================================

/**
 * Message envelope cho postMessage protocol
 */
export type MsgEnvelope<T = any> = {
  sdkVersion: string;
  source: 'hub' | 'game';
  type: string;
  payload?: T;
};

// ============================================================================
// IFRAME GAME SDK
// ============================================================================

/**
 * Command handler cho iframe game
 */
export type CommandHandler = (cmd: HostCommand) => void;

/**
 * Options cho iframe bridge
 */
export type IframeBridgeOptions = {
  /** Handler để nhận commands từ Hub */
  onCommand: CommandHandler;

  /** Target origin của Hub (production nên set chính xác) */
  targetOrigin?: string; // Default: '*'
};

/**
 * Iframe Bridge API - Interface mà game sẽ dùng
 */
export type IframeBridge = {
  /** Cleanup listeners */
  dispose: () => void;

  /** Báo Hub là game đã READY */
  ready: () => void;

  /** Báo tiến độ loading (0-100) */
  loading: (progress: number) => void;

  /** Báo cáo điểm số */
  reportScore: (score: number, delta?: number) => void;

  /** Báo cáo tiến độ */
  reportProgress: (data: any) => void;

  /** Hoàn thành game */
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;

  /** Báo lỗi */
  error: (message: string, detail?: any) => void;

  /** Yêu cầu lưu progress */
  requestSave: (data: any) => void;

  /** Yêu cầu load progress */
  requestLoad: () => void;

  /** Gửi telemetry */
  telemetry: (data: any) => void;
};

// ============================================================================
// ESM GAME SDK
// ============================================================================

/**
 * Host API - Interface mà ESM game nhận từ Hub
 */
export type IrukaHost = {
  /** Gửi command ngược về Hub */
  send: (cmd: HostCommand) => void;

  /** Báo Hub là game đã READY */
  ready: () => void;

  /** Báo tiến độ loading (0-100) */
  loading: (p: number) => void;

  /** Báo cáo điểm số */
  reportScore: (score: number, delta?: number) => void;

  /** Báo cáo tiến độ */
  reportProgress: (data: any) => void;

  /** Hoàn thành game */
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;

  /** Báo lỗi */
  error: (message: string, detail?: any) => void;

  /** Yêu cầu lưu progress */
  requestSave: (data: any) => Promise<void>;

  /** Yêu cầu load progress */
  requestLoad: () => Promise<any>;

  /** Gửi telemetry */
  telemetry: (data: any) => void;
};

/**
 * Game Instance - Interface mà ESM game phải implement
 */
export type IrukaGameInstance = {
  /** Handler để nhận commands từ Hub */
  onHostCommand: (cmd: HostCommand) => void;

  /** Cleanup function (MUST implement) */
  destroy: () => void;
};

/**
 * ESM Game Init Function - Function mà game phải export
 */
export type GameInitFunction = (
  container: HTMLElement,
  context: LaunchContext,
  host: IrukaHost
) => Promise<IrukaGameInstance>;

// ============================================================================
// GAME MANIFEST - BE sẽ cung cấp
// ============================================================================

/**
 * Game Manifest - Metadata của game (do BE quản lý)
 */
export type GameManifest = {
  /** Unique game ID */
  id: string;

  /** Human-friendly slug */
  slug?: string;

  /** Tên game */
  title: string;

  /** Mô tả game */
  description?: string;

  /** SemVer version */
  version: string;

  /** Runtime type */
  runtime: Runtime;

  /** URL entry point (iframe src hoặc ESM module URL) */
  entryUrl: string;

  /** Icon URL */
  iconUrl?: string;

  /** Thumbnail URL */
  thumbnailUrl?: string;

  /** Gợi ý kích thước (px) */
  width?: number;
  height?: number;

  /** Capabilities game hỗ trợ */
  capabilities?: Capability[];

  /** Minimum Hub version yêu cầu */
  minHubVersion?: string;

  /** Rollout percentage (0-100) */
  rolloutPercentage?: number;

  /** Có disabled không */
  disabled?: boolean;

  /** Custom metadata */
  metadata?: Record<string, any>;
};

// ============================================================================
// TELEMETRY - Events format
// ============================================================================

/**
 * Telemetry Event - Format chuẩn cho analytics
 */
export type TelemetryEvent = {
  /** Timestamp (ms) */
  t: number;

  /** Session ID */
  sid: string;

  /** Game ID */
  gid: string;

  /** Game version */
  ver: string;

  /** Event type */
  evt: string;

  /** Event payload */
  payload?: any;
};

/**
 * Common telemetry event types
 */
export type TelemetryEventType
  = | 'session_start'
    | 'session_end'
    | 'level_start'
    | 'level_complete'
    | 'level_fail'
    | 'score_update'
    | 'mistake'
    | 'hint_used'
    | 'quit'
    | 'fps_snapshot'
    | 'error'
    | 'custom';

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Game State - Common state structure
 */
export type GameState = {
  score: number;
  level: number;
  lives?: number;
  timeElapsed: number;
  [key: string]: any;
};

/**
 * Progress Data - Structure cho save/load
 */
export type ProgressData = {
  gameId: string;
  sessionId: string;
  data: any;
  timestamp: string;
};
```

## Usage Examples cho Developers:

### 1. **iFrame Game Example:**

```typescript
import type { IframeBridge, LaunchContext } from '@iruka/game-sdk';
// game.html
import {
  createIframeBridge

} from '@iruka/game-sdk';

let bridge: IframeBridge;
let ctx: LaunchContext | null = null;
const gameState = {
  score: 0,
  level: 1,
  startTime: 0
};

// Initialize bridge
bridge = createIframeBridge({
  onCommand(cmd) {
    switch (cmd.type) {
      case 'INIT':
        ctx = cmd.payload;
        console.log('Game initialized:', ctx);
        bridge.ready();
        break;

      case 'START':
        gameState.startTime = performance.now();
        startGame();
        break;

      case 'PAUSE':
        pauseGame();
        break;

      case 'RESUME':
        resumeGame();
        break;

      case 'QUIT':
        const timeMs = performance.now() - gameState.startTime;
        bridge.complete({
          score: gameState.score,
          timeMs,
          extras: { level: gameState.level }
        });
        break;

      case 'RESIZE':
        handleResize(cmd.payload.width, cmd.payload.height);
        break;
    }
  }
});

// Report score changes
function updateScore(delta: number) {
  gameState.score += delta;
  bridge.reportScore(gameState.score, delta);
}

// Save progress
function saveProgress() {
  bridge.requestSave(gameState);
}

// Send telemetry
function trackEvent(eventType: string, data: any) {
  bridge.telemetry({
    event: eventType,
    data
  });
}
```

### 2. **ESM Game Example:**

```typescript
// entry.ts
import type {
  IrukaGameInstance,
  IrukaHost,
  LaunchContext
} from '@iruka/game-sdk';

export async function init(
  container: HTMLElement,
  ctx: LaunchContext,
  host: IrukaHost
): Promise<IrukaGameInstance> {
  let running = false;
  const gameState = {
    score: 0,
    level: 1,
    startTime: 0
  };

  // Create UI
  const root = createGameUI(container);

  // Notify ready
  host.ready();

  // Game functions
  function startGame() {
    running = true;
    gameState.startTime = performance.now();
  }

  function updateScore(delta: number) {
    gameState.score += delta;
    host.reportScore(gameState.score, delta);
  }

  async function saveProgress() {
    await host.requestSave(gameState);
  }

  // Return game instance
  return {
    onHostCommand(cmd) {
      switch (cmd.type) {
        case 'START':
          startGame();
          break;
        case 'PAUSE':
          running = false;
          break;
        case 'RESUME':
          running = true;
          break;
        case 'QUIT':
          const timeMs = performance.now() - gameState.startTime;
          host.complete({
            score: gameState.score,
            timeMs
          });
          break;
      }
    },

    destroy() {
      // Cleanup
      running = false;
      root.remove();
    }
  };
}
```

### 3. **Package.json cho Game:**

```json
{
  "name": "my-iruka-game",
  "version": "1.0.0",
  "dependencies": {
    "@iruka/game-sdk": "^1.0.0"
  }
}
```
