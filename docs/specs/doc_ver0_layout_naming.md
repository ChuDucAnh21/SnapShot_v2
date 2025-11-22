tuyệt rồi! dưới đây là bộ “từ điển tên gọi” gọn gàng để bạn đặt tên screen & UI component cho Iruka (Math-first, Duolingo-like learning path). Mình dùng English chuẩn, kèm nhóm chức năng rõ ràng để bạn map vào router, folder, và design system.

# App naming conventions

- **Screen names:** `PascalCase` (e.g., `LearningPathScreen`)
- **Route ids / URLs:** `kebab-case` (e.g., `/learning-path`)
- **Components:** `PascalCase` (e.g., `PathNode`)
- **Atoms (very small):** prefix with `Ui` (e.g., `UiButton`, `UiBadge`)

---

# Main screens (end-to-end flow)

1. **AppBootScreen** — splash, version check, prefetch.
2. **OnboardingScreen** — age, goals, placement intent.
3. **AuthScreen** — sign in/up (email, Google/Apple), PIN for kids.
4. **ProfileSetupScreen** — child name/avatar, parent link, baseline math goal.
5. **UserSnapshotScreen** — (Profile) strengths, gaps, radar/progress overview.
6. **SubjectPickerScreen** — choose **Math** (default pinned), others later.
7. **LearningPathScreen** — Duolingo-style path (nodes + checkpoints).
8. **UnitOverviewScreen** — unit goals, skills, estimated time, rewards.
9. **SessionIntroScreen** — warm welcome, objectives, lives/hearts, XP.
10. **SessionPlayerScreen** — question-by-question player (core).
11. **CheckpointScreen** — milestone quiz; pass/fail, unlock logic.
12. **SessionSummaryScreen** — XP earned, mistakes list, retry CTA.
13. **MistakesReviewScreen** — spaced review for wrong items.
14. **DailyGoalScreen** — set/adjust daily target, reminders.
15. **StreakScreen** — streak calendar, freeze items.
16. **AchievementsScreen** — badges, milestones, kids-friendly trophy room.
17. **RewardsShopScreen** — gems shop (avatars, themes, boosters).
18. **LeaderboardScreen** — weekly, class/family circles (optional).
19. **NotificationsInboxScreen** — system updates, teacher/parent notes.
20. **SettingsScreen** — profile, TTS, difficulty, haptics, parental controls.
21. **ParentDashboardScreen** — progress over time, weak skills, suggestions.
22. **ContentDownloadScreen** — preload assets for offline.
23. **DiagnosticsScreen** — audio test, animation, storage (internal/dev).

---

# Core navigation

- **AppHeader** (compact, large variants)
- **BottomTabBar** (Home/Path, Review, Achievements, Shop, Profile)
- **FloatingActionButton** (FAB) — quick resume last session
- **SideSheet / SettingsSheet** — quick toggles during session

---

# Learning path (Duolingo-style) components

- **PathCanvas** — scrollable vertical path container.
- **PathLane** — the “track” backbone.
- **PathConnector** — curve/line linking nodes.
- **PathNode** — base node (locked/unlocked/current/completed).
  - **LessonNode** — standard session node.
  - **CheckpointNode** — test gate.
  - **TreasureNode** — reward/gems node.
  - **ReviewNode** — spaced-repetition node from mistakes.

- **NodeBadge** — difficulty (A/B/C), star rating.
- **NodeStatusChip** — locked / new / perfect.
- **NodeTooltip** — short objective on hover/tap.
- **ProgressRibbon** — unit completion % on top of path.

---

# Session / question player components

- **SessionShell** — orchestrates question flow, lives, timers, hints.
- **PromptCard** — shows instruction/prompt with friendly tone.
- **MediaPanel** — image/animation/audio for the prompt.
- **ChoicesGrid** — multiple choices layout (2/3/4/6).
- **NumberPad** — 0-9, delete, submit (kid-safe big buttons).
- **TenFrameBoard** — ten-frame visual for counting/adding.
- **AbacusPad** — bead-based counting interaction.
- **DragDropBoard** — drag objects (apples, blocks) to bins.
- **TapTokens** — tap to select numbers/symbols in a sentence.
- **ArrangeStrip** — reorder tiles for sequencing.
- **MatchPairsGrid** — match images ↔ numbers / equations ↔ results.
- **ComparisonBar** — `>` `<` `=` selector with two stacks.
- **NumberLine** — jump visualization for +/− within 20.
- **HintPopover** — progressive hints.
- **FeedbackToast** — quick correct/incorrect feedback.
- **ExplanationPanel** — step-by-step reasoning (kid-friendly).
- **PraiseBanner** — positive reinforcement (emoji/mascot).
- **ConfettiBurst** — completion celebration.
- **SessionHUD** — XP, hearts, streak flame, progress dots.
- **PauseMenu** — quit, resume, sound, help.

---

# Math question type taxonomy (for naming & reuse)

> dùng cho `SessionPlayerScreen`, mỗi type = 1 component + schema

1. **SelectOne** — choose 1 correct answer from options (`ChoicesGrid`).
2. **TrueFalse** — quick boolean check (`ChoicesGrid 2`).
3. **TypeNumber** — enter answer (`NumberPad`).
4. **TapCountObjects** — tap-to-count to target (`MediaPanel` + tap).
5. **DragToCount** — drag N items into box (`DragDropBoard`).
6. **CompareNumbers** — select `>` `<` `=` (`ComparisonBar`).
7. **CompleteNumberLine** — place missing number (`NumberLine`).
8. **FillMissingNumber** — 1 ☐ 3, 5 ☐ 7 patterns (`TypeNumber` or `ChoicesGrid`).
9. **TenFrameFill** — fill to number with counters (`TenFrameBoard`).
10. **SingleDigitAdd** — within 10 (`TypeNumber` + **NumberLine** optional).
11. **SingleDigitSub** — within 10 (`TypeNumber` + **NumberLine**).
12. **MatchPairs** — number ↔ quantity / equation ↔ result (`MatchPairsGrid`).
13. **ArrangeOrder** — ascending/descending (`ArrangeStrip`).
14. **SelectImageAnswer** — pick picture representing number (`ChoicesGrid` images).
15. **WordProblemSimple** — 1-2 sentence story + answer (`MediaPanel` + `TypeNumber`).

---

# Feedback & gamification components

- **XpBar** — session XP progress.
- **StreakFlame** — current streak with animation.
- **HeartsMeter** — lives.
- **GoalRing** — daily goal completion ring.
- **BadgeCard** — achievement item.
- **RewardModal** — gems, unlocks.
- **LevelUpModal** — level progression celebration.
- **ProgressCard** — per-skill mastery bars (A/B/C stars).
- **ReviewChip** — marks items scheduled for review.

---

# Profile / snapshot & analytics components

- **SnapshotHeader** — avatar, name, grade/age.
- **CompetencyRadar** — high-level math facets (Number Sense, Counting, Comparison, Addition, Subtraction, Patterns/Shapes if needed).
- **MasteryBars** — skill breakdown.
- **RecentActivityList** — last sessions, XP, time.
- **WeakSkillsPanel** — suggested practice nodes.
- **ParentTipsCard** — at-home activities.

---

# Forms & utility components

- **UiButton / UiIconButton / UiToggle**
- **UiInput / UiNumberInput / UiPinInput**
- **UiSelect / UiSegmentedControl**
- **UiCard / UiSheet / UiDialog / UiPopover**
- **UiToast / UiSnackbar**
- **UiProgress / UiSpinner / UiSkeleton**
- **EmptyState** — no data yet.
- **ErrorState** — retry / contact support.

---

# Data model (entity naming for FE/BE contracts)

- **UserSnapshot** — strengths, gaps, preferences.
- **Subject** — `subject_id`, name (`"Math"`), grade band.
- **Path** — ordered **nodes[]**.
- **Node** — `{ node_id, type: "lesson"|"checkpoint"|"review"|"treasure", status, objective, est_time }`
- **Session** — `{ session_id, node_id, objectives[], lives, xp_reward }`
- **Question** — `{ question_id, type, prompt, media, choices?, correct, explanation }`
- **Attempt** — result, time_spent, hints_used.
- **Reward** — gems, badge_id, streak_updates.

---

# Recommended tab structure (child)

- **Home (LearningPathScreen)**
- **Review (MistakesReviewScreen)**
- **Achievements**
- **Shop**
- **Profile**

# Recommended tab structure (parent)

- **ChildProgress (ParentDashboardScreen)**
- **NotificationsInbox**
- **Settings**

---

# Suggested file/folder names

```
/screens
  LearningPathScreen.tsx
  SessionPlayerScreen.tsx
  CheckpointScreen.tsx
  SessionSummaryScreen.tsx
  UserSnapshotScreen.tsx
  AchievementsScreen.tsx
  RewardsShopScreen.tsx
  LeaderboardScreen.tsx
  SettingsScreen.tsx
/components
  path/
    PathCanvas.tsx
    PathLane.tsx
    PathNode.tsx
    LessonNode.tsx
    CheckpointNode.tsx
    PathConnector.tsx
  session/
    SessionShell.tsx
    PromptCard.tsx
    MediaPanel.tsx
    ChoicesGrid.tsx
    NumberPad.tsx
    TenFrameBoard.tsx
    DragDropBoard.tsx
    ComparisonBar.tsx
    NumberLine.tsx
    FeedbackToast.tsx
    ExplanationPanel.tsx
    PraiseBanner.tsx
    SessionHUD.tsx
  gamification/
    XpBar.tsx
    StreakFlame.tsx
    HeartsMeter.tsx
    RewardModal.tsx
    LevelUpModal.tsx
  snapshot/
    CompetencyRadar.tsx
    MasteryBars.tsx
    WeakSkillsPanel.tsx
  common/
    UiButton.tsx
    UiInput.tsx
    UiDialog.tsx
    UiToast.tsx
```

---

nếu bạn muốn, mình có thể xuất ngay một **checklist JSON** cho BE/FE contract (Path → Session → Questions) hoặc generate sườn HTML/Tailwind của **LearningPathScreen** với các `PathNode` y hệt Duolingo để bạn chạy demo PWA.
