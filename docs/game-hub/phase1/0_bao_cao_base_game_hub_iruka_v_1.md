# BÁO CÁO KIẾN TRÚC “BASE GAME HUB” (IRUKA)
**Ngày:** 12/10/2025
**Người soạn:** Team FE (đại diện)

---

## 0) TÓM TẮT ĐIỀU HÀNH (Executive Summary)
- **Mục tiêu:** Tạo một **Game Hub dạng plug‑in** để nhập/xuất game linh hoạt, thay đổi nội dung nhanh, vẫn đảm bảo an toàn, hiệu năng và khả năng mở rộng.
- **Cách tiếp cận:** Hỗ trợ **hai runtime song song**:
  1) `iframe-html` (game là HTML/SPA chạy tách biệt, giao tiếp qua `postMessage`).
  2) `esm-module` (game là ESM module, hub `import()` và gọi `init`).
- **Kết luận:** Kiến trúc **khả thi cao**. Đề xuất **hybrid**: 70–80% game dùng `iframe-html` (an toàn, đa công nghệ), 20–30% game “core” dùng `esm-module` (hiệu năng, chia sẻ UI/state).
- **Lợi ích chính:** rút ngắn thời gian ra mắt game mới; giảm rủi ro khi nhiều đội cùng phát triển; tối ưu dần chi phí tải và CPU.

---

## 1) VÌ SAO CẦN GAME HUB
- **Tốc độ phát hành:** Thêm/sửa game qua **manifest** do BE quản lý, không cần build lại app chính.
- **Cá nhân hóa/A‑B test:** Chọn game theo profile học viên, seed, độ khó, rollout %.
- **Tách rời đội ngũ:** Đội content/game có thể dùng tech stack riêng; FE hub chỉ cần tuân giao thức.
- **An toàn & tuân thủ:** Kiểm soát dữ liệu tối thiểu (PII‑minimization), sandbox iFrame, token ngắn hạn.

---

## 2) KIẾN TRÚC TỔNG THỂ
**Luồng chính:**
1. FE Hub gọi **`GET /games`** → nhận **manifest** (danh sách game, runtime, entryUrl, capabilities…).
2. Người dùng chọn game → FE Hub gọi **`POST /sessions/start`** → nhận `sessionId`, `launchToken`.
3. FE Hub **mount** game theo `runtime`:
   - `iframe-html`: nhúng `<iframe>` + `postMessage` (`INIT` → `START`).
   - `esm-module`: `import(entryUrl)` rồi gọi `init(container, ctx, host)`.
4. Game phát sự kiện (`READY`, `SCORE_UPDATE`, `COMPLETE`, `REQUEST_SAVE`…) → Hub/BE xử lý (progress, telemetry, leaderboard…).

---

## 3) HAI RUNTIME & ĐÁNH ĐỔI
| Tiêu chí | `iframe-html` | `esm-module` |
|---|---|---|
| Cô lập & an toàn | Rất tốt (sandbox, khác origin) | Thấp hơn (chạy cùng context); cần tuyệt đối tin cậy code |
| Dễ tích hợp | Dễ, chỉ `postMessage` | Khó hơn (API lifecycle, cleanup) |
| Chia sẻ UI/Theme/Store | Hạn chế | Tốt (import shared libs) |
| Hiệu năng & kích thước | Overhead iFrame, libs lặp | Nhẹ nếu share libs; ít overhead messaging |
| CORS/COOP/COEP | Bị ràng buộc cross‑origin | Thuận lợi nếu cùng origin |
| Tin cậy bên thứ ba | Phù hợp | Không khuyến nghị |

**Quyết định nhanh:**
- **Chưa tin cậy/đa công nghệ** → `iframe-html`.
- **Tin cậy & cần hiệu năng/chia sẻ** → `esm-module`.

---

## 4) HỢP ĐỒNG DỮ LIỆU (TÓM TẮT)
**Manifest (BE → FE)**: `id`, `slug`, `title`, `version`, `runtime`, `entryUrl`, `capabilities`, `metadata`, `minHubVersion`, `rolloutPercentage`, `disabled`.

**LaunchContext (FE → Game)**: `playerId` (pseudonymous), `sessionId`, `launchToken` (JWT ≤15′, scope theo game), `locale`, `difficulty`, `seed`, `profile` rút gọn.

**Protocol Hub ↔ Game:**
- **Hub → Game:** `INIT`, `START`, `PAUSE`, `RESUME`, `QUIT`, `SET_STATE`.
- **Game → Hub:** `READY`, `SCORE_UPDATE`, `PROGRESS`, `COMPLETE`, `ERROR`, `REQUEST_SAVE`, `REQUEST_LOAD`, `TELEMETRY`.

---

## 5) GIAO TIẾP FE ↔ BE (API TỐI THIỂU)
- `GET /games?platform=web` → `GameManifest[]`
- `POST /sessions/start` → `{ sessionId, launchToken, expiry }`
- `POST /sessions/:id/finish` → `{ score, timeMs, progress }`
- `POST /progress/:gameId/save` & `GET /progress/:gameId/load`
- `POST /telemetry/batch` (batch + retry)
- `GET /leaderboard/:gameId?period=weekly`

**CORS/Origin:** whitelist domain Hub; ưu tiên Hub proxy call để đơn giản hóa bảo mật.

---

## 6) KHẢ THI & ĐỘ PHỨC TẠP (PHÂN RÃ THEO LỚP)
**FE Hub**
- Loader/Bridge: trung bình (iFrame dễ hơn ESM).
- State/Telemetry: trung bình (batch, throttle, backpressure).
- UX chung: pause khi tab ẩn, aspect‑ratio, resume/quit.
- Offline/PWA: precache manifest + top games, version busting.

**Game (nhóm plugin)**
- iFrame: thấp → triển khai nhanh.
- ESM: trung bình/khá → cần tuân thủ `init()`, lifecycle, cleanup.

**BE**
- Manifest + Session + JWT: thấp.
- Progress/Leaderboard/Telemetry: trung bình (ETL/aggregate tách write/read path).
- CDN/Asset: cache-control, immutable naming.

**Security/Compliance**
- iFrame: sandbox + check `origin`.
- ESM: chỉ tải từ whitelist/cùng origin; CSP nghiêm; không nhận third‑party chưa audit.
- Data trẻ em: PII‑minimization, retention policy.

---

## 7) BẢO MẬT (KEY POINTS)
- **iFrame:** `sandbox` + `allow` tối thiểu; **không** dùng `*` cho `postMessage` ở production; token ngắn hạn; ưu tiên Hub proxy.
- **ESM:** whitelist domain; ký/attest bản build; CSP chặt (không `eval`); không trộn third‑party chưa kiểm duyệt.
- **Dữ liệu:** chỉ truyền ID giả danh; chặn chuỗi tự do từ game; log an toàn.

---

## 8) HIỆU NĂNG & OFFLINE
- Prefetch manifest/icon; lazy load game khi chọn.
- iFrame: khuyến khích xài libs từ CDN chung (immutable) để cache.
- ESM: share libs bằng import maps/alias để giảm duplication.
- Auto‑pause khi `visibilitychange`; cleanup WebGL khi `QUIT`.
- PWA: precache **top N**; chiến lược **stale‑while‑revalidate** cho manifest.

---

## 9) VERSIONING & ROLLOUT
- SemVer cho game (`major.minor.patch`).
- `minHubVersion` + `capabilities` để thương lượng tính năng.
- Canary & A/B theo % người dùng, `seed`, `playerId`.
- Cho phép song song 2 version khi cần rollback nhanh.

---

## 10) TELEMETRY & PROGRESS (CHUẨN HÓA)
- Sự kiện chuẩn: `session_start`, `level_start`, `level_complete`, `score_update`, `mistake`, `hint_used`, `quit`, `fps_snapshot`.
- Schema tối thiểu: `t (ms)`, `sid`, `gid`, `ver`, `evt`, `payload`.
- Batch mỗi 5–10s hoặc N sự kiện; exponential backoff khi lỗi; TTL rõ ràng cho raw vs aggregate.

---

## 11) TESTING & QUALITY GATES
- **Contract tests** protocol (iFrame/ESM) bằng E2E (Playwright).
- **Chaos tests:** mất mạng, token hết hạn, resize, tab ẩn/dừng.
- **Performance budgets:** TTI, bundle size (ESM), FPS tối thiểu cho cấu hình máy mục tiêu.
- **Security checks:** origin/CSP; static analysis.
- **Content QA:** accessibility tối thiểu; âm thanh theo policy mobile.

---

## 12) DEVOPS & PHÁT HÀNH
- **CI/CD:** lint, type‑check SDK; build game → push CDN path bất biến (`/vX.Y.Z/…`); update manifest → smoke test `READY` trong X giây.
- **Rollback:** `disabled: true` hoặc hạ `rolloutPercentage` trong manifest; hub đọc realtime.
- **Observability:** dashboard tách Hub vs Game; error rate, avg session length, completion rate.

---

## 13) RỦI RO & BIỆN PHÁP
- **Rủi ro security (ESM):** code game ảnh hưởng host → **Giảm thiểu:** chỉ ESM cho code nội bộ đã audit; CSP nghiêm; sandbox scope.
- **Trôi hợp đồng giao tiếp:** team game làm sai protocol → **Giảm thiểu:** SDK + contract tests + checklist duyệt.
- **Overhead hiệu năng (iFrame):** libs trùng lặp → **Giảm thiểu:** CDN chung, split bundles, prefetch có chủ đích.
- **Telemetry noisy:** spam sự kiện → **Giảm thiểu:** throttle/batch, quota, schema whitelist.

---

## 14) LỘ TRÌNH TRIỂN KHAI (PHASES)
**P0 (1–2 tuần):**
- Hub cơ bản (list/launch), runtime `iframe-html`, `GET /games`, `POST /sessions/start`, protocol `INIT/READY/START/COMPLETE`.

**P1 (2–3 tuần):**
- Thêm `esm-module`; progress save/load; telemetry batch; pause/resume; PWA cơ bản.

**P2 (2 tuần):**
- Leaderboard, canary rollout, A/B; checklist QA; performance budgets; dashboards.

**P3 (liên tục):**
- Tối ưu cache, import maps, security hardening, content accessibility.

> Ước lượng ở trên mang tính tham chiếu; thực tế phụ thuộc số lượng game và mức A‑B.

---

## 15) KHUYẾN NGHỊ
1) Áp dụng **hybrid runtime**: đa số game dùng `iframe-html`, game “core” dùng `esm-module`.
2) Chuẩn hóa **SDK + contract tests** để giảm sai lệch giữa các nhóm phát triển game.
3) Thiết lập **manifest‑driven rollout** (canary/A‑B) + **observability** ngay từ đầu.
4) Thực thi **PII‑minimization**, token ngắn hạn, CSP nghiêm; chỉ ESM cho code đã kiểm duyệt.
5) Ưu tiên **pause/resume tự động** và **cleanup** để giảm nóng máy, cải thiện trải nghiệm.

---

## PHỤ LỤC A — MẪU MANIFEST (RÚT GỌN)
```json
{
  "id": "drag-drop-1",
  "title": "Kéo thả vào vị trí đúng",
  "version": "1.2.0",
  "runtime": "iframe-html",
  "entryUrl": "https://cdn.iruka.games/drag-drop-1/index.html",
  "capabilities": ["score", "save-progress"],
  "minHubVersion": "1.0.0",
  "rolloutPercentage": 100,
  "disabled": false
}
```

## PHỤ LỤC B — ENDPOINTS (TÓM TẮT)
- `GET /games?platform=web`
- `POST /sessions/start { gameId }`
- `POST /sessions/:id/finish { score, timeMs, progress }`
- `POST /progress/:gameId/save` / `GET /progress/:gameId/load`
- `POST /telemetry/batch`
- `GET /leaderboard/:gameId?period=weekly`

## PHỤ LỤC C — CHECKLIST DUYỆT GAME (TRÍCH YẾU)
- [ ] Tuân thủ protocol INIT/READY/START/COMPLETE
- [ ] Không gửi PII; telemetry theo schema chuẩn; batch/throttle
- [ ] FPS tối thiểu; cleanup khi QUIT; pause khi tab ẩn
- [ ] Không dùng CDN ngoài whitelist; license rõ ràng
- [ ] i18n: font fallback; `locale` áp dụng đúng
- [ ] Accessibility cơ bản (mute/captions/contrast)
- [ ] Security: origin check (iFrame) / CSP (ESM)

---

**Kết thúc báo cáo.**
