# Iruka Game SDK v1 — Interfaces, Contracts & Templates
**Mục tiêu:** Định nghĩa **interface/contract** chuẩn để đội dev mini‑game tự phát triển và **plug‑in** vào Base Game Hub của Iruka một cách nhất quán, an toàn, dễ kiểm thử.

---

## 0) Triết lý thiết kế
- **Tối thiểu đủ dùng**: có **bắt buộc (MUST)** và **tùy chọn (SHOULD/MAY)**.
- **Versioned**: mọi message có `sdkVersion`. SemVer cho game/hub.
- **An toàn**: iFrame sandbox, origin check; ESM chỉ cho code tin cậy.
- **Dễ test**: có host giả lập (Harness) cho iFrame & ESM.

---

## 1) Kiến trúc runtime hỗ trợ
- `iframe-html`: Game chạy tách biệt, giao tiếp với Hub qua `postMessage`.
- `esm-module`: Game export `init(container, ctx, host)`; Hub `import()` và gắn vào DOM.

> Game có thể chọn một trong hai; “core games” nội bộ khuyến khích `esm-module` để tối ưu size/hiệu năng.

---

## 2) Types & Contracts (TypeScript)

```ts
// sdk/types.ts
export const SDK_VERSION = '1.0.0';

export type Runtime = 'iframe-html' | 'esm-module';

export type Capability
  = | 'score' | 'progress' | 'levels' | 'hints' | 'save-progress' | 'audio' | 'leaderboard' | 'telemetry';

export type GameManifest = {
  id: string; // unique
  slug: string; // human friendly
  title: string;
  version: string; // semver
  runtime: Runtime;
  entryUrl: string; // iframe src hoặc ESM URL
  iconUrl?: string;
  width?: number; // gợi ý size khung (px)
  height?: number;
  capabilities?: Capability[];
  minHubVersion?: string;
  rolloutPercentage?: number; // 0..100
  disabled?: boolean;
  metadata?: Record<string, any>;
};

export type LaunchContext = {
  sdkVersion: string; // Hub gửi xuống để game có thể fallback
  playerId: string; // pseudonymous
  sessionId: string;
  gameId: string;
  locale: string; // "vi-VN" | "en-US"...
  difficulty?: 'easy' | 'normal' | 'hard' | 'adaptive';
  seed?: number; // tái lập level
  launchToken: string; // JWT ≤ 15 phút, scope theo gameId
  profile?: Record<string, any>; // snapshot rút gọn (tuỳ chọn)
  sizeHint?: { width: number; height: number; devicePixelRatio?: number };
};

// —— Message envelope ——
export type MsgEnvelope<T = any> = {
  sdkVersion: string; // phiên bản SDK của message
  source: 'hub' | 'game';
  type: string; // xem HostCommand / GameEvent
  payload?: T;
};

// —— Hub → Game ——
export type HostCommand
  = | { type: 'INIT'; payload: LaunchContext }
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESUME' }
    | { type: 'QUIT' }
    | { type: 'SET_STATE'; payload: any }
    | { type: 'RESIZE'; payload: { width: number; height: number; dpr?: number } };

// —— Game → Hub ——
export type GameEvent
  = | { type: 'READY' }
    | { type: 'LOADING'; payload: { progress: number } }
    | { type: 'SCORE_UPDATE'; payload: { score: number; delta?: number } }
    | { type: 'PROGRESS'; payload: any }
    | { type: 'COMPLETE'; payload: { score: number; timeMs: number; extras?: any } }
    | { type: 'ERROR'; payload: { message: string; detail?: any } }
    | { type: 'REQUEST_SAVE'; payload: any }
    | { type: 'REQUEST_LOAD' }
    | { type: 'TELEMETRY'; payload: any };

// —— ESM host interface ——
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

export type IrukaGameInstance = {
  onHostCommand: (cmd: HostCommand) => void; // PAUSE/RESUME/QUIT/RESIZE/SET_STATE
  destroy: () => void; // cleanup timers, listeners, WebGL
};
```

---

## 3) SDK cho **iFrame game** (game chạy trong HTML)

```ts
// sdk/iframe-game.ts
import { GameEvent, HostCommand, MsgEnvelope, SDK_VERSION } from './types';

export type CommandHandler = (cmd: HostCommand) => void;

export function createIframeBridge(opts: { onCommand: CommandHandler; targetOrigin?: string }): any {
  const origin = opts.targetOrigin ?? '*'; // PROD: nên truyền exact origin của Hub

  function post(evt: GameEvent) {
    const msg: MsgEnvelope = { sdkVersion: SDK_VERSION, source: 'game', type: evt.type, payload: (evt as any).payload };
    window.parent?.postMessage(msg, origin);
  }

  function onMessage(e: MessageEvent) {
    const data = e.data as MsgEnvelope;
    if (!data || data.source !== 'hub' || !data.type) {
      return;
    }
    // PROD: kiểm tra e.origin === originWhitelist
    const cmd = { type: data.type, payload: data.payload } as HostCommand;
    opts.onCommand(cmd);
  }

  window.addEventListener('message', onMessage);

  // tiện ích để game gọi
  return {
    dispose() {
      window.removeEventListener('message', onMessage);
    },
    ready() {
      post({ type: 'READY' });
    },
    loading(progress: number) {
      post({ type: 'LOADING', payload: { progress } });
    },
    reportScore(score: number, delta?: number) {
      post({ type: 'SCORE_UPDATE', payload: { score, delta } });
    },
    reportProgress(data: any) {
      post({ type: 'PROGRESS', payload: data });
    },
    complete(data: { score: number; timeMs: number; extras?: any }) {
      post({ type: 'COMPLETE', payload: data });
    },
    error(message: string, detail?: any) {
      post({ type: 'ERROR', payload: { message, detail } });
    },
    requestSave(data: any) {
      post({ type: 'REQUEST_SAVE', payload: data });
    },
    requestLoad() {
      post({ type: 'REQUEST_LOAD' });
    },
    telemetry(data: any) {
      post({ type: 'TELEMETRY', payload: data });
    },
  };
}
```

**Skeleton iFrame game (index.html + script):**
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Iruka iFrame Game — Template</title>
  <style>html,body,#root{height:100%;margin:0} #root{display:grid;place-items:center}</style>
</head>
<body>
  <div id="root">Loading…</div>
  <script type="module">
    import { createIframeBridge } from '/sdk/iframe-game.js';

    let ctx = null; // LaunchContext sẽ nhận qua INIT
    let running = false, startTs = 0, score = 0;

    const hub = createIframeBridge({
      onCommand(cmd){
        if (cmd.type === 'INIT') { ctx = cmd.payload; hub.ready(); }
        if (cmd.type === 'START') { running = true; startTs = performance.now(); tick(); }
        if (cmd.type === 'PAUSE') { running = false; }
        if (cmd.type === 'RESUME') { running = true; tick(); }
        if (cmd.type === 'QUIT') { running = false; hub.complete({ score, timeMs: performance.now()-startTs }); }
        if (cmd.type === 'RESIZE') { /* optional: adjust canvas */ }
      }
    });

    function tick(){ if(!running) return; score++; hub.reportScore(score, +1); requestAnimationFrame(tick); }

    // UI demo click tăng score
    document.getElementById('root').addEventListener('click', ()=>{ score += 10; hub.reportScore(score, +10); });
  </script>
</body>
</html>
```

**Yêu cầu bắt buộc (iFrame):**
- **MUST** gửi `READY` ≤ 3s sau khi nhận `INIT`.
- **MUST** gửi `COMPLETE` hoặc `ERROR` khi kết thúc phiên.
- **MUST** dọn dẹp listener khi unload (tuỳ Hub, thường Hub sẽ dispose iFrame).

---

## 4) SDK cho **ESM game** (game export init)

```ts
// sdk/esm-game.ts
import { HostCommand, IrukaGameInstance, IrukaHost, MsgEnvelope, SDK_VERSION } from './types';

export function createHost(channel: MessageChannel['port1'] | Window): IrukaHost {
  // Ở thực tế, Hub sẽ tiêm 1 host object trực tiếp; phiên bản dưới là demo giao thức message
  function post(type: string, payload?: any) {
    const msg: MsgEnvelope = { sdkVersion: SDK_VERSION, source: 'game', type, payload };
    (channel as any).postMessage ? (channel as any).postMessage(msg) : (channel as Window).parent?.postMessage(msg, '*');
  }
  return {
    send(cmd) {
      post(cmd.type, cmd.payload);
    },
    ready() {
      post('READY');
    },
    loading(p) {
      post('LOADING', { progress: p });
    },
    reportScore(s, d) {
      post('SCORE_UPDATE', { score: s, delta: d });
    },
    reportProgress(d) {
      post('PROGRESS', d);
    },
    complete(d) {
      post('COMPLETE', d);
    },
    error(m, detail) {
      post('ERROR', { message: m, detail });
    },
    async requestSave(d) {
      post('REQUEST_SAVE', d);
    },
    async requestLoad() {
      post('REQUEST_LOAD'); return null;
    },
    telemetry(d) {
      post('TELEMETRY', d);
    },
  } as IrukaHost;
}
```

**Skeleton ESM game (entry.mjs):**
```ts
// entry.mjs
import { createHost } from '/sdk/esm-game.js';

/** @type {import('/sdk/types').IrukaGameInstance} */
let instance;

export async function init(container, ctx, host) {
  host.ready();
  let running = false; let score = 0; let startTs = 0;

  const el = document.createElement('button');
  el.textContent = 'Add +5';
  el.onclick = () => {
    score += 5; host.reportScore(score, +5);
  };
  container.replaceChildren(el);

  function onHostCommand(cmd) {
    if (cmd.type === 'START') {
      running = true; startTs = performance.now();
    }
    if (cmd.type === 'PAUSE') {
      running = false;
    }
    if (cmd.type === 'RESUME') {
      running = true;
    }
    if (cmd.type === 'QUIT') {
      running = false;
      host.complete({ score, timeMs: performance.now() - startTs });
    }
    if (cmd.type === 'RESIZE') { /* adjust layout */ }
  }

  function destroy() { /* remove listeners, cancel loops */ }

  instance = { onHostCommand, destroy };
  return instance;
}
```

**Yêu cầu bắt buộc (ESM):**
- Export **`init(container, ctx, host)`** trả về `{ onHostCommand, destroy }`.
- **MUST** gửi `READY` ≤ 3s sau khi chạy `init`.
- **MUST** phát `COMPLETE` hoặc `ERROR` khi kết thúc.
- **MUST** `destroy()` giải phóng tài nguyên.

---

## 5) JSON Schema cho Manifest (rút gọn)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "title", "version", "runtime", "entryUrl"],
  "properties": {
    "id": { "type": "string", "minLength": 1 },
    "slug": { "type": "string" },
    "title": { "type": "string" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "runtime": { "type": "string", "enum": ["iframe-html", "esm-module"] },
    "entryUrl": { "type": "string", "format": "uri" },
    "iconUrl": { "type": "string", "format": "uri" },
    "width": { "type": "number", "minimum": 200 },
    "height": { "type": "number", "minimum": 150 },
    "capabilities": { "type": "array", "items": { "type": "string" } },
    "minHubVersion": { "type": "string" },
    "rolloutPercentage": { "type": "number", "minimum": 0, "maximum": 100 },
    "disabled": { "type": "boolean" },
    "metadata": { "type": "object" }
  }
}
```

---

## 6) Quy tắc **MUST/SHOULD** cho đội dev mini‑game
- **MUST**: gửi `READY` ≤ 3s sau `INIT`; hỗ trợ `PAUSE/RESUME`; phát `COMPLETE/ERROR` kết phiên; tôn trọng `RESIZE` & aspect‑ratio.
- **MUST**: không gửi PII; telemetry theo schema đã thống nhất; batch/throttle nếu gửi nhiều.
- **MUST**: FPS ≥ 30 (mục tiêu), pause khi tab/iframe bị ẩn (Hub cũng sẽ gửi `PAUSE`).
- **SHOULD**: expose `difficulty`/`seed` để Hub tái lập; hỗ trợ `REQUEST_SAVE/LOAD` nếu game có tiến độ.
- **SHOULD**: cleanup tài nguyên đồ hoạ/âm thanh khi `QUIT`/`destroy()`.

---

## 7) Host Test Harness (để dev tự kiểm thử trước khi bàn giao)
- **iFrame Harness**: 1 trang HTML tạo `<iframe src="http://localhost:5173">`, gửi `INIT→START`, log mọi message, nút gửi `PAUSE/RESUME/QUIT/RESIZE`.
- **ESM Harness**: 1 app nhỏ mount container, import module (URL), gọi `init`, phát các `HostCommand` từ UI.
- **E2E Playwright**: test pass/fail tiêu chí: nhận `READY`, có `SCORE_UPDATE`, có `COMPLETE` ≤ X giây sau `QUIT`.

---

## 8) Checklist bàn giao từ đội mini‑game
1) `manifest.json` hợp lệ (qua JSON Schema).
2) Build output: **immutable** file names (hash), tổng size ≤ budget.
3) Gửi link **demo Harness** + video 30s chạy qua các trạng thái.
4) Báo cáo **perf**: FPS, TTI, memory peak trên thiết bị mục tiêu.
5) Báo cáo **accessibility**: mute, captions (nếu có audio), high‑contrast.
6) Danh sách **license** assets/libs.

---

## 9) Hỏi–Đáp ngắn cho Dev
- **Q:** Có thể đọc/ghi trực tiếp BE?
  **A:** Ưu tiên gọi qua Hub (an toàn, đơn giản). Nếu cần, dùng `launchToken` (JWT) + CORS whitelist.
- **Q:** Có bắt buộc `COMPLETE`?
  **A:** Có. Nếu người chơi thoát, hãy phát `COMPLETE` (score/time hiện thời) hoặc `ERROR` có lý do.
- **Q:** Resize thế nào?
  **A:** Hub gửi `RESIZE {width,height,dpr}`; game nên scale viewport/canvas dựa trên đó; giữ aspect‑ratio.

---

## 10) Định hướng nâng cấp v2
- `cooperative‑scheduling`: Hub chia time‑slice cho nhiều game chạy song song (preview).
- `audio focus`: API thống nhất xin quyền phát audio.
- `localization`: bundle gói ngôn ngữ chuẩn và fallback.

---

**Kết thúc — v1 Interfaces/Contracts sẵn sàng áp dụng.**
