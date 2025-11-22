/**
 * Memory Match Pro - ESM Adapter
 * Entry point for Game Hub
 */

import type { HostCommand, IrukaGameInstance, IrukaHost, LaunchContext } from '@/lib/game-hub/protocol';
import React from 'react';
import { createRoot } from 'react-dom/client';
import MemoryMatchProGame from './MemoryMatchProGame';

export async function init(
  container: HTMLElement,
  context: LaunchContext,
  host: IrukaHost,
): Promise<IrukaGameInstance> {
  // Create React root and render game
  const root = createRoot(container);

  root.render(
    React.createElement(MemoryMatchProGame, {
      host,
      context,
    }),
  );

  // Return game instance interface
  return {
    onHostCommand: (cmd: HostCommand) => {
      console.log('[Memory Match Pro] Received command:', cmd);

      switch (cmd.type) {
        case 'PAUSE':
          // Implement pause logic if needed
          break;
        case 'RESUME':
          // Implement resume logic if needed
          break;
        case 'QUIT':
          // Cleanup
          root.unmount();
          break;
      }
    },
    destroy: () => {
      root.unmount();
    },
  };
}
