/**
 * ESM Game Entry Point API
 * Serves Memory Match Pro as an ES module
 *
 * This route serves a JavaScript module that imports the adapter.
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the base URL for constructing absolute import paths
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Serve ESM module that imports from the adapter route using absolute URL
  const moduleCode = `// Import adapter from the adapter route
export { init } from '${baseUrl}/api/games/memory-match-pro/adapter.js';
`;

  return new NextResponse(moduleCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
