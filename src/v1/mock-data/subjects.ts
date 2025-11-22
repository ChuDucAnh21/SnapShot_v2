// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { GetSubjectsRes, Subject } from '@/features/subjects/types';

// Mock subjects data
const mockSubjects: Subject[] = [
  {
    subject_id: 'math',
    name: 'Mathematics',
    code: '🔢',
  },
  {
    subject_id: 'reading',
    name: 'Reading & Writing',
    code: '📚',
  },
  {
    subject_id: 'science',
    name: 'Science',
    code: '🔬',
  },
  {
    subject_id: 'art',
    name: 'Art & Creativity',
    code: '🎨',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSubjectsData = {
  async getSubjects(): Promise<GetSubjectsRes> {
    await delay(500);

    return {
      status: 'success',
      subjects: mockSubjects,
    };
  },
};
