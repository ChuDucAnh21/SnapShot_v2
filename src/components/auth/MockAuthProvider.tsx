// Rules applied: style/brace-style:1tbs
'use client';

import { useEffect } from 'react';
import { initMockAuth, shouldUseMockAuth } from '@/lib/auth/mock-auth';

/**
 * MockAuthProvider - Automatically initializes mock authentication in development mode
 *
 * This component should be placed in the root layout to enable mock auth
 * when running in development mode or when NEXT_PUBLIC_USE_MOCK_AUTH=true
 */
export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (shouldUseMockAuth()) {
      initMockAuth();
    }
  }, []);

  return <>{children}</>;
}
