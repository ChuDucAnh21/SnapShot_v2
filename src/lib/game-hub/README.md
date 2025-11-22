# Iruka Game Hub - Base Implementation

Hệ thống **Game Hub** cho phép nhúng và vận hành mini-games theo **manifest** từ BE, hỗ trợ 2 runtime: `iframe-html` và `esm-module`.

## 📚 Tài liệu tham khảo

- [Báo cáo kiến trúc Base Game Hub](../../../docs/game-hub/0_bao_cao_base_game_hub_iruka_v_1.md)
- [SDK Interfaces & Templates](../../../docs/game-hub/1_iruka_game_sdk_v_1_interfaces_templates.md)
- [Next.js Implementation Spec](../../../docs/game-hub/2_iruka_base_game_hub_next_js_spec_v_1.md)

## 🏗️ Kiến trúc

### Thành phần chính

1. **Protocol & Types** (`protocol.ts`): Định nghĩa types, interfaces, contracts
2. **GameBridge** (`bridge.ts`): Core class để mount và giao tiếp với game
3. **SDK** (`sdk/`): SDK cho game developers (iframe & ESM)
4. **Security** (`security.ts`): Origin validation, CSP helpers
5. **Telemetry** (`telemetry.ts`): Batch và queue telemetry events
6. **Progress** (`progress.ts`): Save/load game progress
7. **Utils** (`utils.ts`): Utility functions

### Components

- `GameList`: Hiển thị grid các games
- `GameStage`: Vùng mount và hiển thị game
- `GameLauncher`: Component quản lý game session
- `GameStats`: Hiển thị thống kê

### Store

- `game-hub-store.ts`: Zustand store cho session management

### API Routes

- `GET /api/game-hub/games`: Lấy danh sách games
- `POST /api/game-hub/sessions/start`: Khởi tạo session
- `POST /api/game-hub/sessions/[id]/finish`: Kết thúc session
- `POST /api/game-hub/progress/[gameId]/save`: Lưu progress
- `GET /api/game-hub/progress/[gameId]/load`: Load progress
- `POST /api/game-hub/telemetry/batch`: Batch telemetry
- `GET /api/game-hub/leaderboard/[gameId]`: Leaderboard

## 🚀 Sử dụng

### 1. Import và sử dụng GameBridge

```typescript
import { GameBridge } from '@/lib/game-hub';

const bridge = new GameBridge({
  manifest: gameManifest,
  context: launchContext,
  onEvent: (event) => {
    console.log('Game event:', event);
  },
});

await bridge.mount(containerElement);
bridge.start();
```

### 2. Tạo iFrame Game

Xem template tại `templates/iframe-game-template.html`

```html
<script type="module">
import { createIframeBridge } from '@iruka/game-sdk';

const hub = createIframeBridge({
  onCommand(cmd) {
    // Handle commands from hub
  }
});

// Notify hub when ready
hub.ready();

// Report score
hub.reportScore(100, 10);

// Complete game
hub.complete({ score: 100, timeMs: 30000 });
</script>
```

### 3. Tạo ESM Game

Xem template tại `templates/esm-game-template.ts`

```typescript
export async function init(container, ctx, host) {
  // Initialize game
  host.ready();

  return {
    onHostCommand(cmd) {
      // Handle commands
    },
    destroy() {
      // Cleanup
    }
  };
}
```

## 📋 Checklist cho Game Developers

### MUST (Bắt buộc)

- [ ] Gửi `READY` ≤ 3s sau khi nhận `INIT`
- [ ] Phát `COMPLETE` hoặc `ERROR` khi kết thúc
- [ ] Hỗ trợ `PAUSE/RESUME/QUIT`
- [ ] Respect `RESIZE` và giữ aspect-ratio
- [ ] Không gửi PII (Personally Identifiable Information)
- [ ] Telemetry theo schema chuẩn
- [ ] Batch/throttle nếu gửi nhiều events
- [ ] FPS ≥ 30 (mục tiêu)
- [ ] Pause khi tab/iframe bị ẩn

### SHOULD (Nên có)

- [ ] Hỗ trợ `REQUEST_SAVE/LOAD` nếu có tiến độ
- [ ] Expose `difficulty`/`seed` để tái lập
- [ ] Cleanup tài nguyên (timers, WebGL, audio) khi `QUIT`/`destroy()`
- [ ] i18n support qua `locale` trong LaunchContext
- [ ] Accessibility: mute option, high contrast

## 🔒 Bảo mật

### iFrame Runtime

- Sandbox attributes: `allow-scripts`, `allow-pointer-lock`
- Origin check cho postMessage
- CSP headers
- Token ngắn hạn (≤ 15 phút)

### ESM Runtime

- Chỉ tải từ domain tin cậy (whitelist)
- Không nhận third-party chưa audit
- CSP nghiêm (không `eval`)

## 📊 Telemetry

Events được batch mỗi 8s hoặc khi đủ 50 events, với exponential backoff khi lỗi.

```typescript
pushTelemetry({
  t: Date.now(),
  sid: sessionId,
  gid: gameId,
  ver: gameVersion,
  evt: 'custom',
  payload: { ... }
});
```

## 🎮 Runtime Support

### iframe-html

- ✅ Sandbox isolation
- ✅ Đa công nghệ (React, Vue, vanilla JS, etc.)
- ✅ Dễ tích hợp
- ⚠️ Overhead messaging
- ⚠️ Libs có thể trùng lặp

### esm-module

- ✅ Hiệu năng cao
- ✅ Chia sẻ UI/libs với host
- ✅ Nhẹ hơn
- ⚠️ Phải tin cậy tuyệt đối
- ⚠️ Phức tạp hơn (lifecycle management)

## 🧪 Testing

### Contract Tests

```typescript
// Test READY timeout
test('game sends READY within 3s', async () => {
  const bridge = new GameBridge({ manifest, context });
  await bridge.mount(container);

  await expect(
    waitForReady(bridge, 3000)
  ).resolves.toBe(true);
});
```

### Chaos Tests

- Token hết hạn → retry
- Mất mạng → queue telemetry
- Resize liên tục → không drop FPS
- Tab hidden → auto pause

## 📦 Environment Variables

```bash
NEXT_PUBLIC_ALLOWED_GAME_ORIGINS=https://cdn.iruka.games,https://games.iruka.tld
NEXT_PUBLIC_API_BASE_URL=https://api.iruka.tld
```

## 🔄 Versioning

- SDK version: `1.0.0`
- Game manifest có `version` field (SemVer)
- Hub có `minHubVersion` check
- Hỗ trợ canary rollout qua `rolloutPercentage`

## 📈 Roadmap

### P0 (Completed)
- ✅ Protocol & types
- ✅ GameBridge (iframe & ESM)
- ✅ SDK for games
- ✅ Telemetry batching
- ✅ Progress save/load
- ✅ Security utilities
- ✅ React components
- ✅ API routes
- ✅ Game Hub pages

### P1 (Next)
- [ ] Leaderboard UI
- [ ] PWA offline support
- [ ] Performance monitoring
- [ ] A/B testing framework
- [ ] Dev harness/playground

### P2 (Future)
- [ ] Multiplayer support
- [ ] Achievements system
- [ ] Social features
- [ ] Advanced analytics

## 🤝 Contributing

Khi phát triển game mới:

1. Chọn runtime (`iframe-html` hoặc `esm-module`)
2. Dùng template làm base
3. Implement protocol theo checklist
4. Test với harness
5. Submit manifest + demo link

## 📞 Support

- Docs: `/docs/game-hub/`
- Templates: `/src/lib/game-hub/templates/`
- Examples: Coming soon

---

**Version**: 1.0.0
**Last Updated**: 2025-10-23
