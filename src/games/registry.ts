// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import type { GameRegistry, GameSpec } from './types';

const registry: GameRegistry = new Map();

export function register(spec: GameSpec): void {
  if (registry.has(spec.id)) {
    console.warn(`[GameRegistry] Game "${spec.id}" already registered, overwriting...`);
  }
  registry.set(spec.id, spec);
}

export function get(id: string): GameSpec | undefined {
  return registry.get(id);
}

export function list(): GameSpec[] {
  return Array.from(registry.values());
}

export function clear(): void {
  registry.clear();
}

export function has(id: string): boolean {
  return registry.has(id);
}

export { registry };
