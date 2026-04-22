import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/:locale/checkout/subscription(.*)',
  '/api/user(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
