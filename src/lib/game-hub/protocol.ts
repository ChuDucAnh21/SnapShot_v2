// Iruka Game SDK v1.0.0 - Protocol Types & Contracts
export const SDK_VERSION = '1.0.0';

export type Runtime = 'iframe-html' | 'esm-module';

export type Capability
  = | 'score'
    | 'progress'
    | 'levels'
    | 'hints'
    | 'save-progress'
    | 'audio'
    | 'leaderboard'
    | 'telemetry';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'adaptive';

/**
 * GameManifest - metadata từ BE, định nghĩa game, runtime, capabilities
 */
export type GameManifest = {
  id: string; // unique game ID
  slug?: string; // human-friendly slug
  title: string;
  description?: string;
  version: string; // semver
  runtime: Runtime;
  entryUrl: string; // iframe src hoặc ESM URL
  iconUrl?: string;
  thumbnailUrl?: string;
  width?: number; // gợi ý size khung (px)
  height?: number;
  capabilities?: Capability[];
  minHubVersion?: string;
  rolloutPercentage?: number; // 0..100
  disabled?: boolean;
  metadata?: Record<string, any>;
};

/**
 * LaunchContext - Hub gửi xuống game khi khởi tạo
 */
export type LaunchContext = {
  sdkVersion: string; // Hub gửi xuống để game có thể fallback
  playerId: string; // pseudonymous
  sessionId: string;
  gameId: string;
  locale: string; // "vi-VN" | "en-US"...
  difficulty?: Difficulty;
  seed?: number; // tái lập level
  launchToken: string; // JWT ≤ 15 phút, scope theo gameId
  profile?: Record<string, any>; // snapshot rút gọn (tuỳ chọn)
  sizeHint?: {
    width: number;
    height: number;
    devicePixelRatio?: number;
  };
};

/**
 * Message envelope cho postMessage protocol
 */
export type MsgEnvelope<T = any> = {
  sdkVersion: string; // phiên bản SDK của message
  source: 'hub' | 'game';
  type: string; // xem HostCommand / GameEvent
  payload?: T;
};

/**
 * HostCommand - Hub → Game commands
 */
export type HostCommand
  = | { type: 'INIT'; payload: LaunchContext }
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESUME' }
    | { type: 'QUIT' }
    | { type: 'SET_STATE'; payload: any }
    | { type: 'RESIZE'; payload: { width: number; height: number; dpr?: number } };

/**
 * GameEvent - Game → Hub events
 */
export type GameEvent
  = | { type: 'READY' }
    | { type: 'LOADING'; payload: { progress: number } }
    | { type: 'SCORE_UPDATE'; payload: { score: number; delta?: number } }
    | { type: 'PROGRESS'; payload: any }
    | {
      type: 'COMPLETE';
      payload: { score: number; timeMs: number; extras?: any };
    }
    | { type: 'ERROR'; payload: { message: string; detail?: any } }
    | { type: 'REQUEST_SAVE'; payload: any }
    | { type: 'REQUEST_LOAD' }
    | { type: 'TELEMETRY'; payload: any };

/**
 * IrukaHost - Interface cho ESM games để giao tiếp với Hub
 */
export type IrukaHost = {
  send: (cmd: HostCommand) => void; // gửi lệnh ngược về Hub
  ready: () => void; // thông báo READY
  loading: (p: number) => void; // 0..100
  reportScore: (score: number, delta?: number) => void;
  reportProgress: (data: any) => void;
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;
  error: (message: string, detail?: any) => void;
  requestSave: (data: any) => Promise<void>;
  requestLoad: () => Promise<any>;
  telemetry: (data: any) => void; // batch-friendly (host sẽ gom)
};

/**
 * IrukaGameInstance - Interface mà ESM game phải implement
 */
export type IrukaGameInstance = {
  onHostCommand: (cmd: HostCommand) => void; // PAUSE/RESUME/QUIT/RESIZE/SET_STATE
  destroy: () => void; // cleanup timers, listeners, WebGL
};

/**
 * Session data từ BE khi start game
 */
export type GameSession = {
  sessionId: string;
  launchToken: string;
  expiry: string; // ISO date
  playerId?: string;
};

/**
 * Progress data structure
 */
export type GameProgress = {
  gameId: string;
  sessionId: string;
  data: any;
  timestamp: string;
};

/**
 * Telemetry event
 */
export type TelemetryEvent = {
  t: number; // timestamp ms
  sid: string; // sessionId
  gid: string; // gameId
  ver: string; // game version
  evt: string; // event type
  payload?: any;
};

/**
 * Leaderboard entry
 */
export type LeaderboardEntry = {
  playerId: string;
  playerName?: string;
  score: number;
  rank: number;
  timestamp: string;
};
