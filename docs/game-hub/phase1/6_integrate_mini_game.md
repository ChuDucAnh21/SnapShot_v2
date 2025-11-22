Tuyệt — dưới đây là “đường dây tích hợp” rất thực dụng để biến **một React component hiện có** thành **mini-game** chạy được trong Base Game Hub của bạn, kèm code mẫu cho **2 runtime** mà Hub hỗ trợ: `iframe-html` (dễ nhất) và `esm-module` (tin cậy + hiệu năng).

---

# 0) Quyết định nhanh: chọn runtime nào?

* **Bạn muốn ship nhanh, độc lập repo, ít rủi ro bảo mật?** → **`iframe-html`**.
* **Bạn kiểm soát code, muốn chia sẻ theme/store, tối ưu kích thước & latency?** → **`esm-module`**.

> Bạn có thể dùng cả hai: phần lớn game là `iframe-html`; một số “core” game nội bộ là `esm-module`.

---

# 1) Chuẩn bị chung (áp dụng cho mọi runtime)

1. **Manifest cho mỗi game** (BE cấp cho Hub):

```json
{
  "id": "your-game-id",
  "title": "Tên game",
  "version": "1.0.0",
  "runtime": "iframe-html", // hoặc "esm-module"
  "entryUrl": "https://cdn.your/games/your-game/index.html", // hoặc entry.mjs cho ESM
  "iconUrl": "https://cdn.your/games/your-game/icon.png",
  "capabilities": ["score", "save-progress"],
  "minHubVersion": "1.0.0"
}
```

2. **Protocol sự kiện** (đã chuẩn hoá trong Hub):

* **Hub → Game:** `INIT {LaunchContext}`, `START`, `PAUSE`, `RESUME`, `RESIZE {w,h,dpr}`, `QUIT`, `SET_STATE`.
* **Game → Hub:** `READY`, `LOADING {progress}`, `SCORE_UPDATE {score,delta?}`, `PROGRESS {…}`, `COMPLETE {score,timeMs,…}`, `ERROR {message}`, `REQUEST_SAVE {data}`, `REQUEST_LOAD`, `TELEMETRY {…}`.

3. **Yêu cầu bắt buộc**:

* Gửi `READY` ≤ 3s sau khi nhận `INIT`.
* Khi người chơi thoát/kết thúc, phát `COMPLETE` (hoặc `ERROR`).
* Tôn trọng `PAUSE/RESUME` và `RESIZE`.

---

# 2) Tích hợp cách 1 — **iFrame HTML** (đề xuất cho team mới)

## 2.1. Bọc React component thành app iFrame

Giả sử bạn có `GameApp.tsx` (component game hiện có). Tạo một shell (Vite/CRA đều được). Cốt lõi là **bridge** dùng `postMessage`.

**`src/sdk/iframeBridge.ts`**

```ts
// Cầu nối iFrame ↔ Hub
export type HostCommand
  = | { type: 'INIT'; payload: any } | { type: 'START' } | { type: 'PAUSE' } | { type: 'RESUME' }
    | { type: 'QUIT' } | { type: 'SET_STATE'; payload: any } | { type: 'RESIZE'; payload: { width: number; height: number; dpr?: number } };

export type GameEvent
  = | { type: 'READY' } | { type: 'LOADING'; payload: { progress: number } }
    | { type: 'SCORE_UPDATE'; payload: { score: number; delta?: number } }
    | { type: 'PROGRESS'; payload: any } | { type: 'COMPLETE'; payload: { score: number; timeMs: number; extras?: any } }
    | { type: 'ERROR'; payload: { message: string; detail?: any } }
    | { type: 'REQUEST_SAVE'; payload: any } | { type: 'REQUEST_LOAD' } | { type: 'TELEMETRY'; payload: any };

export function createIframeBridge(opts: { onCommand: (cmd: HostCommand) => void; targetOrigin?: string }) {
  const target = opts.targetOrigin ?? '*'; // PROD: thay bằng origin Hub
  const post = (evt: GameEvent) => window.parent?.postMessage({ source: 'game', ...evt }, target);

  const onMessage = (e: MessageEvent) => {
    const d = e.data;
    if (!d || d.source !== 'hub' || !d.type) {
      return;
    }
    // PROD: xác thực e.origin ∈ allowlist
    opts.onCommand({ type: d.type, payload: d.payload });
  };
  window.addEventListener('message', onMessage);

  return {
    dispose: () => window.removeEventListener('message', onMessage),
    // Helpers game → hub
    ready: () => post({ type: 'READY' }),
    loading: (p: number) => post({ type: 'LOADING', payload: { progress: p } }),
    score: (score: number, delta?: number) => post({ type: 'SCORE_UPDATE', payload: { score, delta } }),
    progress: (data: any) => post({ type: 'PROGRESS', payload: data }),
    complete: (data: { score: number; timeMs: number; extras?: any }) => post({ type: 'COMPLETE', payload: data }),
    error: (message: string, detail?: any) => post({ type: 'ERROR', payload: { message, detail } }),
    requestSave: (data: any) => post({ type: 'REQUEST_SAVE', payload: data }),
    requestLoad: () => post({ type: 'REQUEST_LOAD' }),
    telemetry: (data: any) => post({ type: 'TELEMETRY', payload: data }),
  };
}
```

**`src/main.tsx`**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GameApp } from './GameApp';
import { createIframeBridge } from './sdk/iframeBridge';

let ctx: any = null;
let running = false;
let startTs = 0;
let score = 0;

const hub = createIframeBridge({
  onCommand(cmd) {
    if (cmd.type === 'INIT') {
      ctx = cmd.payload; hub.ready();
    }
    if (cmd.type === 'START') {
      running = true; startTs = performance.now();
    }
    if (cmd.type === 'PAUSE') {
      running = false;
    }
    if (cmd.type === 'RESUME') {
      running = true;
    }
    if (cmd.type === 'RESIZE') { /* optional: handle layout */ }
    if (cmd.type === 'QUIT') {
      running = false;
      hub.complete({ score, timeMs: performance.now() - startTs });
    }
  }
});

function onScore(delta: number) {
  score += delta;
  hub.score(score, delta);
}

createRoot(document.getElementById('root')!).render(
  <GameApp context={ctx} onScore={onScore} onSave={data => hub.requestSave(data)} />
);

// Ví dụ tick gameplay (tuỳ game)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    hub.telemetry({ evt: 'hidden' });
  }
});
```

**`index.html`** (cực gọn, chú ý full-height)

```html
<!doctype html>
<html>
  <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>html,body,#root{height:100%;margin:0}</style>
  </head>
  <body><div id="root">Loading…</div><script type="module" src="/src/main.tsx"></script></body>
</html>
```

**Trong `GameApp.tsx`**, gọi `props.onScore(…)` khi có điểm; gọi `props.onSave(data)` khi checkpoint.

## 2.2. Build & Deploy

* Dùng **Vite**: `vite build` → ra `dist/index.html` + assets.
* Deploy lên CDN (origin cố định, immutable assets).
* Cập nhật `entryUrl` trong **manifest** trỏ vào file HTML đó.

> Làm xong, Hub sẽ **nhúng iFrame** → gửi `INIT/START` → game gửi `READY` và bắt đầu.

---

# 3) Tích hợp cách 2 — **ESM Module** (cho code nội bộ tin cậy)

Bạn sẽ **export** một hàm `init(container, ctx, host)` để Hub `import()` và mount React root vào `container`.

## 3.1. Entry module & adapter React

**`src/entry.tsx`**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GameApp } from './GameApp';

export type Host = {
  send: (cmd: { type: string; payload?: any }) => void;
  ready: () => void;
  loading: (p: number) => void;
  reportScore: (score: number, delta?: number) => void;
  reportProgress: (data: any) => void;
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;
  error: (msg: string, detail?: any) => void;
  requestSave: (data: any) => Promise<void>;
  requestLoad: () => Promise<any>;
  telemetry: (data: any) => void;
};

export async function init(container: HTMLElement, ctx: any, host: Host) {
  let running = false; let startTs = 0; let score = 0;

  function onHostCommand(cmd: { type: string; payload?: any }) {
    if (cmd.type === 'START') {
      running = true; startTs = performance.now();
    }
    if (cmd.type === 'PAUSE') {
      running = false;
    }
    if (cmd.type === 'RESUME') {
      running = true;
    }
    if (cmd.type === 'RESIZE') { /* adjust layout if needed */ }
    if (cmd.type === 'QUIT') {
      running = false;
      host.complete({ score, timeMs: performance.now() - startTs });
    }
  }

  function onScore(delta: number) {
    score += delta;
    host.reportScore(score, delta);
  }

  const root = createRoot(container);
  root.render(<GameApp context={ctx} onScore={onScore} onSave={d => host.requestSave(d)} />);

  host.ready(); // thông báo sẵn sàng ≤3s

  return {
    onHostCommand,
    destroy() {
      root.unmount();
    }
  };
}
```

> **Lưu ý chia sẻ thư viện:**
>
> * Đơn giản nhất: **bundle kèm React** vào game (tránh lệch version).
> * Nếu muốn **share React** để giảm size, cần import map/alias thống nhất giữa Hub và game (chỉ dùng khi bạn sở hữu cả 2 bên).

## 3.2. Build ra **ES module**

Ví dụ **Vite** (library mode):

```ts
import react from '@vitejs/plugin-react';
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/entry.tsx', formats: ['es'], fileName: () => 'entry.mjs' },
    rollupOptions: {
      // Cách 1: bundle tất cả (dễ nhất)
      // Cách 2: externalize react để share (cần import map tương thích)
      // external: ['react','react-dom']
    }
  }
});
```

Deploy `entry.mjs` + assets lên CDN và cập nhật **manifest** (`runtime: "esm-module"`, `entryUrl: ".../entry.mjs"`).

---

# 4) Từ **React component** sang **mini-game**: các “điểm móc” cần thêm

Trong `GameApp` (component hiện có), bổ sung 4 “điểm móc” phổ biến:

1. **Score**
   Gọi `props.onScore(delta)` mỗi khi điểm thay đổi → Hub ghi nhận và cập nhật leaderboard/telemetry.

2. **Progress**
   Tại checkpoint: `props.onSave({ level, items, ... })` (đối với iFrame, hàm này sẽ gọi `REQUEST_SAVE`).

3. **Pause/Resume**
   Đảm bảo game **dừng loop/timer** khi nhận `PAUSE`/`RESUME` (đã được adapter xử lý và truyền vào).

4. **Resize**
   Nếu game canvas/UI phụ thuộc kích thước, lắng nghe `RESIZE` (đã được adapter gọi) để scale viewport.

> Bạn **không** cần tự bắt `postMessage` hay `host.send` trong `GameApp` — hãy giữ component **“thuần UI + logic”** và để **adapter** (iFrame/ESM) lo phần giao tiếp với Hub.

---

# 5) Kiểm thử nhanh trước khi bàn giao

* **Harness Dev Page** (khuyên dùng): một trang đơn giản cho phép:

  * nhập `entryUrl`, chọn runtime;
  * gửi `INIT/START/PAUSE/RESUME/QUIT/RESIZE`;
  * log toàn bộ sự kiện từ game.
* **Checklist pass/fail**:

  * Nhận `INIT` và phát `READY` ≤ 3s.
  * Khi `START` → có gameplay & có ít nhất một `SCORE_UPDATE`.
  * Khi `QUIT` → game phát `COMPLETE` trong ≤ 1.5s.
  * Khi `visibilitychange` ẩn tab → game dừng loop (hoặc Hub gửi `PAUSE`, game phản hồi đúng).

---

# 6) Lỗi thường gặp & cách tránh

* **Quên phát `READY`** → Hub treo loading. → Gọi `hub.ready()` (iFrame) hoặc `host.ready()` (ESM) ngay sau khi mount xong UI.
* **Không dọn tài nguyên khi QUIT** → rò rỉ memory/WebGL. → Cài `destroy()` unmount React root/clear timers.
* **Spam telemetry** → nghẽn mạng. → Gom batch mỗi 5–10s (Hub đã batch; phía game gửi mức cần thiết).
* **Sai origin** (iFrame) → Hub bỏ qua message. → Đặt `targetOrigin` chính xác, và Hub allowlist origin từ `entryUrl`.
* **Mismatch React version** (ESM share lib) → crash. → Giai đoạn đầu **bundle kèm React** trong game để an toàn.

---

# 7) TL;DR – To-do ngắn cho dev game

1. Chọn **runtime** (iFrame/ESM).
2. Thêm **adapter** tương ứng (đoạn code mẫu ở trên).
3. Trong `GameApp`, gọi `onScore`, `onSave`, và đảm bảo dừng/tái chạy khi Pause/Resume.
4. Build & **deploy** (HTML cho iFrame, `entry.mjs` cho ESM).
5. Cấp **manifest** cho BE (id, runtime, entryUrl, version…).
6. Test qua **Harness**; bàn giao.

---
