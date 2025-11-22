/**
 * Progress save/load helpers
 * - Save game progress to BE
 * - Load game progress from BE
 */

import type { GameProgress } from './protocol';

/**
 * Save game progress
 */
export async function saveProgress(
  gameId: string,
  sessionId: string,
  data: any,
): Promise<void> {
  try {
    const response = await fetch(`/api/game-hub/progress/${gameId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save progress: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to save game progress:', error);
    throw error;
  }
}

/**
 * Load game progress
 */
export async function loadProgress(
  gameId: string,
  sessionId: string,
): Promise<any> {
  try {
    const response = await fetch(
      `/api/game-hub/progress/${gameId}/load?sessionId=${encodeURIComponent(sessionId)}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        // No saved progress
        return null;
      }
      throw new Error(`Failed to load progress: ${response.status}`);
    }

    const result: GameProgress = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to load game progress:', error);
    throw error;
  }
}
