// Rules applied: style/brace-style:1tbs
'use client';

import { tokenStorage } from '@/lib/http/storage';
import { useAuthStore } from './auth-store';

/**
 * Mock authentication data for development
 * This allows bypassing login and using fake credentials
 */
export const mockAuthData = {
  // Mock token - a fake JWT-like string
  token: 'pnt_024acaeb-5c0c-44e8-88e7-54e9fbe2acfb',

  // Mock user data
  user: {
    user_id: 'mock-user-id-001',
    email: 'dev@iruka.edu',
    full_name: 'Dev User',
    learner_id: 'mock-learner-id-001',
  },
};

/**
 * Initialize mock authentication
 * Sets a fake token and user in the auth store
 * Only sets if no existing token is found
 */
export function initMockAuth() {
  if (typeof window === 'undefined') {
    return;
  }

  const store = useAuthStore.getState();
  const existingToken = store.accessToken || tokenStorage.get();

  // Only set mock auth if not already authenticated
  if (!existingToken && !store.user) {
    store.setAccessToken(mockAuthData.token, 'local');
    store.setUser(mockAuthData.user);

    console.warn('🔧 Mock auth initialized:', {
      token: `${mockAuthData.token.substring(0, 20)}...`,
      user: mockAuthData.user,
    });
  } else if (existingToken && !store.user) {
    // If token exists but no user, set mock user
    store.setUser(mockAuthData.user);
    console.warn('🔧 Mock user set for existing token');
  }
}

/**
 * Check if mock auth should be enabled
 * Enabled in development mode by default
 */
export function shouldUseMockAuth(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check environment variable first
  const envMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
  if (envMock) {
    return true;
  }

  // In development, enable by default
  return process.env.NODE_ENV === 'development';
}

/**
 * Clear mock auth (useful for testing)
 */
export function clearMockAuth() {
  useAuthStore.getState().logout();
  console.warn('🔧 Mock auth cleared');
}
