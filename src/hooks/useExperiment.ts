import posthog from 'posthog-js';
import { useMemo } from 'react';

export function useExperiment(flag: string, fallback: boolean = false) {
  const enabled = useMemo(() => {
    try {
      const v = posthog.isFeatureEnabled?.(flag);
      return typeof v === 'boolean' ? v : fallback;
    } catch {
      return fallback;
    }
  }, [flag, fallback]);
  return enabled;
}
