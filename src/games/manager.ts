// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameSpec } from './types';
import type { SessionItem } from '@/stores/session-store';
import * as GameRegistry from './registry';

export type ResolvedGame = {
  spec: GameSpec;
  config: Record<string, unknown>;
  seed?: string | number;
};

export function resolveFromItem(item: SessionItem): ResolvedGame {
  const payload = (item.payload ?? {}) as Record<string, unknown>;

  // Strategy 1: explicit gameId
  const gameId = payload.gameId as string | undefined;
  if (gameId && GameRegistry.has(gameId)) {
    const spec = GameRegistry.get(gameId)!;
    return applyAdapter(spec, item);
  }

  // Strategy 2: match by kind/type
  const kind = (payload.kind ?? payload.gameType) as string | undefined;
  if (kind) {
    const matchedSpec = findByKind(kind);
    if (matchedSpec) {
      return applyAdapter(matchedSpec, item);
    }
  }

  // Strategy 3: fallback to first available game
  const allGames = GameRegistry.list();
  if (allGames.length > 0) {
    const fallback = allGames[0];
    if (fallback) {
      console.warn(`[GameManager] No game found for item "${item.id}", using fallback: ${fallback.id}`);
      return applyAdapter(fallback, item);
    }
  }

  throw new Error(`[GameManager] No games registered. Cannot resolve item "${item.id}"`);
}

function applyAdapter(spec: GameSpec, item: SessionItem): ResolvedGame {
  if (spec.adapters.fromSessionItem) {
    const { config, seed } = spec.adapters.fromSessionItem(item);
    return { spec, config, seed };
  }

  // Fallback: use payload as config
  const payload = (item.payload ?? {}) as Record<string, unknown>;
  return {
    spec,
    config: { ...spec.defaultConfig, ...payload },
    seed: payload.seed as string | number | undefined,
  };
}

function findByKind(kind: string): GameSpec | undefined {
  const allGames = GameRegistry.list();
  const normalized = kind.toLowerCase().trim();

  // Exact match on id
  const exactMatch = allGames.find(g => g.id === normalized);
  if (exactMatch) {
    return exactMatch;
  }

  // Match by tags
  const tagMatch = allGames.find(g => g.tags.some(tag => tag.toLowerCase() === normalized));
  if (tagMatch) {
    return tagMatch;
  }

  // Partial match on title
  const titleMatch = allGames.find(g => g.title.toLowerCase().includes(normalized));
  return titleMatch;
}

// Re-export registry functions
export { get, has, list, register } from './registry';
