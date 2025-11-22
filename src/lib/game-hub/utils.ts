/**
 * Utility functions cho Game Hub
 */

import type { GameManifest } from './protocol';

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Format time in ms to readable string
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Type guard cho GameManifest
 */
export function isValidManifest(obj: any): obj is GameManifest {
  return (
    obj
    && typeof obj === 'object'
    && typeof obj.id === 'string'
    && typeof obj.title === 'string'
    && typeof obj.version === 'string'
    && typeof obj.runtime === 'string'
    && (obj.runtime === 'iframe-html' || obj.runtime === 'esm-module')
    && typeof obj.entryUrl === 'string'
  );
}

/**
 * Validate semver
 */
export function isValidSemver(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

/**
 * Compare semver (trả về -1, 0, 1)
 */
export function compareSemver(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const aPart = aParts[i] ?? 0;
    const bPart = bParts[i] ?? 0;
    if (aPart > bPart) {
      return 1;
    }
    if (aPart < bPart) {
      return -1;
    }
  }

  return 0;
}

/**
 * Check if game should be rolled out to user (based on rolloutPercentage)
 */
export function shouldRollout(
  rolloutPercentage: number = 100,
  userId?: string,
): boolean {
  if (rolloutPercentage >= 100) {
    return true;
  }
  if (rolloutPercentage <= 0) {
    return false;
  }

  // Simple hash-based rollout
  const hash = userId
    ? Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : Math.random() * 100;

  return (hash % 100) < rolloutPercentage;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Wait for timeout
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout promise
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Timeout',
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs),
  );

  return Promise.race([promise, timeout]);
}
