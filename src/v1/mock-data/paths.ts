// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { GeneratePathReq, GeneratePathRes, GetPathRes, Path } from '@/features/paths/types';

const examplePath: Path = {
  learner_id: 'learner-001',
  subject: 'math',
  total_nodes: 24,
  nodes: [
    {
      node_id: 'node-001',
      skill_name: 'Counting 1–5',
      order: 1,
      status: 'completed',
      dependencies: [],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-002',
      skill_name: 'Counting 6–10',
      order: 2,
      status: 'completed',
      dependencies: ['node-001'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-003',
      skill_name: 'Number Recognition 0–10',
      order: 3,
      status: 'completed',
      dependencies: ['node-001'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-004',
      skill_name: 'Compare Numbers ≤10',
      order: 4,
      status: 'available',
      dependencies: ['node-002', 'node-003'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-005',
      skill_name: 'Counting 11–20',
      order: 5,
      status: 'in_progress',
      dependencies: ['node-002'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-006',
      skill_name: 'Place Value (to 20)',
      order: 6,
      status: 'locked',
      dependencies: ['node-005'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-007',
      skill_name: 'Addition within 5',
      order: 7,
      status: 'in_progress',
      dependencies: ['node-002', 'node-003'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-008',
      skill_name: 'Subtraction within 5',
      order: 8,
      status: 'locked',
      dependencies: ['node-007'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-009',
      skill_name: 'Addition within 10',
      order: 9,
      status: 'locked',
      dependencies: ['node-007'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-010',
      skill_name: 'Subtraction within 10',
      order: 10,
      status: 'locked',
      dependencies: ['node-009'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-011',
      skill_name: 'Number Line 0–20',
      order: 11,
      status: 'locked',
      dependencies: ['node-005'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-012',
      skill_name: 'Even & Odd (to 20)',
      order: 12,
      status: 'locked',
      dependencies: ['node-011'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-013',
      skill_name: '2D Shapes (circle, triangle, square)',
      order: 13,
      status: 'completed',
      dependencies: [],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-014',
      skill_name: '3D Shapes (cube, sphere, cone)',
      order: 14,
      status: 'available',
      dependencies: ['node-013'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-015',
      skill_name: 'Patterns (AB, ABB, AAB)',
      order: 15,
      status: 'available',
      dependencies: ['node-013'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-016',
      skill_name: 'Compare Length (longer/shorter)',
      order: 16,
      status: 'available',
      dependencies: ['node-013'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-017',
      skill_name: 'Measure with Nonstandard Units',
      order: 17,
      status: 'locked',
      dependencies: ['node-016'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-018',
      skill_name: 'Time: Read Clocks (Hour)',
      order: 18,
      status: 'locked',
      dependencies: ['node-011'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-019',
      skill_name: 'Time: Read Clocks (Half Hour)',
      order: 19,
      status: 'locked',
      dependencies: ['node-018'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-020',
      skill_name: 'Money: Recognize Coins',
      order: 20,
      status: 'available',
      dependencies: ['node-003'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-021',
      skill_name: 'Money: Count to 20¢',
      order: 21,
      status: 'locked',
      dependencies: ['node-020', 'node-009'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-022',
      skill_name: 'Word Problems within 10',
      order: 22,
      status: 'locked',
      dependencies: ['node-010'],
      estimated_sessions: 2,
    },
    {
      node_id: 'node-023',
      skill_name: 'Checkpoint: Mixed Skills Review',
      order: 23,
      status: 'locked',
      dependencies: ['node-004', 'node-008', 'node-014', 'node-017', 'node-019', 'node-021'],
      estimated_sessions: 1,
    },
    {
      node_id: 'node-024',
      skill_name: 'Mastery Project: Mini-Market Simulation',
      order: 24,
      status: 'locked',
      dependencies: ['node-023', 'node-022'],
      estimated_sessions: 3,
    },
  ],
};

// Mock paths data
const mockPaths = new Map<string, Path>([['learner-001-math', examplePath]]);

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPathsData = {
  async generatePath(data: GeneratePathReq): Promise<GeneratePathRes> {
    await delay(1500);

    const path: Path = {
      learner_id: data.learner_id,
      subject: data.subject_id,
      total_nodes: 3,
      nodes: [
        {
          node_id: 'node-001',
          skill_name: 'Introduction to Numbers',
          order: 1,
          status: 'available',
          dependencies: [],
          estimated_sessions: 1,
        },
        {
          node_id: 'node-002',
          skill_name: 'Counting Practice',
          order: 2,
          status: 'locked',
          dependencies: ['node-001'],
          estimated_sessions: 1,
        },
        {
          node_id: 'node-003',
          skill_name: 'Basic Addition',
          order: 3,
          status: 'locked',
          dependencies: ['node-002'],
          estimated_sessions: 2,
        },
      ],
    };

    const key = `${data.learner_id}-${data.subject_id}`;
    mockPaths.set(key, path);

    return {
      status: 'success',
      path_id: key,
      path,
    };
  },

  async getPath(learnerId: string, subjectId: string): Promise<GetPathRes> {
    await delay(400);

    const key = `${learnerId}-${subjectId}`;
    const path = mockPaths.get(key);
    if (!path) {
      throw new Error('Path not found');
    }

    return {
      status: 'success',
      path_id: key,
      path,
    };
  },
};
