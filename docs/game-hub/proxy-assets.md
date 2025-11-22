# Game Hub – Asset Proxy for CORS-free Loading

When iframe games try to load assets from another origin (e.g. `http://localhost:3002/assets/...`), browsers enforce CORS and may block requests. This project provides two Next.js-side solutions to avoid CORS during development and simple deployments.

## 1) Rewrite Proxy

- Path: `/proxy/assets/:path*`
- Forwarded to: `http://localhost:3002/assets/:path*`
- Headers set: `Access-Control-Allow-Origin: *`, etc.

Usage in games:
- Prefer relative paths if possible, or update absolute URLs to `/proxy/assets/...`.

Configured in `next.config.ts`:
- `rewrites()` adds the forward rule
- `headers()` appends CORS headers for the rewritten path

## 2) API Proxy (Fallback)

- Endpoint: `/api/proxy/assets?url=<absolute-asset-url>`
- Use when you cannot change asset URLs in the game easily.
- Adds permissive CORS headers and returns the upstream asset.

Security: the route allows `localhost:3002` by default; extend the allowlist if needed.

## Notes
- These approach serve assets under the app origin, so the iframe no longer triggers browser CORS checks.
- For production, point games to same-origin asset paths (CDN behind your domain) or configure your CDN/server to return proper CORS headers.
