'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/features/auth/hooks';

/**
 * Hook to check profile status and redirect to assessment if incomplete
 * Should be used in protected pages that require complete profile
 */
export function useProfileStatusCheck() {
  const router = useRouter();
  const { data: meData, isLoading: meLoading, isError } = useMe()

  useEffect(() => {
    // Only check if we have data and user is authenticated
    if (!meLoading && !isError && meData?.learner) {
      if (meData.learner.profile_status === 'incomplete') {
        router.push('/assessment');
      }
    }
  }, [meLoading, isError, meData?.learner?.profile_status, router]);

  return {
    isLoading: meLoading,
    isError,
    profileStatus: meData?.learner?.profile_status,
    isProfileComplete: meData?.learner?.profile_status === 'complete',
  }
}
