// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { GenerateProfileReq, GenerateProfileRes, GetProfileRes, Profile } from '@/features/profiles/types';
import { mockAuthData } from './auth';

const exampleProfile: Profile = {
  learner_id: '3a787847-e996-4718-aa36-12a15ebef784',
  abilities: { math: 3, language: 2, creativity: 1, logic: 2 },
  interests: ['math', 'sports'],
  strengths: ['quick_learner'],
  weaknesses: [],
  learning_style: 'visual',
};

// Mock profile data
const mockProfiles = new Map<string, Profile>([['3a787847-e996-4718-aa36-12a15ebef784', exampleProfile]]);

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockProfilesData = {
  async generateProfile(data: GenerateProfileReq): Promise<GenerateProfileRes> {
    await delay(1200);

    const profile: Profile = {
      learner_id: data.learner_id,
      abilities: { math: 1, language: 1, creativity: 1, logic: 1 },
      interests: ['math', 'art'],
      strengths: ['pattern_recognition', 'creativity'],
      weaknesses: ['focus', 'patience'],
      learning_style: 'visual',
    };

    mockProfiles.set(data.learner_id, profile);

    // Update profile status to complete in auth data
    if (typeof mockAuthData.updateProfileStatus === 'function') {
      mockAuthData.updateProfileStatus(data.learner_id, 'complete');
    }

    return {
      status: 'success',
      profile,
    };
  },

  async getProfile(learnerId: string): Promise<GetProfileRes> {
    await delay(400);

    const profile = mockProfiles.get(learnerId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      status: 'success',
      profile,
    };
  },
};
