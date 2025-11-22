# Game Hub - Quick Start Guide

## Giới thiệu

Game Hub là hệ thống cho phép tích hợp và chạy nhiều mini-games trong ứng dụng Iruka. Hệ thống hỗ trợ 2 runtime:

1. **iframe-html**: Game chạy trong iframe (tách biệt, an toàn)
2. **esm-module**: Game là ES Module (hiệu năng cao, chia sẻ libs)

## Cài đặt nhanh

### 1. Cấu trúc thư mục đã tạo

```
src/
├── lib/game-hub/          # Core library
│   ├── protocol.ts        # Types & interfaces
│   ├── bridge.ts          # GameBridge class
│   ├── security.ts        # Security utilities
│   ├── telemetry.ts       # Telemetry batching
│   ├── progress.ts        # Progress save/load
│   ├── utils.ts           # Utilities
│   ├── index.ts           # Main export
│   ├── sdk/               # SDK for games
│   │   ├── iframe-game.ts
│   │   ├── esm-game.ts
│   │   └── index.ts
│   └── templates/         # Game templates
│       ├── iframe-game-template.html
│       └── esm-game-template.ts
├── components/game-hub/   # React components
│   ├── game-list.tsx
│   ├── game-stage.tsx
│   ├── game-launcher.tsx
│   └── game-stats.tsx
├── stores/
│   └── game-hub-store.ts  # Zustand store
└── app/
    ├── [locale]/(game-hub)/
    │   ├── layout.tsx
    │   └── page.tsx       # Main game hub page
    └── api/game-hub/      # API routes
        ├── games/route.ts
        ├── sessions/
        ├── progress/
        ├── telemetry/
        └── leaderboard/
```

### 2. Environment Variables

Thêm vào `.env.local`:

```bash
NEXT_PUBLIC_ALLOWED_GAME_ORIGINS=https://cdn.iruka.games,https://games.iruka.tld,http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=https://api.iruka.tld
```

### 3. Truy cập Game Hub

Truy cập: `http://localhost:3000/game-hub`

## Tạo Game Mới

### Option 1: iFrame Game (Khuyên dùng cho bắt đầu)

**Ưu điểm:**
- Dễ tích hợp
- An toàn (sandbox)
- Có thể dùng bất kỳ tech stack nào

**Bước 1:** Copy template

```bash
cp src/lib/game-hub/templates/iframe-game-template.html my-game/index.html
```

**Bước 2:** Chỉnh sửa game logic

```javascript
// Trong file HTML
const hub = createIframeBridge({
  onCommand(cmd) {
    if (cmd.type === 'INIT') {
      // Khởi tạo game
      hub.ready();
    }
    if (cmd.type === 'START') {
      // Bắt đầu game
    }
    if (cmd.type === 'PAUSE') {
      // Tạm dừng
    }
    if (cmd.type === 'QUIT') {
      // Kết thúc
      hub.complete({ score, timeMs });
    }
  }
});
```

**Bước 3:** Deploy lên CDN

```bash
# Upload index.html lên CDN
# Ví dụ: https://cdn.iruka.games/my-game/index.html
```

**Bước 4:** Thêm vào manifest (mock data trong API)

```typescript
// src/app/api/game-hub/games/route.ts
{
  id: 'my-game-1',
  title: 'Game của tôi',
  version: '1.0.0',
  runtime: 'iframe-html',
  entryUrl: 'https://cdn.iruka.games/my-game/index.html',
  // ... other fields
}
```

### Option 2: ESM Module Game (Nâng cao)

**Ưu điểm:**
- Hiệu năng cao
- Chia sẻ libs với host app
- Nhẹ hơn

**Bước 1:** Copy template

```bash
cp src/lib/game-hub/templates/esm-game-template.ts my-game/entry.ts
```

**Bước 2:** Implement game

```typescript
export async function init(container, ctx, host) {
  // Create UI
  const root = document.createElement('div');
  // ... setup UI

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

**Bước 3:** Build và deploy

```bash
# Build to ESM
npm run build

# Deploy entry.js
# Ví dụ: https://cdn.iruka.games/my-game/entry.js
```

**Bước 4:** Thêm vào manifest

```typescript
{
  id: 'my-game-1',
  title: 'Game của tôi',
  version: '1.0.0',
  runtime: 'esm-module',
  entryUrl: 'https://cdn.iruka.games/my-game/entry.js',
  // ... other fields
}
```

## SDK API Reference

### Hub → Game Commands

```typescript
// INIT: Khởi tạo game với context
{ type: 'INIT', payload: LaunchContext }

// START: Bắt đầu game
{ type: 'START' }

// PAUSE: Tạm dừng
{ type: 'PAUSE' }

// RESUME: Tiếp tục
{ type: 'RESUME' }

// QUIT: Thoát game
{ type: 'QUIT' }

// RESIZE: Thay đổi kích thước
{ type: 'RESIZE', payload: { width, height, dpr } }
```

### Game → Hub Events

```typescript
// READY: Game sẵn sàng
hub.ready()

// LOADING: Đang tải
hub.loading(50) // 0-100

// SCORE_UPDATE: Cập nhật điểm
hub.reportScore(100, +10)

// PROGRESS: Cập nhật tiến độ
hub.reportProgress({ level: 2 })

// COMPLETE: Hoàn thành
hub.complete({ score: 100, timeMs: 30000 })

// ERROR: Lỗi
hub.error('Something went wrong')

// REQUEST_SAVE: Lưu progress
hub.requestSave({ level: 2, lives: 3 })

// REQUEST_LOAD: Load progress
await hub.requestLoad()

// TELEMETRY: Gửi analytics
hub.telemetry({ event: 'milestone', data: {...} })
```

## Testing Game

### Local Testing

1. Serve game locally:

```bash
# iFrame game
npx serve my-game

# Truy cập http://localhost:3000
```

2. Update manifest với localhost URL:

```typescript
entryUrl: 'http://localhost:3000/index.html';
```

3. Truy cập Game Hub và test

### Testing Checklist

- [ ] Game gửi READY ≤ 3s
- [ ] PAUSE/RESUME hoạt động
- [ ] QUIT gửi COMPLETE với score đúng
- [ ] RESIZE không làm méo UI
- [ ] Tab hidden → auto pause
- [ ] Không có memory leak
- [ ] FPS ≥ 30

## Troubleshooting

### Game không load

1. Check console errors
2. Verify entryUrl accessible
3. Check CORS headers
4. Verify origin trong allowlist

### postMessage không hoạt động

1. Check source/origin validation
2. Verify targetOrigin setting
3. Check message format

### Game không nhận INIT

1. Verify iframe loaded (onload event)
2. Check postMessage timing
3. Check message listener registered

## Best Practices

### Performance

1. **Lazy load assets**: Load assets khi cần
2. **Optimize images**: WebP, compress
3. **Minimize bundle**: Tree-shaking, code splitting
4. **Cache libs**: Dùng CDN chung cho libs

### Security

1. **Validate input**: Không tin user input
2. **No PII**: Không gửi thông tin cá nhân
3. **Use tokens**: Authenticate API calls
4. **Sandbox**: Dùng iframe sandbox

### UX

1. **Loading state**: Hiển thị progress
2. **Error handling**: Graceful degradation
3. **Auto pause**: Khi tab hidden
4. **Responsive**: Hỗ trợ mobile

## Next Steps

1. Xem [Architecture Doc](./0_bao_cao_base_game_hub_iruka_v_1.md)
2. Đọc [SDK Spec](./1_iruka_game_sdk_v_1_interfaces_templates.md)
3. Review [Implementation Spec](./2_iruka_base_game_hub_next_js_spec_v_1.md)
4. Tham khảo templates trong `/src/lib/game-hub/templates/`

## Support

- Issues: GitHub Issues
- Docs: `/docs/game-hub/`
- Examples: `/src/lib/game-hub/templates/`
