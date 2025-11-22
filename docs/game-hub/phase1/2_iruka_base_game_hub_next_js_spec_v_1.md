# Iruka Base Game Hub — Next.js Spec v1.0
**Ngày:** 23/10/2025
**Phạm vi:** FE (Next.js 15, App Router) + giao thức Hub↔Game + FE↔BE
**Mục tiêu:** Cung cấp SPECs chi tiết để triển khai một **Base Game Hub** cho Iruka trên Next.js, hỗ trợ **hai runtime** mini‑game (`iframe-html`, `esm-module`), manifest‑driven, an toàn, dễ mở rộng.

---

## 0) Mục tiêu & Non‑Functional Requirements (NFR)
**Mục tiêu chính**
- Nhúng và vận hành mini‑game theo **manifest** từ BE, không build lại app.
- Hỗ trợ 2 runtime: `iframe-html` (sandbox) và `esm-module` (import module).
- Chuẩn hóa **protocol** Hub↔Game; chuẩn **API** FE↔BE (session, progress, telemetry, leaderboard).

**NFR**
- **Hiệu năng:** TTI trang Hub ≤ 2.5s (desktop), ≤ 4s (mobile); khởi chạy game ≤ 3s 95th pct (asset demo).
- **Bảo mật:** iFrame sandbox + origin allowlist; ESM chỉ tải từ domain tin cậy; CSP nghiêm; JWT ≤ 15′.
- **Khả dụng:** Pause khi `visibilitychange`; cleanup WebGL khi `QUIT`.
- **Khả mở rộng:** Manifest versioned; canary/rollout; A/B theo %/seed.
- **Observability:** Telemetry batch; error reporting; dashboard phân tách Hub vs Game.

---

## 1) Kiến trúc & Luồng
**Thành phần**
- **FE Hub (Next.js 15):** UI danh sách game, loader runtime, GameBridge, Telemetry/Progress services.
- **BE Iruka:** Cấp `GET /games`, `POST /sessions/start`, `progress`, `telemetry`, `leaderboard`.
- **Mini‑game:** chạy dưới 1 trong 2 runtime, tuân SDK/Protocol.

**Luồng chính**
1) Hub gọi **`GET /games`** → nhận `GameManifest[]`.
2) Người dùng chọn game → Hub gọi **`POST /sessions/start { gameId }`** → nhận `sessionId`, `launchToken`.
3) Hub mount game theo `runtime`:
   - `iframe-html`: tạo `<iframe>` + `sandbox`, handshake `INIT→START` qua `postMessage`.
   - `esm-module`: `import(entryUrl)` → `init(container, ctx, host)`.
4) Game phát sự kiện (`READY`, `SCORE_UPDATE`, `COMPLETE`, `REQUEST_SAVE`…) → Hub xử lý & gọi BE.

---

## 2) Thư mục & File cấu trúc (đề xuất)
```
src/
  app/
    games/
      page.tsx                 # danh sách & launcher
    api/
      proxy/
        games/route.ts         # proxy GET /games → BE
        sessions/start/route.ts# proxy POST /sessions/start → BE
        progress/[gameId]/save/route.ts
        progress/[gameId]/load/route.ts
        telemetry/batch/route.ts
        leaderboard/[gameId]/route.ts
  components/game/
    GameList.tsx               # grid cards
    GameLauncher.tsx           # chọn game + tạo session
    GameStage.tsx              # vùng mount game
  lib/game/
    protocol.ts                # types, contracts
    bridge.ts                  # GameBridge (iFrame & ESM)
    security.ts                # origin allowlist, CSP helpers
    telemetry.ts               # batcher, queue, retry
    progress.ts                # save/load helpers
    utils.ts                   # misc: uuid, time, guards
  stores/
    session.ts                 # Zustand store cho phiên chơi
  styles/
    game.css
next.config.mjs
middleware.ts                 # CSP headers (nếu áp dụng)
.env                          # API_BASE_URL, ALLOW_ORIGINS, ...
```

---

## 3) Types & Contracts (trích yếu)
```ts
// src/lib/game/protocol.ts
export type Runtime = 'iframe-html' | 'esm-module';
export type Capability = 'score' | 'progress' | 'levels' | 'hints' | 'save-progress' | 'audio' | 'leaderboard' | 'telemetry';

export type GameManifest = {
  id: string;
  slug?: string;
  title: string;
  version: string;
  runtime: Runtime;
  entryUrl: string;
  iconUrl?: string;
  width?: number;
  height?: number;
  capabilities?: Capability[];
  minHubVersion?: string;
  rolloutPercentage?: number;
  disabled?: boolean;
  metadata?: Record<string, any>;
};

export type LaunchContext = {
  sdkVersion: string;
  playerId: string;
  sessionId: string;
  gameId: string;
  locale: string;
  difficulty?: 'easy' | 'normal' | 'hard' | 'adaptive';
  seed?: number;
  launchToken: string;
  profile?: Record<string, any>;
  sizeHint?: { width: number; height: number; devicePixelRatio?: number };
};

export type HostCommand
  = | { type: 'INIT'; payload: LaunchContext }
    | { type: 'START' } | { type: 'PAUSE' } | { type: 'RESUME' } | { type: 'QUIT' }
    | { type: 'SET_STATE'; payload: any } | { type: 'RESIZE'; payload: { width: number; height: number; dpr?: number } };

export type GameEvent
  = | { type: 'READY' } | { type: 'LOADING'; payload: { progress: number } }
    | { type: 'SCORE_UPDATE'; payload: { score: number; delta?: number } }
    | { type: 'PROGRESS'; payload: any } | { type: 'COMPLETE'; payload: { score: number; timeMs: number; extras?: any } }
    | { type: 'ERROR'; payload: { message: string; detail?: any } }
    | { type: 'REQUEST_SAVE'; payload: any } | { type: 'REQUEST_LOAD' } | { type: 'TELEMETRY'; payload: any };
```

**JSON Schema manifest (rút gọn)** — dùng để validate ở BE/FE.
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "title", "version", "runtime", "entryUrl"],
  "properties": {
    "id": { "type": "string" },
    "slug": { "type": "string" },
    "title": { "type": "string" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "runtime": { "type": "string", "enum": ["iframe-html", "esm-module"] },
    "entryUrl": { "type": "string", "format": "uri" },
    "iconUrl": { "type": "string", "format": "uri" },
    "width": { "type": "number" },
    "height": { "type": "number" },
    "capabilities": { "type": "array", "items": { "type": "string" } },
    "minHubVersion": { "type": "string" },
    "rolloutPercentage": { "type": "number", "minimum": 0, "maximum": 100 },
    "disabled": { "type": "boolean" },
    "metadata": { "type": "object" }
  }
}
```

---

## 4) GameBridge (cốt lõi nhúng iFrame/ESM)
```ts
// src/lib/game/bridge.ts
import type { GameEvent, GameManifest, HostCommand, LaunchContext } from './protocol';

export class GameBridge {
  private iframe?: HTMLIFrameElement; private moduleApi?: any; private disposeFns: Array<() => void> = [];
  constructor(private manifest: GameManifest, private ctx: LaunchContext) {}

  mount(container: HTMLElement) {
    return this.manifest.runtime === 'iframe-html' ? this.mountIframe(container) : this.mountEsm(container);
  }

  dispose() {
    this.disposeFns.forEach(fn => fn()); this.disposeFns = []; this.iframe?.remove(); if (this.moduleApi?.destroy) {
      this.moduleApi.destroy();
    }
  }

  // —— iFrame ——
  private async mountIframe(container: HTMLElement) {
    const f = document.createElement('iframe');
    f.src = this.manifest.entryUrl; f.style.border = '0'; f.allow = 'fullscreen; gamepad';
    f.sandbox.add('allow-scripts', 'allow-pointer-lock'); // thêm quyền tối thiểu; cân nhắc remove allow-same-origin
    container.replaceChildren(f); this.iframe = f;

    const onMsg = (e: MessageEvent) => {
      /* TODO: check e.origin against allowlist */ this.handleGameEvent(e.data as GameEvent);
    };
    window.addEventListener('message', onMsg); this.disposeFns.push(() => window.removeEventListener('message', onMsg));

    const onLoad = () => {
      this.post({ type: 'INIT', payload: this.ctx }); this.post({ type: 'START' });
    };
    f.addEventListener('load', onLoad); this.disposeFns.push(() => f.removeEventListener('load', onLoad));
  }

  private async mountEsm(container: HTMLElement) {
    const mod = await import(/* webpackIgnore: true */ this.manifest.entryUrl);
    const host = this.hostApi();
    this.moduleApi = await mod.init(container, this.ctx, host);
  }

  post(cmd: HostCommand) {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage({ source: 'hub', ...cmd }, '*');
    } else if (this.moduleApi?.onHostCommand) {
      this.moduleApi.onHostCommand(cmd);
    }
  }

  private handleGameEvent(evt: GameEvent) { /* Route lên store/telemetry tuỳ use-case */ }

  private hostApi() {
    return {
      send: (cmd: HostCommand) => this.post(cmd),
      ready: () => { /* no-op in host */ },
      loading: (p: number) => { /* optional */ },
      reportScore: (score: number, delta?: number) => { /* ... */ },
      reportProgress: (d: any) => { /* ... */ },
      complete: (d: any) => { /* ... */ },
      error: (m: string, detail?: any) => { /* ... */ },
      requestSave: async (d: any) => { /* call FE→BE */ },
      requestLoad: async () => { /* call FE→BE */ },
      telemetry: (d: any) => { /* batch */ },
    };
  }
}
```

---

## 5) FE↔BE API (chuẩn)
**Route proxy (Next.js)** dùng `process.env.API_BASE_URL` gọi BE.
- `GET /api/proxy/games` → BE `/games?platform=web`
- `POST /api/proxy/sessions/start` → BE `/sessions/start`
- `POST /api/proxy/progress/[gameId]/save`
- `GET /api/proxy/progress/[gameId]/load`
- `POST /api/proxy/telemetry/batch`
- `GET /api/proxy/leaderboard/[gameId]`

**OpenAPI (trích yếu)**
```yaml
paths:
  /games:
    get:
      parameters: [{name: platform, in: query, schema: {type: string, enum: [web]}}]
      responses: {'200': {description: OK, content: {application/json: {schema: {type: array, items: {$ref: '#/components/schemas/GameManifest'}}}}}}
  /sessions/start:
    post:
      requestBody: {required: true, content: {application/json: {schema: {type: object, properties: {gameId: {type: string}}, required: [gameId]}}}}
      responses: {'200': {description: OK, content: {application/json: {schema: {type: object, properties: {sessionId: {type:string}, launchToken: {type:string}, expiry: {type:string, format:date-time}}}}}}}
```

---

## 6) UI Components (tối thiểu)
```tsx
// src/components/game/GameList.tsx
export function GameList({ games, onLaunch }: { games: GameManifest[]; onLaunch: (g: GameManifest) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {games.map(g => (
        <button key={g.id} onClick={() => onLaunch(g)} className="p-3 rounded-xl shadow bg-white">
          <img src={g.iconUrl ?? '/icon-placeholder.png'} alt="" className="w-12 h-12" />
          <div className="mt-2 font-medium">{g.title}</div>
          <div className="text-xs text-gray-500">
            {g.runtime}
            {' '}
            • v
            {g.version}
          </div>
        </button>
      ))}
    </div>
  );
}
```

```tsx
// src/components/game/GameStage.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { GameBridge } from '@/lib/game/bridge';

export function GameStage({ manifest, ctx }: { manifest: GameManifest; ctx: LaunchContext }) {
  const ref = useRef<HTMLDivElement>(null); const [bridge, setBridge] = useState<GameBridge>();
  useEffect(() => {
    if (!ref.current) {
      return;
    } bridge?.dispose(); const b = new GameBridge(manifest, ctx); b.mount(ref.current); setBridge(b); return () => b.dispose();
  }, [manifest?.id, ctx?.sessionId]);
  return <div ref={ref} className="w-full h-[600px] bg-black/5 rounded-xl overflow-hidden" />;
}
```

---

## 7) Trang Hub (Next.js App Router)
```tsx
// src/app/games/page.tsx
'use client';
import type { GameManifest, LaunchContext } from '@/lib/game/protocol';
import { useEffect, useRef, useState } from 'react';
import { GameList } from '@/components/game/GameList';
import { GameStage } from '@/components/game/GameStage';

export default function GameHubPage() {
  const [games, setGames] = useState<GameManifest[]>([]);
  const [current, setCurrent] = useState<GameManifest | undefined>();
  const [ctx, setCtx] = useState<LaunchContext | undefined>();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/proxy/games'); setGames(await res.json());
    })();
  }, []);

  async function launch(g: GameManifest) {
    const r = await fetch('/api/proxy/sessions/start', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ gameId: g.id }) });
    const s = await r.json();
    const _ctx: LaunchContext = { sdkVersion: '1.0.0', playerId: 'u123', sessionId: s.sessionId, gameId: g.id, locale: 'vi-VN', launchToken: s.launchToken };
    setCurrent(g); setCtx(_ctx);
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1"><GameList games={games} onLaunch={launch} /></div>
      <div className="col-span-3">{current && ctx ? <GameStage manifest={current} ctx={ctx} /> : <div className="p-6 text-gray-500">Chọn một game để bắt đầu</div>}</div>
    </div>
  );
}
```

---

## 8) Telemetry & Progress (batching)
```ts
// src/lib/game/telemetry.ts
const queue: any[] = []; let timer: any = null; const FLUSH_EVERY_MS = 8000; const MAX_BATCH = 50;
export function push(evt: any) {
  queue.push({ t: Date.now(), ...evt }); if (queue.length >= MAX_BATCH) {
    flush();
  } if (!timer) {
    timer = setTimeout(flush, FLUSH_EVERY_MS);
  }
}
export async function flush() {
  if (!queue.length) {
    return;
  } const batch = queue.splice(0, MAX_BATCH); clearTimeout(timer); timer = null; try {
    await fetch('/api/proxy/telemetry/batch', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ events: batch }) });
  } catch { /* retry policy */ }
}
```

```ts
// src/lib/game/progress.ts
export async function save(gameId: string, sessionId: string, data: any) {
  await fetch(`/api/proxy/progress/${gameId}/save`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sessionId, data }) });
}
export async function load(gameId: string, sessionId: string) {
  const r = await fetch(`/api/proxy/progress/${gameId}/load?sessionId=${encodeURIComponent(sessionId)}`); return await r.json();
}
```

---

## 9) Bảo mật
**CSP (gợi ý)**
- `default-src 'self'; frame-src https://cdn.iruka.games https://*.trusted-domain.tld; script-src 'self' 'unsafe-inline' https://cdn.iruka.games; connect-src 'self' https://api.iruka.tld; img-src 'self' data: https://cdn.iruka.games; style-src 'self' 'unsafe-inline';`
  (Điều chỉnh theo domains thực tế; ESM cần `script-src` cho entryUrl.)

**iFrame sandbox**
- Tối thiểu: `allow-scripts allow-pointer-lock` (+ `allow-fullscreen` nếu cần).
- **Không** bật `allow-same-origin` trừ khi game cần; nếu bật, kiểm soát origin chặt chẽ.

**Origin check**
- Khi nhận `message` từ iFrame: xác thực `e.origin` ∈ allowlist suy ra từ `manifest.entryUrl` (origin).

**JWT**
- `launchToken` TTL ≤ 15′; scope theo `gameId` + `sessionId`.

---

## 10) ENV & cấu hình
```
# .env
API_BASE_URL=https://api.iruka.tld
ALLOWED_GAME_ORIGINS=https://cdn.iruka.games,https://games.iruka.tld
```

**next.config.mjs** — relay headers, CSP nếu set qua middleware.

---

## 11) Middleware (tùy chọn) — CSP Headers
```ts
// middleware.ts (optional)
import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', 'default-src \'self\'; frame-src https://cdn.iruka.games; script-src \'self\' https://cdn.iruka.games; connect-src \'self\' https://api.iruka.tld; img-src \'self\' data: https://cdn.iruka.games; style-src \'self\' \'unsafe-inline\'');
  return res;
}
```

---

## 12) Trải nghiệm người dùng (UX tối thiểu)
- **Auto‑pause** khi tab ẩn (`visibilitychange`) → gửi `PAUSE` đến game.
- **Letterboxing**: giữ aspect‑ratio (16:9/4:3), tránh méo asset.
- **Loading**: hiển thị trạng thái `LOADING` từ game, spinner + progress.
- **Quit**: nút thoát xác nhận; gọi `QUIT` → chờ `COMPLETE` (timeout 1.5s) → điều hướng.

---

## 13) Testing & QA Gates
**Contract tests (Playwright)**
- Trường hợp iFrame: inject Hub page, mount iFrame mock game, assert nhận `READY` ≤ 3s; gửi `START` → nhận `SCORE_UPDATE`; gửi `QUIT` → nhận `COMPLETE`.
- Trường hợp ESM: mock module export `init`; assert lifecycle `onHostCommand`, `destroy`.

**Chaos tests**
- Token hết hạn (BE trả 401) → Hub hiển thị toast + retry xin session mới.
- Mất mạng khi telemetry → batch lưu queue, retry backoff.
- Resize mạnh (đổi orientation) → `RESIZE` liên tục không làm drop FPS.

**Performance budgets**
- Hub bundle ≤ 300KB gz (không tính UI lib).
- ESM game demo ≤ 200KB gz (không tính assets) — chỉ mục tiêu tham khảo.

---

## 14) Lộ trình triển khai
- **P0 (1–2 tuần):** Manifest + iFrame runtime + session start + protocol core (INIT/READY/START/COMPLETE) + UI tối thiểu.
- **P1 (2–3 tuần):** ESM runtime + progress + telemetry batch + pause/resume + CSP.
- **P2 (2 tuần):** Leaderboard + canary rollout + PWA precache top games + Playwright CI.

---

## 15) Mẫu Manifest & Harness Dev
**manifest.json (ví dụ)**
```json
{
  "id": "drag-drop-1",
  "title": "Kéo thả vào vị trí đúng",
  "version": "1.2.0",
  "runtime": "iframe-html",
  "entryUrl": "https://cdn.iruka.games/drag-drop-1/index.html",
  "iconUrl": "https://cdn.iruka.games/drag-drop-1/icon.png",
  "capabilities": ["score", "save-progress"],
  "minHubVersion": "1.0.0",
  "rolloutPercentage": 100,
  "disabled": false
}
```

**Harness (ý tưởng nhanh)**
- Trang `/dev/harness` cho phép: nhập `entryUrl`, chọn `runtime`, gửi lệnh `INIT/START/PAUSE/RESUME/QUIT/RESIZE`, log tất cả message để dev tự test trước khi bàn giao.

---

## 16) Quy tắc MUST/SHOULD cho mini‑game
- **MUST**: gởi `READY` ≤ 3s sau `INIT`; phát `COMPLETE/ERROR` khi kết thúc; respect `PAUSE/RESUME/RESIZE`.
- **MUST**: không gửi PII; telemetry đúng schema; batch/throttle.
- **SHOULD**: hỗ trợ `REQUEST_SAVE/LOAD`; expose `difficulty`/`seed`; cleanup tài nguyên khi `QUIT`/`destroy`.

---

## 17) Rủi ro & Giảm thiểu
- **ESM ảnh hưởng host** → chỉ cho code nội bộ đã audit; CSP nghiêm; e2e lifecycle.
- **Overhead iFrame** → dùng CDN chung libs; prefetch; lazy load; hạn chế số iFrame đồng thời.
- **Protocol drift** → publish `@iruka/game-sdk` + JSON Schema; CI contract tests.

---

## 18) Ghi chú triển khai thực tế
- Khi cần `SharedArrayBuffer/OffscreenCanvas`, xem xét COOP/COEP/cross‑origin isolation; ưu tiên ESM cùng origin.
- Audio policy trên mobile: trigger bởi user gesture; Hub nên cấp nút “Unmute”.
- Localization: `locale` trong `LaunchContext` + font fallback (VI/JP/EN…).

---

**Kết thúc Spec v1.0 — sẵn sàng implement.**
