// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type {
  CompleteSessionReq,
  CompleteSessionRes,
  GenerateSessionReq,
  GenerateSessionRes,
  GetSessionRes,
  Session,
  StartSessionRes,
  SubmitActivityResultReq,
  SubmitActivityResultRes,
} from '@/features/sessions/types';

export const mockSessions = new Map<string, Session>([
  [
    'node-001',
    {
      session_id: 'node-001',
      learner_id: 'learner-001',
      node_id: 'node-001',
      skill_name: 'Number Recognition 0–5',
      duration: 20,
      activities: [
        {
          activity_id: 'act-001-01',
          phase: 'warm_up',
          type: 'question',
          duration: 3,
          content: {
            prompt: 'Nhìn chấm ●●● và chọn số đúng:',
            choices: [
              { id: 'A', label: '2' },
              { id: 'B', label: '3' },
              { id: 'C', label: '5' },
            ],
            correct_choice_id: 'B',
            rationale: 'Có 3 chấm, nên chọn số 3.',
            tags: ['number_recognition', '0-5'],
          },
        },
        {
          activity_id: 'act-001-02',
          phase: 'main',
          type: 'game',
          duration: 8,
          content: {
            game_type: 'drag_match',
            goal: 'Kéo thả số khớp với số lượng đồ vật (1–5).',
            items: [
              { id: 'i1', target: '3', sprites: ['🍎', '🍎', '🍎'] },
              { id: 'i2', target: '5', sprites: ['⭐', '⭐', '⭐', '⭐', '⭐'] },
              { id: 'i3', target: '1', sprites: ['🐟'] },
            ],
            rules: ['Kéo số vào khung đồ vật đúng', 'Sai 3 lần → gợi ý hình ảnh'],
            scoring: { per_correct: 1, target: 6, bonus_perfect: 2 },
          },
        },
        {
          activity_id: 'act-001-03',
          phase: 'practice',
          type: 'quiz',
          duration: 7,
          content: {
            items: [
              {
                id: 'q1',
                prompt: 'Có bao nhiêu con cá? 🐠🐠',
                input: 'mcq',
                choices: ['1', '2', '4'],
                correct_choice_index: 1,
              },
              {
                id: 'q2',
                prompt: 'Chọn số đúng với hình: 🍓🍓🍓🍓',
                input: 'mcq',
                choices: ['3', '4', '5'],
                correct_choice_index: 1,
              },
              {
                id: 'q3',
                prompt: 'Viết số tương ứng: 🍩🍩🍩',
                input: 'short_text',
                answer_key: '3',
              },
              {
                id: 'q4',
                prompt: 'Có mấy ngôi sao? ⭐',
                input: 'mcq',
                choices: ['0', '1', '2'],
                correct_choice_index: 1,
              },
            ],
            grading: 'auto',
          },
        },
        {
          activity_id: 'act-001-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: {
            prompt: 'Con thấy câu nào khó nhất? Vì sao?',
            input: 'free_text',
          },
        },
      ],
    },
  ],

  [
    'node-002',
    {
      session_id: 'node-002',
      learner_id: 'learner-001',
      node_id: 'node-002',
      skill_name: 'Counting 1–10',
      duration: 22,
      activities: [
        {
          activity_id: 'act-002-01',
          phase: 'warm_up',
          type: 'video',
          duration: 3,
          content: {
            title: 'Đếm từ 1 đến 10 cùng cá heo Iruka',
            url: 'https://example.com/videos/count-1-10',
            start_at: 0,
            captions: true,
          },
        },
        {
          activity_id: 'act-002-02',
          phase: 'main',
          type: 'game',
          duration: 9,
          content: {
            game_type: 'tap',
            instructions: 'Chọn đáp án đúng cho mỗi câu hỏi',
            problems: [
              {
                question: 'Có bao nhiêu con cá? 🐠🐠',
                answer: '2',
                options: ['1', '2', '3'],
              },
              {
                question: 'Có bao nhiêu ngôi sao? ⭐⭐⭐⭐⭐',
                answer: '5',
                options: ['3', '4', '5'],
              },
              {
                question: 'Có bao nhiêu quả táo? 🍎🍎🍎',
                answer: '3',
                options: ['2', '3', '4'],
              },
            ],
          },
        },
        {
          activity_id: 'act-002-03',
          phase: 'practice',
          type: 'quiz',
          duration: 8,
          content: {
            items: [
              { id: 'q1', prompt: 'Đếm: 🐱🐱🐱🐱', input: 'short_text', answer_key: '4' },
              {
                id: 'q2',
                prompt: 'Chọn đáp án đúng: có 9 chiếc lá? 🍃🍃🍃🍃🍃🍃🍃🍃🍃',
                input: 'mcq',
                choices: ['8', '9', '10'],
                correct_choice_index: 1,
              },
              { id: 'q3', prompt: 'Điền số còn thiếu: 6, 7, __, 9, 10', input: 'short_text', answer_key: '8' },
            ],
          },
        },
        {
          activity_id: 'act-002-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: { prompt: 'Hôm nay con đã đếm được đến số mấy nhanh nhất?', input: 'free_text' },
        },
      ],
    },
  ],

  [
    'node-003',
    {
      session_id: 'node-003',
      learner_id: 'learner-001',
      node_id: 'node-004',
      skill_name: 'Compare Numbers ≤10',
      duration: 18,
      activities: [
        {
          activity_id: 'act-003-01',
          phase: 'warm_up',
          type: 'question',
          duration: 3,
          content: {
            prompt: 'So sánh: 4 __ 6',
            choices: [
              { id: 'A', label: '<' },
              { id: 'B', label: '=' },
              { id: 'C', label: '>' },
            ],
            correct_choice_id: 'A',
            rationale: '4 nhỏ hơn 6.',
          },
        },
        {
          activity_id: 'act-003-02',
          phase: 'main',
          type: 'game',
          duration: 7,
          content: {
            game_type: 'match-pairs',
            rows: 2,
            cols: 4,
            pairs: ['<', '=', '>', '<', '=', '>', '5>2', '7=7'],
            colors: {},
            shuffleSeed: '',
          },
        },
        {
          activity_id: 'act-003-03',
          phase: 'practice',
          type: 'quiz',
          duration: 6,
          content: {
            items: [
              { id: 'q1', prompt: '8 __ 5', input: 'mcq', choices: ['<', '=', '>'], correct_choice_index: 2 },
              { id: 'q2', prompt: '3 __ 3', input: 'mcq', choices: ['<', '=', '>'], correct_choice_index: 1 },
              { id: 'q3', prompt: '2 __ 9', input: 'mcq', choices: ['<', '=', '>'], correct_choice_index: 0 },
            ],
          },
        },
        {
          activity_id: 'act-003-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: { prompt: 'Dấu nào con hay nhầm nhất: <, = hay > ?', input: 'free_text' },
        },
      ],
    },
  ],

  [
    'node-004',
    {
      session_id: 'node-004',
      learner_id: 'learner-001',
      node_id: 'node-007',
      skill_name: 'Addition within 5',
      duration: 20,
      activities: [
        {
          activity_id: 'act-004-01',
          phase: 'warm_up',
          type: 'question',
          duration: 3,
          content: {
            prompt: '2 + 1 = ?',
            choices: [
              { id: 'A', label: '2' },
              { id: 'B', label: '3' },
              { id: 'C', label: '4' },
            ],
            correct_choice_id: 'B',
          },
        },
        {
          activity_id: 'act-004-02',
          phase: 'main',
          type: 'game',
          duration: 9,
          content: {
            game_type: 'drag-number',
            range: [1, 5],
            count: 5,
            mode: 'asc',
          },
        },
        {
          activity_id: 'act-004-03',
          phase: 'practice',
          type: 'quiz',
          duration: 6,
          content: {
            items: [
              { id: 'q1', prompt: '1 + 1 = ?', input: 'short_text', answer_key: '2' },
              { id: 'q2', prompt: '0 + 4 = ?', input: 'short_text', answer_key: '4' },
              { id: 'q3', prompt: '2 + 3 = ?', input: 'mcq', choices: ['4', '5', '6'], correct_choice_index: 1 },
            ],
          },
        },
        {
          activity_id: 'act-004-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: { prompt: 'Hôm nay con đã biết cách cộng nào mới?', input: 'free_text' },
        },
      ],
    },
  ],

  [
    'node-005',
    {
      session_id: 'node-005',
      learner_id: 'learner-001',
      node_id: 'node-009',
      skill_name: 'Addition within 10',
      duration: 22,
      activities: [
        {
          activity_id: 'act-005-01',
          phase: 'warm_up',
          type: 'video',
          duration: 3,
          content: {
            title: 'Mẹo cộng tròn 10',
            url: 'https://example.com/videos/add-to-10',
            captions: true,
          },
        },
        {
          activity_id: 'act-005-02',
          phase: 'main',
          type: 'game',
          duration: 10,
          content: {
            game_type: 'maze',
            rows: 10,
            cols: 10,
            obstacles: 0.15,
          },
        },
        {
          activity_id: 'act-005-03',
          phase: 'practice',
          type: 'quiz',
          duration: 7,
          content: {
            items: [
              { id: 'q1', prompt: '9 + 4 = ?', input: 'short_text', answer_key: '13' },
              { id: 'q2', prompt: '6 + 6 = ?', input: 'mcq', choices: ['10', '11', '12'], correct_choice_index: 2 },
              { id: 'q3', prompt: '3 + 8 = ?', input: 'short_text', answer_key: '11' },
            ],
          },
        },
        {
          activity_id: 'act-005-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: { prompt: 'Khi nào con nên “làm tròn 10”?', input: 'free_text' },
        },
      ],
    },
  ],

  [
    'node-006',
    {
      session_id: 'node-006',
      learner_id: 'learner-001',
      node_id: 'node-013',
      skill_name: '2D Shapes',
      duration: 18,
      activities: [
        {
          activity_id: 'act-006-01',
          phase: 'warm_up',
          type: 'question',
          duration: 3,
          content: {
            prompt: 'Hình nào là hình tròn?',
            choices: [
              { id: 'A', label: '🔺' },
              { id: 'B', label: '⚫' },
              { id: 'C', label: '⬛' },
            ],
            correct_choice_id: 'B',
          },
        },
        {
          activity_id: 'act-006-02',
          phase: 'main',
          type: 'game',
          duration: 7,
          content: {
            game_type: 'match-pairs',
            rows: 2,
            cols: 4,
            pairs: ['circle', 'circle', 'triangle', 'triangle', 'square', 'square', '🍪', '🥞'],
            colors: {},
            shuffleSeed: '',
          },
        },
        {
          activity_id: 'act-006-03',
          phase: 'practice',
          type: 'quiz',
          duration: 6,
          content: {
            items: [
              {
                id: 'q1',
                prompt: 'Hình nào có 3 cạnh?',
                input: 'mcq',
                choices: ['Tròn', 'Vuông', 'Tam giác'],
                correct_choice_index: 2,
              },
              {
                id: 'q2',
                prompt: 'Hình nào không có cạnh?',
                input: 'mcq',
                choices: ['Tròn', 'Vuông', 'Tam giác'],
                correct_choice_index: 0,
              },
            ],
          },
        },
        {
          activity_id: 'act-006-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: { prompt: 'Con thấy đồ vật nào ở nhà giống hình vuông?', input: 'free_text' },
        },
      ],
    },
  ],

  [
    'node-007',
    {
      session_id: 'node-007',
      learner_id: 'learner-001',
      node_id: 'node-016',
      skill_name: 'Compare Length',
      duration: 17,
      activities: [
        {
          activity_id: 'act-007-01',
          phase: 'warm_up',
          type: 'question',
          duration: 3,
          content: {
            prompt: 'Bút nào dài hơn? ✏️—🖍️',
            choices: [
              { id: 'A', label: 'Bút chì ✏️' },
              { id: 'B', label: 'Bút sáp 🖍️' },
            ],
            correct_choice_id: 'A',
          },
        },
        {
          activity_id: 'act-007-02',
          phase: 'main',
          type: 'game',
          duration: 7,
          content: {
            game_type: 'road-cycle',
            speed: 1,
            traffic: 'medium',
            laps: 3,
          },
        },
        {
          activity_id: 'act-007-03',
          phase: 'practice',
          type: 'quiz',
          duration: 5,
          content: {
            items: [
              {
                id: 'q1',
                prompt: 'Vật A (4 ô) so với vật B (6 ô) là?',
                input: 'mcq',
                choices: ['Dài hơn', 'Ngắn hơn', 'Bằng nhau'],
                correct_choice_index: 1,
              },
              {
                id: 'q2',
                prompt: 'Vật C (5 ô) so với vật D (5 ô) là?',
                input: 'mcq',
                choices: ['Dài hơn', 'Ngắn hơn', 'Bằng nhau'],
                correct_choice_index: 2,
              },
            ],
          },
        },
        {
          activity_id: 'act-007-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: { prompt: 'Ở nhà con đo thử đồ vật gì? Kết quả ra sao?', input: 'free_text' },
        },
      ],
    },
  ],

  [
    'node-008',
    {
      session_id: 'node-008',
      learner_id: 'learner-001',
      node_id: 'node-020',
      skill_name: 'Money: Recognize Coins',
      duration: 19,
      activities: [
        {
          activity_id: 'act-008-01',
          phase: 'warm_up',
          type: 'video',
          duration: 3,
          content: {
            title: 'Làm quen đồng xu 1–2–5',
            url: 'https://example.com/videos/coins-intro',
          },
        },
        {
          activity_id: 'act-008-02',
          phase: 'main',
          type: 'game',
          duration: 8,
          content: {
            game_type: 'drag-number',
            range: [1, 5],
            count: 6,
            mode: 'asc',
          },
        },
        {
          activity_id: 'act-008-03',
          phase: 'practice',
          type: 'quiz',
          duration: 6,
          content: {
            items: [
              {
                id: 'q1',
                prompt: 'Chọn tổng đúng: 1 + 2 = ?',
                input: 'mcq',
                choices: ['2', '3', '5'],
                correct_choice_index: 1,
              },
              { id: 'q2', prompt: 'Chọn đồng xu = 5', input: 'mcq', choices: ['1', '2', '5'], correct_choice_index: 2 },
            ],
          },
        },
        {
          activity_id: 'act-008-04',
          phase: 'reflection',
          type: 'question',
          duration: 2,
          content: {
            prompt: 'Nếu con có 2 đồng 2 và 1 đồng 1, con có tất cả bao nhiêu?',
            input: 'free_text',
            expected_hint: '2+2+1',
          },
        },
      ],
    },
  ],
]);

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSessionsData = {
  async generateSession(data: GenerateSessionReq): Promise<GenerateSessionRes> {
    await delay(1000);

    // Construct a valid Session object matching the type
    const session: Session = {
      session_id: `session-${Date.now()}`,
      learner_id: data.learner_id,
      node_id: data.node_id,
      skill_name: 'Number Recognition',
      duration: 10,
      activities: [
        {
          activity_id: 'activity-001',
          phase: 'main',
          type: 'question',
          content: {
            question: 'What number is this?',
            options: ['3', '4', '5', '6'],
            correct_answer: '3',
            image_url: '/images/number-3.png',
          },
          duration: 5,
        },
        {
          activity_id: 'activity-002',
          phase: 'practice',
          type: 'game',
          content: {
            game_type: 'match-pairs',
            rows: 2,
            cols: 3,
            pairs: ['1', 'one', '2', 'two', '3', 'three'],
            colors: {},
            shuffleSeed: '',
          },
          duration: 5,
        },
      ],
    };

    mockSessions.set(session.session_id, session);

    return {
      status: 'success',
      session_id: session.session_id,
      session,
    };
  },

  async getSession(sessionId: string): Promise<GetSessionRes> {
    await delay(300);

    const session = mockSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    return {
      status: 'success',
      session_id: session.session_id,
      session,
    };
  },

  async startSession(sessionId: string): Promise<StartSessionRes> {
    await delay(500);

    const session = mockSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Normally would mark in-progress; just mock return values per type
    return {
      status: 'success',
      session_id: session.session_id,
      started_at: new Date().toISOString(),
    };
  },

  async submitActivityResult(
    sessionId: string,
    activityId: string,
    data: SubmitActivityResultReq,
  ): Promise<SubmitActivityResultRes> {
    await delay(600);

    const session = mockSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const activity = session.activities.find(a => a.activity_id === activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    // No persistent result store per type; just mock the res
    return {
      status: 'success',
      activity_id: activityId,
      is_correct: typeof data.score === 'number' ? data.score > 0.8 : undefined,
      feedback: data.completed ? 'Well done!' : 'Try again!',
    };
  },

  async completeSession(sessionId: string, _data: CompleteSessionReq): Promise<CompleteSessionRes> {
    await delay(800);

    const session = mockSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Mock session summary and progress to match CompleteSessionRes type
    return {
      status: 'success',
      session_summary: {
        total_activities: session.activities.length,
        completed: session.activities.length,
        average_score: 0.85,
        time_spent: 450,
      },
      progress: {
        node_completed: true,
        next_node_unlocked: true,
        profile_updated: true,
      },
      feedback: {
        strengths_shown: ['Quick thinking', 'Accuracy'],
        areas_to_practice: ['Focus for long durations'],
        next_recommendation: 'Try more advanced number games!',
      },
    };
  },
};
