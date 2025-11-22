import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

// Lightweight matchers to avoid bundling Clerk utilities at top-level
// const DASHBOARD_REGEX = /^(?:\/[a-zA-Z-]{2,5})?\/dashboard(?:\/.*)?$/;
// const AUTH_REGEX = /^(?:\/[a-zA-Z-]{2,5})?\/(?:sign-in|sign-up)(?:\/.*)?$/;

// function isProtectedRoute(req: NextRequest): boolean {
//   const path = req.nextUrl.pathname;
//   return DASHBOARD_REGEX.test(path);
// }

// function isAuthPage(req: NextRequest): boolean {
//   const path = req.nextUrl.pathname;
//   return AUTH_REGEX.test(path);
// }

// NOTE: Omit Arcjet in middleware to keep Edge bundle size small (<1MB). Consider server-side verification instead.

export default async function middleware(request: NextRequest) {
  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  // if (isAuthPage(request) || isProtectedRoute(request)) {
  //   const { clerkMiddleware } = await import('@clerk/nextjs/server');
  //   return clerkMiddleware(async (auth, req) => {
  //     if (isProtectedRoute(req)) {
  //       const locale = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';
  //       const signInUrl = new URL(`${locale}/sign-in`, req.url);
  //       await auth.protect({ unauthenticatedUrl: signInUrl.toString() });
  //     }
  //     return handleI18nRouting(req);
  //   })(request, event);
  // }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
