# Iruka Game Hub Documentation

Chào mừng đến với tài liệu Game Hub! Hệ thống cho phép tích hợp và chạy nhiều mini-games trong ứng dụng Iruka.

## 🚀 Current Status

**Phase 1**: ✅ Core Infrastructure Complete
**Phase 2**: 🚧 In Progress - Production Demo Development

## 📚 Documentation Structure

### Phase 1 (COMPLETE) - Core Infrastructure

Tất cả tài liệu Phase 1 đã được chuyển vào folder `phase1/`:

1. **[Báo cáo Kiến trúc Base Game Hub](./phase1/0_bao_cao_base_game_hub_iruka_v_1.md)**
   - Tổng quan kiến trúc
   - Hai runtime (iframe-html, esm-module)
   - Bảo mật, hiệu năng, versioning

2. **[SDK Interfaces & Templates](./phase1/1_iruka_game_sdk_v_1_interfaces_templates.md)**
   - Protocol definitions
   - SDK cho iframe và ESM games
   - Contract tests

3. **[Next.js Implementation Spec](./phase1/2_iruka_base_game_hub_next_js_spec_v_1.md)**
   - Cấu trúc thư mục
   - Components & API routes
   - Security & CSP

4. **[Quick Start Guide](./phase1/3_quick_start_guide.md)** ⭐
   - Hướng dẫn bắt đầu nhanh
   - Tạo game mới (iframe & ESM)
   - Testing & troubleshooting

5. **[API Reference](./phase1/4_api_reference.md)**
   - FE API endpoints
   - SDK API methods
   - Types reference

6. **[Architecture Diagram](./phase1/5_architecture_diagram.md)**
   - System architecture
   - Data flow
   - Component relationships

7. **[Integration Guide](./phase1/6_integrate_mini_game.md)**
   - How to integrate mini games
   - Step-by-step tutorial

8. **[Tutorial](./phase1/7_tutorial.md)**
   - Complete walkthrough
   - Best practices

### Phase 2 (IN PROGRESS) - Production Demo

Tài liệu Phase 2 trong folder `phase2/`:

1. **[README](./phase2/README.md)** - Overview & Roadmap ⭐
2. **[SUMMARY](./phase2/SUMMARY.md)** - Executive Summary ⭐⭐
3. **[UI Enhancements](./phase2/1_ui_enhancements.md)** - UI/UX improvements
4. **[Leaderboard System](./phase2/2_leaderboard_system.md)** - Ranking & competition
5. **[Mini Games Specs](./phase2/3_mini_games_specs.md)** - 5 games design
6. **[Performance Monitoring](./phase2/4_performance_monitoring.md)** - Analytics & metrics
7. **[Dev Harness](./phase2/5_dev_harness.md)** - Developer tools
8. **[Demo Checklist](./phase2/6_demo_checklist.md)** - Launch preparation

## 📂 Current Structure

```
src/app/[locale]/(game-hub)/
  └── hub/                           # Game Hub pages
      ├── layout.tsx                 # Hub layout
      └── page.tsx                   # Hub homepage (list of games)
```

**Access**: `http://localhost:3000/[locale]/game-hub`

---

## 🚀 Quick Start

### For Phase 2 Development

**Start here**: Read [Phase 2 Summary](./phase2/SUMMARY.md) for executive overview

**Choose your track**:
- 🎨 **UI/UX Track**: Start with [UI Enhancements](./phase2/1_ui_enhancements.md)
- 🎮 **Games Track**: Start with [Mini Games Specs](./phase2/3_mini_games_specs.md)
- 🏆 **Backend Track**: Start with [Leaderboard System](./phase2/2_leaderboard_system.md)

### Existing Structure (Phase 1)

```
src/
├── lib/game-hub/              # 📦 Core library (DONE)
│   ├── protocol.ts
│   ├── bridge.ts
│   ├── security.ts
│   ├── telemetry.ts
│   ├── progress.ts
│   ├── utils.ts
│   ├── sdk/                   # 🎮 SDK for games
│   └── templates/             # 📝 Game templates
├── components/game-hub/       # ⚛️ React components
│   ├── game-list.tsx
│   ├── game-stage.tsx
│   ├── game-launcher.tsx
│   └── game-stats.tsx
├── stores/game-hub-store.ts   # 🏪 Zustand store
└── app/[locale]/
    ├── (game-hub)/
    │   └── hub/               # 📄 Game Hub pages
    │       ├── layout.tsx
    │       └── page.tsx
    └── api/game-hub/          # 🔌 API routes
```

### Access Game Hub

```
http://localhost:3000/game-hub
```

### Creating New Games

See [Phase 1 Quick Start Guide](./phase1/3_quick_start_guide.md) for templates

## 🎯 Features

### ✅ Đã hoàn thành (P0)

- **Core Protocol**: Types, interfaces, contracts
- **GameBridge**: Mount & giao tiếp với games
- **Dual Runtime**: iframe-html & esm-module
- **SDK**: Tools cho game developers
- **Security**: Origin validation, CSP, sandboxing
- **Telemetry**: Batching với retry logic
- **Progress**: Save/load game state
- **Components**: GameList, GameStage, GameLauncher
- **Store**: Zustand session management
- **API Routes**: Games, sessions, progress, telemetry
- **Documentation**: Comprehensive docs & templates

### 🔄 Roadmap

**P1 (Next Phase):**
- Leaderboard UI integration
- PWA offline support
- Performance monitoring dashboard
- A/B testing framework
- Dev harness/playground

**P2 (Future):**
- Multiplayer support
- Achievements system
- Social features (share, compete)
- Advanced analytics
- Game recommendation engine

## 🎮 Supported Runtimes

### iframe-html
- ✅ Sandbox isolation
- ✅ Đa công nghệ
- ✅ Dễ tích hợp
- ⚠️ Overhead messaging

**Khuyên dùng cho:**
- Third-party games
- Games từ external teams
- Quick prototypes

### esm-module
- ✅ Hiệu năng cao
- ✅ Chia sẻ libs
- ✅ Nhẹ hơn
- ⚠️ Phải tin cậy

**Khuyên dùng cho:**
- Internal games
- High-performance games
- Games cần share UI components

## 📋 Checklist cho Game Developers

### MUST (Bắt buộc)
- [x] Gửi `READY` ≤ 3s
- [x] Phát `COMPLETE`/`ERROR` khi kết thúc
- [x] Hỗ trợ `PAUSE/RESUME/QUIT`
- [x] Respect `RESIZE`
- [x] Không gửi PII
- [x] Telemetry theo schema
- [x] FPS ≥ 30

### SHOULD (Nên có)
- [ ] `REQUEST_SAVE/LOAD`
- [ ] Expose `difficulty`/`seed`
- [ ] Cleanup resources
- [ ] i18n support
- [ ] Accessibility

## 🔒 Security

- **iFrame**: Sandbox + origin check
- **ESM**: Whitelist domains only
- **Tokens**: JWT ≤ 15 phút
- **CSP**: Strict headers
- **No PII**: Minimize data exposure

## 📊 Architecture Decisions

### Hybrid Runtime Approach (70-30)
- 70-80% games: `iframe-html` (security, flexibility)
- 20-30% games: `esm-module` (performance, core features)

### Manifest-Driven
- BE controls game list
- Canary rollout via `rolloutPercentage`
- Version management with `minHubVersion`

### Telemetry Batching
- Batch every 8s or 50 events
- Exponential backoff on errors
- Automatic retry

## 🧪 Testing

### Contract Tests
```typescript
// Game sends READY within 3s
test('READY timeout', async () => {
  const bridge = new GameBridge({ manifest, context });
  await bridge.mount(container);
  await expect(waitForReady(3000)).resolves.toBe(true);
});
```

### Chaos Tests
- Token expiry
- Network loss
- Rapid resize
- Tab hidden/shown

## 📈 Metrics

Track these metrics:
- TTI (Time to Interactive)
- Game load time
- FPS (Frames per second)
- Error rate
- Session completion rate
- Average session length

## 🤝 Contributing

1. Read architecture docs
2. Use templates as base
3. Follow protocol checklist
4. Test thoroughly
5. Submit PR with manifest

## 📞 Support

- **Code**: `/src/lib/game-hub/`
- **Docs**: `/docs/game-hub/`
- **Templates**: `/src/lib/game-hub/templates/`
- **Issues**: GitHub Issues

## 📖 Additional Resources

- [Iruka Game SDK v1](./1_iruka_game_sdk_v_1_interfaces_templates.md)
- [Next.js Implementation](./2_iruka_base_game_hub_next_js_spec_v_1.md)
- [Quick Start](./3_quick_start_guide.md)
- [API Reference](./4_api_reference.md)

---

**Version**: 1.0.0
**Last Updated**: October 23, 2025
**Status**: ✅ Production Ready (P0 Complete)
