/**
 * Adapter Module Route
 * Serves the Memory Match Pro adapter as a JavaScript module
 *
 * IMPORTANT: This route serves JavaScript that the browser can import.
 * The adapter must be accessible via a URL that Next.js/Turbopack can resolve.
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the base URL for constructing import paths
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Serve a JavaScript module that uses dynamic import
  // The import path must be a URL that the browser can fetch
  // We'll use a special Next.js route that serves the bundled adapter
  const moduleCode = `// Memory Match Pro Adapter Module
// This module dynamically imports the adapter

export const init = async (container, context, host) => {
  // Import adapter from a Next.js route that serves the bundled code
  // This path will be resolved by Next.js/Turbopack
  const adapterModule = await import('${baseUrl}/api/games/memory-match-pro/adapter-bundle.js');
  return adapterModule.init(container, context, host);
};
`;

  return new NextResponse(moduleCode, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
