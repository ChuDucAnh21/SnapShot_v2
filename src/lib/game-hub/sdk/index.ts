/**
 * Iruka Game SDK v1.0.0
 * Export tất cả SDK utilities cho game developers
 */

export * from '../protocol';
export { createHost } from './esm-game';

export { createIframeBridge } from './iframe-game';

export type { CommandHandler, IframeBridge, IframeBridgeOptions } from './iframe-game';
