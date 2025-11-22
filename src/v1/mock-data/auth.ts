// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { LoginReq, LoginRes, MeRes, RegisterReq, RegisterRes } from '@/features/auth/types';

// Mock user data
const mockUsers = [
  {
    user_id: 'f4d1ff2e-2845-4d27-8ff5-1aa30988dd0a',
    email: 'test1@gmail.com',
    full_name: 'Son Nguyen',
    password: 'password123',
    learner: {
      learner_id: '3a787847-e996-4718-aa36-12a15ebef784',
      name: 'SSon',
      age: 3,
      profile_status: 'complete' as const,
    },
  },
  {
    user_id: 'user-002',
    email: 'test@example.com',
    full_name: 'Test Parent',
    password: 'test123',
    learner: {
      learner_id: 'learner-002',
      name: 'Alex',
      age: 6,
      profile_status: 'incomplete' as const,
    },
  },
  {
    user_id: 'mock-user-id-001',
    email: 'dev@iruka.edu',
    full_name: 'Dev User',
    password: 'dev123',
    learner: {
      learner_id: 'mock-learner-id-001',
      name: 'Dev Learner',
      age: 7,
      profile_status: 'incomplete' as const,
    },
  },
];

// Mock tokens - using the token from mock-auth.ts
const mockTokens = {
  'f4d1ff2e-2845-4d27-8ff5-1aa30988dd0a': 'pnt_024acaeb-5c0c-44e8-88e7-54e9fbe2acfb',
  'user-002': 'mock-token-user-002',
  'mock-user-id-001': 'pnt_024acaeb-5c0c-44e8-88e7-54e9fbe2acfb', // For mock auth
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthData = {
  // Update profile status
  updateProfileStatus(learnerId: string, status: 'incomplete' | 'complete') {
    const user = mockUsers.find(u => u.learner.learner_id === learnerId);
    if (user) {
      user.learner.profile_status = status;
    }
  },

  // Register mock
  async register(data: RegisterReq): Promise<RegisterRes> {
    await delay(800);

    const newUser = {
      user_id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      password: data.password || 'mock-password',
      learner: {
        learner_id: `learner-${Date.now()}`,
        name: data.child_name,
        age: data.child_age,
        profile_status: 'incomplete' as const,
      },
    };

    mockUsers.push(newUser);
    const token = `mock-token-${newUser.user_id}`;
    mockTokens[newUser.user_id as keyof typeof mockTokens] = token;

    return {
      status: 'success',
      access_token: token,
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        full_name: newUser.full_name,
      },
      learner: {
        learner_id: newUser.learner.learner_id,
        name: newUser.learner.name,
        age: newUser.learner.age,
      },
    };
  },

  // Login mock
  async login(data: LoginReq): Promise<LoginRes> {
    await delay(600);

    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      status: 'success',
      access_token: mockTokens[user.user_id as keyof typeof mockTokens],
      user: {
        user_id: user.user_id,
        learner_id: user.learner.learner_id,
      },
    };
  },

  // Get current user mock
  async getMe(token: string): Promise<MeRes> {
    await delay(400);

    // Find user by token - check both direct mapping and reverse lookup
    let userId: string | undefined;
    for (const [id, t] of Object.entries(mockTokens)) {
      if (t === token) {
        userId = id;
        break;
      }
    }

    // If token is the mock auth token, use mock user
    if (!userId && token === 'pnt_024acaeb-5c0c-44e8-88e7-54e9fbe2acfb') {
      userId = 'mock-user-id-001';
    }

    if (!userId) {
      throw new Error('Invalid token');
    }

    const user = mockUsers.find(u => u.user_id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      status: 'success',
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
      },
      learner: {
        learner_id: user.learner.learner_id,
        name: user.learner.name,
        age: user.learner.age,
        profile_status: user.learner.profile_status,
      },
    };
  },
};
