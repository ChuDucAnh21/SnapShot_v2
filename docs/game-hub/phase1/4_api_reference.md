# Game Hub API Reference

## FE API Routes

### GET /api/game-hub/games

Lấy danh sách games khả dụng.

**Query Parameters:**
- `platform` (optional): `web` | `mobile` (default: `web`)

**Response:**

```typescript
GameManifest[] // Array of game manifests
```

**Example:**

```typescript
const response = await fetch('/api/game-hub/games?platform=web');
const games = await response.json();
```

---

### POST /api/game-hub/sessions/start

Khởi tạo game session mới.

**Request Body:**

```typescript
{
  gameId: string;
}
```

**Response:**

```typescript
{
  sessionId: string;
  launchToken: string;
  expiry: string; // ISO date
  playerId?: string;
}
```

**Example:**

```typescript
const response = await fetch('/api/game-hub/sessions/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ gameId: 'math-puzzle-1' }),
});
const session = await response.json();
```

---

### POST /api/game-hub/sessions/[id]/finish

Kết thúc game session.

**Path Parameters:**
- `id`: Session ID

**Request Body:**

```typescript
{
  score: number;
  timeMs: number;
  progress?: any;
}
```

**Response:**

```typescript
{
  success: boolean;
  sessionId: string;
  score: number;
  timeMs: number;
}
```

---

### POST /api/game-hub/progress/[gameId]/save

Lưu game progress.

**Path Parameters:**
- `gameId`: Game ID

**Request Body:**

```typescript
{
  sessionId: string;
  data: any; // Progress data
  timestamp?: string; // ISO date
}
```

**Response:**

```typescript
{
  success: boolean;
  gameId: string;
  sessionId: string;
  timestamp: string;
}
```

---

### GET /api/game-hub/progress/[gameId]/load

Load game progress.

**Path Parameters:**
- `gameId`: Game ID

**Query Parameters:**
- `sessionId`: Session ID

**Response:**

```typescript
{
  gameId: string;
  sessionId: string;
  data: any; // Progress data
  timestamp: string;
}
```

**Error (404):**

```typescript
{
  error: 'No saved progress found';
}
```

---

### POST /api/game-hub/telemetry/batch

Gửi batch telemetry events.

**Request Body:**

```typescript
{
  events: TelemetryEvent[];
}

// TelemetryEvent
{
  t: number;        // timestamp ms
  sid: string;      // sessionId
  gid: string;      // gameId
  ver: string;      // game version
  evt: string;      // event type
  payload?: any;    // event data
}
```

**Response:**

```typescript
{
  success: boolean;
  processed: number; // Number of events processed
}
```

---

### GET /api/game-hub/leaderboard/[gameId]

Lấy leaderboard cho game.

**Path Parameters:**
- `gameId`: Game ID

**Query Parameters:**
- `period` (optional): `daily` | `weekly` | `monthly` | `all-time` (default: `weekly`)

**Response:**

```typescript
{
  gameId: string;
  period: string;
  entries: LeaderboardEntry[];
  updatedAt: string;
}

// LeaderboardEntry
{
  playerId: string;
  playerName?: string;
  score: number;
  rank: number;
  timestamp: string;
}
```

---

## SDK API (Game → Hub)

### createIframeBridge(options)

Tạo bridge cho iframe game.

**Parameters:**

```typescript
{
  onCommand: (cmd: HostCommand) => void;
  targetOrigin?: string; // Hub origin
}
```

**Returns:** `IframeBridge`

**Methods:**

```typescript
type IframeBridge = {
  dispose: () => void;
  ready: () => void;
  loading: (progress: number) => void;
  reportScore: (score: number, delta?: number) => void;
  reportProgress: (data: any) => void;
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;
  error: (message: string, detail?: any) => void;
  requestSave: (data: any) => void;
  requestLoad: () => void;
  telemetry: (data: any) => void;
};
```

---

### init(container, ctx, host)

ESM game initialization function.

**Parameters:**

```typescript
container: HTMLElement; // Container element
ctx: LaunchContext; // Launch context from hub
host: IrukaHost; // Host API
```

**Returns:** `Promise<IrukaGameInstance>`

**IrukaGameInstance:**

```typescript
type IrukaGameInstance = {
  onHostCommand: (cmd: HostCommand) => void;
  destroy: () => void;
};
```

**IrukaHost Methods:**

```typescript
type IrukaHost = {
  send: (cmd: HostCommand) => void;
  ready: () => void;
  loading: (p: number) => void;
  reportScore: (score: number, delta?: number) => void;
  reportProgress: (data: any) => void;
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;
  error: (message: string, detail?: any) => void;
  requestSave: (data: any) => Promise<void>;
  requestLoad: () => Promise<any>;
  telemetry: (data: any) => void;
};
```

---

## Types Reference

### GameManifest

```typescript
type GameManifest = {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  version: string; // SemVer
  runtime: 'iframe-html' | 'esm-module';
  entryUrl: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  capabilities?: Capability[];
  minHubVersion?: string;
  rolloutPercentage?: number; // 0-100
  disabled?: boolean;
  metadata?: Record<string, any>;
};
```

### LaunchContext

```typescript
type LaunchContext = {
  sdkVersion: string;
  playerId: string;
  sessionId: string;
  gameId: string;
  locale: string;
  difficulty?: 'easy' | 'normal' | 'hard' | 'adaptive';
  seed?: number;
  launchToken: string;
  profile?: Record<string, any>;
  sizeHint?: {
    width: number;
    height: number;
    devicePixelRatio?: number;
  };
};
```

### HostCommand (Hub → Game)

```typescript
type HostCommand
  = | { type: 'INIT'; payload: LaunchContext }
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESUME' }
    | { type: 'QUIT' }
    | { type: 'SET_STATE'; payload: any }
    | { type: 'RESIZE'; payload: { width: number; height: number; dpr?: number } };
```

### GameEvent (Game → Hub)

```typescript
type GameEvent
  = | { type: 'READY' }
    | { type: 'LOADING'; payload: { progress: number } }
    | { type: 'SCORE_UPDATE'; payload: { score: number; delta?: number } }
    | { type: 'PROGRESS'; payload: any }
    | { type: 'COMPLETE'; payload: { score: number; timeMs: number; extras?: any } }
    | { type: 'ERROR'; payload: { message: string; detail?: any } }
    | { type: 'REQUEST_SAVE'; payload: any }
    | { type: 'REQUEST_LOAD' }
    | { type: 'TELEMETRY'; payload: any };
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid or expired token |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Rate Limits

- **Telemetry**: Max 50 events per batch, 8s interval
- **Progress Save**: Max 1 request per second per session
- **API calls**: Max 100 requests per minute per user

---

## Versioning

API version: `v1`

SDK version: `1.0.0`

Breaking changes will increment major version.
