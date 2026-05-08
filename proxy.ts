import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  // '/api/stripe/webhook', // Ensure this matches your folder exactly
  // '/', // Home page is public — no auth required
  '/api/generate-pdf',
  '/api/uploadthing',
  '/:locale/dashboard(.*)',
  '/:locale/templates(.*)',
  // '/:locale/results(.*)', // Open for Freemium
]);
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;
  
  console.log(`[MIDDLEWARE] Request: ${pathname}`);

  // 1. PDF BYPASS
  const pdfSecret = req.headers.get('x-pdf-gen-secret');
  const expectedSecret = process.env.PDF_GEN_SECRET || 'internal-bypass';
  
  if (pdfSecret === expectedSecret) {
    console.log(`[MIDDLEWARE] Ã¢Å“â€¦ BYPASS hit for: ${pathname}`);
    return NextResponse.next();
  }


  // 1. COMPLETELY IGNORE CLERK INTERNAL CALLS & STRIPE
  if (
    pathname.includes('/api/stripe/webhook') ||
    pathname.includes('/__clerk') ||
    pathname.includes('.js') // Prevents catching the script loads
  ) {
    return NextResponse.next();
  }



  // Also bypass print pages entirely (they're internal only)
  if (pathname.includes('/print/')) {
    return NextResponse.next(); // Skip auth + intl for print routes
  }

  // 3. PROTECT
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 4. INTL (Apply to everything else)
  if (!pathname.startsWith('/api')) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
