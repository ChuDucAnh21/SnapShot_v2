/\*

- Iruka Math Core — Frontend Type Models + Mock Data (Next.js 15)
- Focus: clear, strongly-typed models for lesson/templates/items/challenges/milestones
- Usage: import what you need in your components/stores; UI rendering is out of scope.
  \*/

// ================
// 1) Core Enums
// ================
export enum Domain {
Numbers = "numbers",
Operations = "operations",
Measurement = "measurement",
Shapes = "shapes",
Reasoning = "reasoning",
}

export enum AgeBand {
Age4 = 4,
Age5 = 5,
Age6 = 6,
Age7 = 7,
Age8 = 8,
}

export type ItemType =
| "choose_one"
| "true_false"
| "type_number"
| "tap_to_count"
| "drag_to_count"
| "compare_numbers"
| "complete_number_line"
| "fill_missing_number"
| "ten_frame_fill"
| "single_digit_add"
| "single_digit_subtract"
| "match_pairs"
| "arrange_order"
| "select_image_answer"
| "word_problem_simple";

export type InputMode = "tap" | "drag" | "keypad";

// ================
// 2) Core Entities
// ================
export interface Skill {
id: string; // e.g., "skill.numbers.recognize_1_10"
code: string; // short code for FE/BE
name: string;
domain: Domain;
recommendedAges: AgeBand[]; // used for targeting
description?: string;
}

export interface UIBehavior {
input: InputMode;
autoSubmit: boolean; // auto-submit (e.g., tap) vs requires a Submit action
}

export interface Choice {
id: string; // stable for telemetry
label?: string; // visible text (if any)
value: string | number; // canonical value for evaluator
imageUrl?: string; // optional asset
}

export interface Assets {
images?: string[]; // CDN or local paths (mock ok)
audioUrl?: string;
}

export interface GeneratedItem {
id: string; // unique per render
type: ItemType;
prompt: string; // localized prompt string
assets?: Assets;
choices?: Choice[]; // for MCQ/select/tap
answerKey: string | number | (string | number)[]; // evaluator uses this
ui: UIBehavior;
difficulty: number; // 0..1 (rough indicator)
skillId: string; // back-reference for mastery update
meta?: Record<string, unknown>; // any renderer hints
}

export interface ItemRef { // how lessons refer to template+seed
fromTemplateId: string;
seed: string; // deterministic seed, FE can store for replay
}

export interface TemplateBase {
id: string;
type: ItemType;
skillId: string; // skill it trains
paramsSchema: Record<string, unknown>; // JSON-schema-like (kept permissive for FE)
distractorStrategy?: string; // docstring for BE generator
validatorNotes?: string; // FE-side prechecks
ui: UIBehavior; // default UI behavior for this template
}

export interface LessonData {
id: string;
title: string;
skillIds: string[]; // primary targeted skills
estimatedMinutes: number; // rough time budget
items: ItemRef[]; // resolved lazily via generator (mock below)
}

export interface PassRule {
minCorrect: number; // pass threshold
maxTimeMs?: number; // optional time cap
}

export interface ChallengeSpec {
id: string;
title: string;
itemRefs: ItemRef[]; // mixed skills (spiral)
passRule: PassRule;
onPass?: { unlockUnitId?: string };
onFail?: { remedialPlan?: string };
}

export interface MilestoneSpec {
id: string;
title: string;
challengeId: string; // ties to a ChallengeSpec
}

export interface UserSkillMastery {
userId: string;
skillId: string;
mastery: number; // 0..1
updatedAt: string; // ISO date
}

// Telemetry event union (minimal for FE wiring)
export type TelemetryEvent =
| {
type: "lesson_start";
lessonId: string;
ts: string;
}
| {
type: "question_view";
lessonId: string;
itemId: string;
ts: string;
}
| {
type: "answer_submit";
lessonId: string;
itemId: string;
attempt: number;
payload: unknown;
ts: string;
}
| {
type: "answer_result";
lessonId: string;
itemId: string;
isCorrect: boolean;
latencyMs: number;
usedHint?: boolean;
skipped?: boolean;
ts: string;
}
| {
type: "lesson_complete";
lessonId: string;
stars: 0 | 1 | 2 | 3;
ts: string;
};

// =====================================
// 3) Mock Taxonomy (Skills) & Templates
// =====================================
export const MOCK_SKILLS: Skill[] = [
{
id: "skill.numbers.recognize_1_10",
code: "NUM_RECOG_1_10",
name: "Nhận biết số 1–10",
domain: Domain.Numbers,
recommendedAges: [AgeBand.Age4, AgeBand.Age5],
description: "Nhìn số, chọn đúng ký hiệu 1–10.",
},
{
id: "skill.numbers.count_to_10",
code: "COUNT_TO_10",
name: "Đếm đến 10",
domain: Domain.Numbers,
recommendedAges: [AgeBand.Age4, AgeBand.Age5],
description: "Đếm đồ vật và chọn số tương ứng.",
},
{
id: "skill.numbers.compare_0_10",
code: "COMPARE_0_10",
name: "So sánh số 0–10",
domain: Domain.Numbers,
recommendedAges: [AgeBand.Age5, AgeBand.Age6],
description: "Chọn dấu >, <, = đơn giản.",
},
{
id: "skill.operations.add_1digit_nocarry",
code: "ADD_1D_NC",
name: "Cộng 1 chữ số (không nhớ)",
domain: Domain.Operations,
recommendedAges: [AgeBand.Age6, AgeBand.Age7],
description: "Cộng trong phạm vi 0–10, không nhớ.",
},
];

export const MOCK_TEMPLATES: TemplateBase[] = [
{
id: "tpl.choose_one.number_identify",
type: "choose_one",
skillId: "skill.numbers.recognize_1_10",
paramsSchema: {
range: { min: 1, max: 10 },
choices: 4,
distractor: "nearby±1",
},
distractorStrategy: "Generate 3 distractors around target within [1..10], avoiding duplicates",
validatorNotes: "Ensure numbers are within [1..10] and unique choices",
ui: { input: "tap", autoSubmit: true },
},
{
id: "tpl.tap_to_count.objects",
type: "tap_to_count",
skillId: "skill.numbers.count_to_10",
paramsSchema: {
maxObjects: 10,
objectKind: ["apple", "star", "ball"],
},
distractorStrategy: "Vary object arrangement; answer is exact count",
validatorNotes: "Images must clearly show individual items",
ui: { input: "tap", autoSubmit: false },
},
{
id: "tpl.compare_numbers.basic",
type: "compare_numbers",
skillId: "skill.numbers.compare_0_10",
paramsSchema: {
aRange: { min: 0, max: 10 },
bRange: { min: 0, max: 10 },
gap: { min: 1, max: 3 },
operators: [">", "<", "="]
},
distractorStrategy: "Offer 3 symbols with 1 correct comparator",
validatorNotes: "Avoid identical pairs unless '=' is included",
ui: { input: "tap", autoSubmit: true },
},
{
id: "tpl.single_digit_add.nocarry",
type: "single_digit_add",
skillId: "skill.operations.add_1digit_nocarry",
paramsSchema: {
addendRange: { min: 0, max: 9 },
resultMax: 10,
showVisualAid: true,
choices: 3,
},
distractorStrategy: "±1 of correct answer and swapped addends if unique",
validatorNotes: "Ensure sum ≤ 10",
ui: { input: "keypad", autoSubmit: false },
},
];

// ===============================
// 4) Mock Lessons / Challenge etc
// ===============================
export const MOCK_LESSON_COUNT_1_10: LessonData = {
id: "lesson.numbers.1_10.basics",
title: "Làm quen số 1–10",
skillIds: [
"skill.numbers.recognize_1_10",
"skill.numbers.count_to_10",
],
estimatedMinutes: 8,
items: [
{ fromTemplateId: "tpl.choose_one.number_identify", seed: "A-001" },
{ fromTemplateId: "tpl.tap_to_count.objects", seed: "A-002" },
{ fromTemplateId: "tpl.choose_one.number_identify", seed: "A-003" },
{ fromTemplateId: "tpl.tap_to_count.objects", seed: "A-004" },
],
};

export const MOCK_CHALLENGE_SPIRAL_1: ChallengeSpec = {
id: "challenge.mix.0_10.basic",
title: "Ôn tập xoáy ốc 0–10",
itemRefs: [
{ fromTemplateId: "tpl.choose_one.number_identify", seed: "C-101" },
{ fromTemplateId: "tpl.compare_numbers.basic", seed: "C-102" },
{ fromTemplateId: "tpl.single_digit_add.nocarry", seed: "C-103" },
],
passRule: { minCorrect: 2 },
onPass: { unlockUnitId: "unit.numbers.0_20" },
onFail: { remedialPlan: "micro:count_to_10, number_line_0_10" },
};

export const MOCK_MILESTONE_1: MilestoneSpec = {
id: "ms.numbers.stage1",
title: "Checkpoint Số cơ bản",
challengeId: "challenge.mix.0_10.basic",
};

// =====================================
// 5) Mini Generator (mock-only, FE side)
// Deterministic from (templateId, seed) -> GeneratedItem
// NOTE: In production, BE should own generation for integrity.
// =====================================

// Simple seeded PRNG for deterministic mock data
function xorshift32(seedStr: string): () => number {
let h = 2166136261 >>> 0;
for (let i = 0; i < seedStr.length; i++) {
h ^= seedStr.charCodeAt(i);
h = Math.imul(h, 16777619);
}
let x = h || 88675123;
return () => {
// XorShift-like
x ^= x << 13;
x ^= x >>> 17;
x ^= x << 5;
// to [0,1)
return ((x >>> 0) % 1_000_000) / 1_000_000;
};
}

function pick<T>(rng: () => number, arr: T[]): T {
return arr[Math.floor(rng() * arr.length)]!;
}

function uniqueInts(rng: () => number, count: number, min: number, max: number, exclude: number[] = []): number[] {
const s = new Set<number>(exclude);
while (s.size < count + exclude.length) {
const v = min + Math.floor(rng() \* (max - min + 1));
if (!s.has(v)) s.add(v);
}
return Array.from(s).filter((v) => !exclude.includes(v)).slice(0, count);
}

export function resolveItemRef(ref: ItemRef): GeneratedItem {
const tpl = MOCK_TEMPLATES.find((t) => t.id === ref.fromTemplateId);
if (!tpl) throw new Error(`Template not found: ${ref.fromTemplateId}`);
const rng = xorshift32(`${tpl.id}#${ref.seed}`);

const id = `item.${tpl.id}.${ref.seed}`;
const ui = tpl.ui;
const skillId = tpl.skillId;
const difficulty = Math.round(rng() \* 50) / 100; // 0..0.5 (mock)

switch (tpl.id) {
case "tpl.choose*one.number_identify": {
const target = 1 + Math.floor(rng() * 10); // 1..10
const distractors = uniqueInts(rng, 3, 1, 10, [target]);
const options = [target, ...distractors].sort(() => (rng() < 0.5 ? -1 : 1));
return {
id,
type: tpl.type,
prompt: `Chọn số ${target}`,
choices: options.map((n, i) => ({ id: `c${i}`, label: String(n), value: n })),
answerKey: target,
ui,
difficulty,
skillId,
};
}
case "tpl.tap*to_count.objects": {
const max = (tpl.paramsSchema as any).maxObjects ?? 10;
const count = 1 + Math.floor(rng() * Math.min(10, max));
return {
id,
type: tpl.type,
prompt: "Hãy đếm số đồ vật",
assets: { images: ["/mock/objects.png"] },
answerKey: count,
ui,
difficulty,
skillId,
meta: { objectCount: count },
};
}
case "tpl.compare*numbers.basic": {
const gapMin = (tpl.paramsSchema as any).gap?.min ?? 1;
const gapMax = (tpl.paramsSchema as any).gap?.max ?? 3;
const a = Math.floor(rng() * 10);
const gap = gapMin + Math.floor(rng() _ (gapMax - gapMin + 1));
const b = rng() < 0.5 ? a + gap : Math.max(0, a - gap);
const correct = a > b ? ">" : a < b ? "<" : "=";
const ops = [">", "<", "="];
return {
id,
type: tpl.type,
prompt: `${a} ? ${b}`,
choices: ops.map((op, i) => ({ id: `op${i}`, label: op, value: op })),
answerKey: correct,
ui,
difficulty,
skillId,
};
}
case "tpl.single_digit_add.nocarry": {
let a = Math.floor(rng() _ 10);
let b = Math.floor(rng() \_ (10 - a)); // ensure a+b <= 10
const sum = a + b;
const distractors = uniqueInts(rng, 2, 0, 10, [sum]);
const opts = [sum, ...distractors].sort(() => (rng() < 0.5 ? -1 : 1));
return {
id,
type: tpl.type,
prompt: `${a} + ${b} = ?`,
choices: opts.map((n, i) => ({ id: `o${i}`, label: String(n), value: n })),
answerKey: sum,
ui,
difficulty,
skillId,
meta: { a, b },
};
}
default:
// Fallback minimal item
return {
id,
type: tpl.type,
prompt: "(mock) Item chưa được hiện thực hoá",
answerKey: "",
ui,
difficulty,
skillId,
};
}
}

// =====================================
// 6) Example: Resolve a whole lesson to concrete items
// =====================================
export function resolveLesson(lesson: LessonData): GeneratedItem[] {
return lesson.items.map(resolveItemRef);
}

// =====================================
// 7) Minimal Evaluator (type-safe, mock)
// =====================================
export function evaluateAnswer(item: GeneratedItem, userAnswer: unknown): boolean {
if (Array.isArray(item.answerKey)) {
if (!Array.isArray(userAnswer)) return false;
const a = [...(item.answerKey as (string | number)[])].map(String).sort();
const b = [...(userAnswer as (string | number)[])].map(String).sort();
return a.length === b.length && a.every((v, i) => v === b[i]);
}
return String(item.answerKey) === String(userAnswer);
}

// =====================================
// 8) Mock Mastery Update (Elo-lite placeholder)
// =====================================
export function updateMastery(current: number, isCorrect: boolean, k = 0.04): number {
const target = isCorrect ? 1 : 0;
let next = current + k \* (target - current);
if (next < 0) next = 0;
if (next > 1) next = 1;
return Number(next.toFixed(4));
}

// =====================================
// 9) Convenience Bundles for quick import
// =====================================
export const MOCK_CONTENT_BUNDLE = {
skills: MOCK_SKILLS,
templates: MOCK_TEMPLATES,
lessons: {
LESSON_COUNT_1_10: MOCK_LESSON_COUNT_1_10,
},
challenges: {
CHALLENGE_SPIRAL_1: MOCK_CHALLENGE_SPIRAL_1,
},
milestones: {
MILESTONE_1: MOCK_MILESTONE_1,
},
};

/\*
// ===============
// 10) Usage Demo
// ===============
// import { MOCK_CONTENT_BUNDLE, resolveLesson, evaluateAnswer, updateMastery } from "./iruka-math-core-frontend-mocks";

const lesson = MOCK_CONTENT_BUNDLE.lessons.LESSON_COUNT_1_10;
const items = resolveLesson(lesson);
const first = items[0];
const correct = evaluateAnswer(first, (first.choices?.[0]?.value ?? ""));
const newMastery = updateMastery(0.52, correct);
\*/

import {
MOCK_CONTENT_BUNDLE,
resolveLesson,
evaluateAnswer,
updateMastery,
} from "@/iruka-math-core-frontend-mocks";

const lesson = MOCK_CONTENT_BUNDLE.lessons.LESSON_COUNT_1_10;
const items = resolveLesson(lesson); // -> GeneratedItem[]
const ok = evaluateAnswer(items[0], items[0].choices?.[0]?.value);
const mastery1 = updateMastery(0.5, ok); // Elo-lite mock
