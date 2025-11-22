# UI Spec — Clone Duolingo Profile (Dark Theme)

> Mục tiêu: Bạn đã có **base layout (AppShell/SideNav/RightRail)**. Tài liệu này chỉ mô tả phần **Main Profile** để clone y hệt bố cục/ảnh. Công nghệ gợi ý: Next.js 15 + Tailwind. Tất cả thông số bên dưới đủ để dựng nhanh: **layout, component, props, style tokens, responsive, a11y, state**.

---

## 1) Tổng quan layout

- **AppShell**: 3 cột cố định
  - **SideNav (trái)**: bạn đã có.
  - **Main (giữa)**: **max-w 980–1040px**, căn giữa, padding x = 24px (≥ md), y = 24–32px.
  - **RightRail (phải)**: **width ~ 320px**, cách Main 24px.
- **Theme**: Dark, nền #0F1720 ~ #111827 (gần Tailwind `slate-900`), chữ chính `#E5E7EB` (slate-200), chữ phụ `#94A3B8` (slate-400).
- **Font**: hệ thống/Sans (Inter/NotoSans). Cỡ chữ:
  - Title (profile name): 28–32px, `font-semibold`.
  - Section title: 18px, `font-semibold`.
  - Body: 14–16px.
- **Corners**: thẻ bo góc **16px** (`rounded-2xl`).
- **Borders**: 1px **slate-700** với `opacity: 0.6`.
- **Shadow**: nhẹ `shadow-[0_1px_0_#00000033,0_8px_24px_#00000022]`.
- **Spacing**: khoảng cách khối 16–24px; lưới trong thẻ 16px.

---

## 2) Cây component

```
ProfilePage
├─ ProfileHeaderCard
│  ├─ Cover (placeholder dark) + EditButton (pencil)
│  ├─ Avatar (circle big, dashed outline)
│  ├─ DisplayName + Handle + JoinedDate
│  ├─ SocialCounts (Following/Followers links)
│  └─ FlagBadge (ngôn ngữ chính)
├─ StatsSection
│  ├─ StatCard: Day streak
│  ├─ StatCard: Total XP
│  ├─ StatCard: Current league
│  └─ StatCard: Top 3 finishes
├─ AchievementsSection
│  ├─ SectionHeader (title + "VIEW ALL")
│  └─ AchievementCard x N (thumbnail + name + progress "0/3")
└─ RightRail
   ├─ SocialPanel (Tabs: Following/Followers)
   └─ AddFriendsPanel (Find / Invite)
```

---

## 3) Grid & kích thước

- **Main column**:
  - `ProfileHeaderCard`: full width (~ 700–720px khi có RightRail).
  - `StatsSection`: grid 2×2, item **330×120px** (tuỳ màn), `gap-16`.
  - `AchievementsSection`: list dọc, mỗi card **h=96–110px**.
- **RightRail**:
  - `SocialPanel`: **min-h 280px**, `padding 16–20px`.
  - `AddFriendsPanel`: **min-h 160px**.
- **Responsive**:
  - `lg` (≥1024): 2 cột (Main + RightRail).
  - `md` (<1024): RightRail xuống dưới Main; Stats grid chuyển 2×2 → 1×4 (`grid-cols-1`).
  - `sm` (<640): thu nhỏ padding 12px; font 14px.

---

## 4) Style tokens (Tailwind CSS)

```css
:root {
  --bg: #0f1720; /* page */
  --surface: #141c25; /* cards */
  --surface-2: #0f1720; /* cover */
  --border: #1f2a37; /* slate-800ish */
  --text: #e5e7eb; /* slate-200 */
  --muted: #94a3b8; /* slate-400 */
  --accent: #22d3ee; /* cyan-400 (links) */
  --gold: #fbbf24; /* badges */
  --heart: #ef4444; /* red-500 */
  --gem: #60a5fa; /* blue-400 */
}
```

- **Card base**: `bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow`.
- **Heading**: `text-[var(--text)]` ; **subtext/link**: `text-[var(--muted)] hover:text-[var(--text)]`.
- **Icon chips** (streak/gem/heart): `inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-[#0b1118]`.

---

## 5) Chi tiết từng component

### 5.1 ProfileHeaderCard

- **Cover**: khối `h-36 md:h-44` nền `var(--surface-2)`; **EditButton** (pencil) đặt góc phải trên: `absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 grid place-content-center`.
- **Avatar**: `-mt-10 ml-6 h-24 w-24 rounded-full bg-[#15212b] grid place-content-center border-2 border-dashed border-[#4b6b84]` + icon `+`.
- **Name/Handle/Joined**:
  - Name: `text-2xl md:text-3xl font-semibold mt-2 ml-6`.
  - Handle: `text-[var(--muted)] ml-6` (ví dụ `@SonNguyen534804`).
  - Joined: `text-[var(--muted)] ml-6 mt-1` ("Joined September 2025").
- **SocialCounts**: dưới dòng joined, `ml-6 mt-2 flex gap-6 text-[var(--accent)] text-sm` với link **0 Following / 0 Followers**.
- **FlagBadge** (quốc kỳ): nút nhỏ nổi bên phải của card (`absolute` top ~ 88px right ~ 16px): `h-8 w-8 rounded-md overflow-hidden ring-1 ring-[var(--border)]`.
- **Divider**: đường mảnh `border-t border-[var(--border)] mt-4` chạy ngang card (giống ảnh).

### 5.2 StatCard (4 ô)

- **Kích thước**: `h-[112px]` `rounded-2xl` `border` `bg-[var(--surface)]` `px-5 py-4`.
- **Icon** trái + **title** nhỏ + **value** lớn:
  - Title: `text-sm text-[var(--muted)]`.
  - Value: `text-2xl font-semibold text-[var(--text)] mt-1`.
- **Icons**:
  - **Flame** (streak) `text-[#f59e0b]`.
  - **Bolt** (XP) `text-[#38bdf8]`.
  - **Shield** (league) `text-[#64748b]` (khi `None` → mờ 40%).
  - **Trophy** (Top 3) `text-[#f59e0b]` mờ khi 0.
- Trạng thái **empty**: value `0` hoặc `None` → card `opacity-70` + icon `opacity-60`.

### 5.3 AchievementsSection

- **Header**: `flex items-center justify-between mt-6 mb-3`
  - Left: `text-lg font-semibold` ("Achievements").
  - Right: link `VIEW ALL` `text-sm text-[var(--accent)] hover:text-cyan-300`.
- **AchievementCard**:
  - Layout: `grid grid-cols-[72px_1fr_auto] gap-4 items-center rounded-2xl border bg-[var(--surface)] px-4 py-3`.
  - **Thumb** 64×64 (svg/png), bo 12px.
  - **Title** (vd: "Wildfire") `text-[var(--text)] font-medium`.
  - **Progress** ("0/3"): `text-sm text-[var(--muted)]` đặt cột phải.

### 5.4 RightRail

- **SocialPanel** (tabs):
  - Container: card base + `p-4`.
  - Tabs: `FOLLOWING` (active) / `FOLLOWERS` (inactive).
    - Active tab: `text-[var(--text)] border-b-2 border-cyan-400 pb-2`.
    - Inactive: `text-[var(--muted)] hover:text-[var(--text)] pb-2`.
  - Nội dung ảnh minh hoạ + caption: `text-[var(--muted)] mt-3`.
- **AddFriendsPanel**:
  - Card base + `p-4` + title `text-base font-semibold`.
  - 2 dòng CTA:
    - Row: icon + label + chevron-right `>`
    - Style: `hover:bg-white/5 rounded-xl px-3 py-2 cursor-pointer`.

---

## 6) Props & dữ liệu (mock)

```ts
export type ProfileData = {
  id: string;
  name: string; // Son Nguyen
  handle: string; // SonNguyen534804
  joinedAt: string; // 2025-09-01
  streak: number; // 0
  totalXP: number; // 0
  currentLeague: string; // "None" | "Bronze" | ...
  top3Finishes: number; // 0
  achievements: { id: string; title: string; icon: string; progress: [number, number] }[];
  primaryFlag: string; // /flags/vn.png
  following: number; // 0
  followers: number; // 0
};
```

Mock ví dụ (theo ảnh):

```js
{
  id:"u1", name:"Son Nguyen", handle:"SonNguyen534804", joinedAt:"2025-09-01",
  streak:0, totalXP:0, currentLeague:"None", top3Finishes:0,
  achievements:[{id:"a1", title:"Wildfire", icon:"/ach/wildfire.png", progress:[0,3]}],
  primaryFlag:"/flags/vn.png", following:0, followers:0
}
```

---

## 7) HTML/Tailwind khung chính (rút gọn)

```html
<main class="mx-auto max-w-[1024px] px-6 py-6 text-[var(--text)]">
  <!-- Header Card -->
  <section class="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
    <div class="h-40 bg-[var(--surface-2)]"></div>
    <button class="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 grid place-content-center">
      ✎
    </button>
    <div class="px-6 pb-6">
      <div
        class="-mt-10 h-24 w-24 rounded-full border-2 border-dashed border-[#4b6b84] bg-[#15212b] grid place-content-center"
      >
        +
      </div>
      <h1 class="mt-2 text-3xl font-semibold">Son Nguyen</h1>
      <div class="text-[var(--muted)]">SonNguyen534804</div>
      <div class="text-[var(--muted)] mt-1">Joined September 2025</div>
      <div class="mt-2 flex gap-6 text-cyan-300 text-sm"><a>0 Following</a><a>0 Followers</a></div>
      <div class="absolute top-24 right-4 h-8 w-8 rounded-md overflow-hidden ring-1 ring-[var(--border)]">
        <img src="/flags/vn.png" alt="Vietnam" />
      </div>
      <div class="mt-4 border-t border-[var(--border)]"></div>
    </div>
  </section>

  <!-- Stats -->
  <section class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="h-[112px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 opacity-70">
      <div class="text-sm text-[var(--muted)]">Day streak</div>
      <div class="text-2xl font-semibold mt-1">0</div>
    </div>
    <div class="h-[112px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <div class="text-sm text-[var(--muted)]">Total XP</div>
      <div class="text-2xl font-semibold mt-1">0</div>
    </div>
    <div class="h-[112px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 opacity-70">
      <div class="text-sm text-[var(--muted)]">Current league</div>
      <div class="text-2xl font-semibold mt-1">None</div>
    </div>
    <div class="h-[112px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 opacity-70">
      <div class="text-sm text-[var(--muted)]">Top 3 finishes</div>
      <div class="text-2xl font-semibold mt-1">0</div>
    </div>
  </section>

  <!-- Achievements -->
  <section class="mt-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Achievements</h2>
      <a class="text-sm text-cyan-300 hover:text-cyan-200">VIEW ALL</a>
    </div>
    <div class="grid gap-3">
      <article
        class="grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
      >
        <img class="h-16 w-16 rounded-xl" src="/ach/wildfire.png" alt="Wildfire" />
        <div class="font-medium">Wildfire</div>
        <div class="text-sm text-[var(--muted)]">0/3</div>
      </article>
    </div>
  </section>
</main>
```

> RightRail dựng tương tự: hai card `SocialPanel`, `AddFriendsPanel` đặt trong cột bên với `w-[320px]`.

---

## 8) A11y & Interaction

- Avatar/cover edit buttons: `aria-label="Edit cover"`, `aria-label="Edit avatar"`.
- Links Following/Followers: focus ring `focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded`.
- Cards dùng role `group` để bật hover subtle: `group-hover:bg-white/5`.

---

## 9) States

- **Loading**: sử dụng skeleton shimmer cho Avatar, title, stat cards (`animate-pulse bg-white/5`).
- **Empty**: như ảnh: nhiều giá trị `0`, league `None` → giảm `opacity`.
- **Error**: toast trên cùng `bg-red-500/10 border border-red-500/30 text-red-300`.

---

## 10) Kiểm thử nhanh (QA)

- [ ] Main width ≤ 1040px, RightRail = 320px, gap = 24px.
- [ ] Header Card có divider ngang sau phần social.
- [ ] StatCard 2×2 (desktop) → 1×4 (tablet/mobi).
- [ ] Achievements có nút "VIEW ALL" căn phải.
- [ ] Màu chữ phụ ≈ slate-400; bg card tối hơn page 1 nấc.

---

## 11) Mapping dữ liệu → UI

- `streak → Day streak`, `totalXP → Total XP`, `currentLeague → Current league`, `top3Finishes → Top 3 finishes`.
- `achievements[n].progress` hiển thị `a/b` ở cột phải.
- `following/followers` liên kết mở modal danh sách.

---

### Kết

Spec này bao đủ thông số clone bố cục/visual của Profile Duolingo trong ảnh. Nếu cần, mình sẽ tách ra thành **component starter** (`ProfileHeaderCard.tsx`, `StatCard.tsx`, `AchievementCard.tsx`, `SocialPanel.tsx`) kèm Tailwind class chi tiết.
