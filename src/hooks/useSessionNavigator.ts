// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

const SESSION_PATH = '/learn/session';

export type UseSessionNavigatorResult = {
  readonly navigateToSession: (sessionId: string) => void;
};

export function useSessionNavigator(): UseSessionNavigatorResult {
  const router = useRouter();

  const navigateToSession = React.useCallback(
    (sessionId: string) => {
      if (!sessionId) {
        return;
      }
      router.push(`${SESSION_PATH}/${sessionId}`);
    },
    [router],
  );

  return { navigateToSession };
}
