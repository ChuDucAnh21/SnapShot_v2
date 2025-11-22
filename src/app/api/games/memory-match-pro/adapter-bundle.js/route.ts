/**
 * Adapter Bundle Route
 * Serves the Memory Match Pro adapter as a bundled JavaScript module
 *
 * This route serves the adapter code directly as JavaScript.
 * Since we can't serialize functions, we serve the adapter logic
 * wrapped in a module that the browser can execute.
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the base URL for constructing import paths
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Serve a JavaScript module that imports React from CDN
  // and the game component, then creates the adapter function
  const moduleCode = `// Memory Match Pro Adapter Bundle
// This module is served by Next.js API route

// Import React and ReactDOM from CDN (esm.sh)
// This ensures React is available as an ES module
const loadReact = async () => {
  try {
    // Import React from CDN
    const reactModule = await import('https://esm.sh/react@19.1.1');
    const reactDomModule = await import('https://esm.sh/react-dom@19.1.1/client');
    
    const React = reactModule.default || reactModule;
    const createRoot = reactDomModule.createRoot;
    
    if (!React || !createRoot) {
      throw new Error('Failed to load React modules');
    }
    
    return { React, createRoot };
  } catch (error) {
    console.error('Failed to load React from CDN:', error);
    throw error;
  }
};

// Import the game component dynamically
const loadGameComponent = async () => {
  const gameModule = await import('${baseUrl}/api/games/memory-match-pro/game-component.js');
  return gameModule.default;
};

// Export the init function
export async function init(container, context, host) {
  // Load React and game component
  const { React, createRoot } = await loadReact();
  const MemoryMatchProGame = await loadGameComponent();
  
  // Create React root and render game
  const root = createRoot(container);
  
  root.render(
    React.createElement(MemoryMatchProGame, {
      host,
      context,
    })
  );
  
  // Return game instance interface
  return {
    onHostCommand: (cmd) => {
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
`;

  return new NextResponse(moduleCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
