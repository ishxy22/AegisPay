import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'aegispay_session';

// Protected page paths requiring user authentication
const PROTECTED_PAGE_PREFIXES = [
  '/dashboard',
  '/projects',
  '/transactions',
  '/invoices',
  '/mediation',
  '/defense',
  '/analytics',
  '/settings',
  '/evidence',
];

// Protected API routes to prevent AI token exhaustion & unauthorized PayPal calls
const PROTECTED_API_PREFIXES = [
  '/api/ai',
  '/api/paypal/orders',
  '/api/paypal/refunds',
  '/api/paypal/disputes',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve session token from cookie
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (sessionToken) {
    try {
      // Decode base64 / base64url payload with padding handling
      let base64 = sessionToken.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonStr = atob(base64);
      const parsed = JSON.parse(jsonStr);
      if (parsed.userId && parsed.expiresAt && parsed.expiresAt > Date.now()) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Guard Sensitive API Endpoints
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtectedApi && !isAuthenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized access',
        message: 'Active AegisPay session required to invoke AI and Payment APIs.',
      },
      { status: 401 }
    );
  }

  // 2. Guard Protected Application Pages
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtectedPage && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If authenticated user visits /login or /register, redirect to /dashboard
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public asset files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
