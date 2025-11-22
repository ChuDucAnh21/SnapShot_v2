// Rules applied: ts:consistent-type-definitions:type, brace-style:1tbs

// ================
// 1) Core Enums
// ================
export enum Domain {
  Numbers = 'numbers',
  Operations = 'operations',
  Measurement = 'measurement',
  Shapes = 'shapes',
  Reasoning = 'reasoning',
}

export enum AgeBand {
  Age4 = 4,
  Age5 = 5,
  Age6 = 6,
  Age7 = 7,
  Age8 = 8,
}

export type ItemType
  = | 'choose_one'
    | 'true_false'
    | 'type_number'
    | 'tap_to_count'
    | 'drag_to_count'
    | 'compare_numbers'
    | 'complete_number_line'
    | 'fill_missing_number'
    | 'ten_frame_fill'
    | 'single_digit_add'
    | 'single_digit_subtract'
    | 'match_pairs'
    | 'arrange_order'
    | 'select_image_answer'
    | 'word_problem_simple';

export type InputMode = 'tap' | 'drag' | 'keypad';

// ================
// 2) Core Entities
// ================
export type Skill = {
  id: string; // e.g., "skill.numbers.recognize_1_10"
  code: string; // short code for FE/BE
  name: string;
  domain: Domain;
  recommendedAges: AgeBand[]; // used for targeting
  description?: string;
};

export type UIBehavior = {
  input: InputMode;
  autoSubmit: boolean; // auto-submit (e.g., tap) vs requires a Submit action
};

export type Choice = {
  id: string; // stable for telemetry
  label?: string; // visible text (if any)
  value: string | number; // canonical value for evaluator
  imageUrl?: string; // optional asset
};

export type Assets = {
  images?: string[]; // CDN or local paths (mock ok)
  audioUrl?: string;
};

export type GeneratedItem = {
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
};

export type ItemRef = {
  // how lessons refer to template+seed
  fromTemplateId: string;
  seed: string; // deterministic seed, FE can store for replay
};

export type TemplateBase = {
  id: string;
  type: ItemType;
  skillId: string; // skill it trains
  paramsSchema: Record<string, unknown>; // JSON-schema-like (kept permissive for FE)
  distractorStrategy?: string; // docstring for BE generator
  validatorNotes?: string; // FE-side prechecks
  ui: UIBehavior; // default UI behavior for this template
};

export type LessonData = {
  id: string;
  title: string;
  skillIds: string[]; // primary targeted skills
  estimatedMinutes: number; // rough time budget
  items: ItemRef[]; // resolved lazily via generator (mock below)
};

export type PassRule = {
  minCorrect: number; // pass threshold
  maxTimeMs?: number; // optional time cap
};

export type ChallengeSpec = {
  id: string;
  title: string;
  itemRefs: ItemRef[]; // mixed skills (spiral)
  passRule: PassRule;
  onPass?: { unlockUnitId?: string };
  onFail?: { remedialPlan?: string };
};

export type MilestoneSpec = {
  id: string;
  title: string;
  challengeId: string; // ties to a ChallengeSpec
};

export type UserSkillMastery = {
  userId: string;
  skillId: string;
  mastery: number; // 0..1
  updatedAt: string; // ISO date
};

// Telemetry event union (minimal for FE wiring)
export type TelemetryEvent
  = | {
    type: 'lesson_start';
    lessonId: string;
    ts: string;
  }
  | {
    type: 'question_view';
    lessonId: string;
    itemId: string;
    ts: string;
  }
  | {
    type: 'answer_submit';
    lessonId: string;
    itemId: string;
    attempt: number;
    payload: unknown;
    ts: string;
  }
  | {
    type: 'answer_result';
    lessonId: string;
    itemId: string;
    isCorrect: boolean;
    latencyMs: number;
    usedHint?: boolean;
    skipped?: boolean;
    ts: string;
  }
  | {
    type: 'lesson_complete';
    lessonId: string;
    stars: 0 | 1 | 2 | 3;
    ts: string;
  };
