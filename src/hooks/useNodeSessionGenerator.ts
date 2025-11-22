// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useMe } from '@/features/auth/hooks';
import { useGenerateSession } from '@/features/sessions/hooks';
import { useAuthStore } from '@/lib/auth/auth-store';

type UseNodeSessionGeneratorResult = {
  readonly generateAndNavigate: (nodeId: string) => Promise<void>;
  readonly isGenerating: boolean;
  readonly error: Error | null;
};

export function useNodeSessionGenerator(): UseNodeSessionGeneratorResult {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: meData } = useMe(true);
  const generateSession = useGenerateSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const learnerId = user?.learner_id || meData?.learner?.learner_id;

  const generateAndNavigate = useCallback(
    async (nodeId: string) => {
      if (!nodeId || !learnerId) {
        console.error('Missing nodeId or learnerId:', { nodeId, learnerId });
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const result = await generateSession.mutateAsync({
          learner_id: learnerId,
          node_id: nodeId,
        });

        const sessionId = result.session_id || result.session?.session_id;

        if (sessionId) {
          router.push(`/learn/session/${sessionId}`);
        } else {
          throw new Error('Session ID not returned from server');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate session');
        setError(error);
        console.error('Failed to generate session:', error);
      } finally {
        setIsGenerating(false);
      }
    },
    [learnerId, generateSession, router],
  );

  return {
    generateAndNavigate,
    isGenerating,
    error,
  };
}
