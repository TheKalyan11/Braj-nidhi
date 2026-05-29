import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware — runs before every request.
 *
 * Responsibilities:
 *  1. Security headers on all responses
 *  2. CORS — API routes only accept requests from our own domain
 *  3. Block obviously bad bots / scanners on API routes
 */

// ─── Allowed origins ──────────────────────────────────────────────────────────
// Add your production domain here once deployed.
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  // 'https://www.brajnidhiguesthouse.com',   ← uncomment when live
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // server-to-server / Postman — allow
  return ALLOWED_ORIGINS.some(o => origin.startsWith(o));
}

// ─── Security headers applied to every response ───────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options':            'nosniff',
  'X-Frame-Options':                   'DENY',
  'X-XSS-Protection':                  '1; mode=block',
  'Referrer-Policy':                   'strict-origin-when-cross-origin',
  'Permissions-Policy':                'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security':         'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://api.openai.com https://graph.facebook.com https://api.callmebot.com https://pankaj.vcmerp.in; " +
    "frame-src https://api.razorpay.com https://checkout.razorpay.com; " +
    "object-src 'none'; " +
    "base-uri 'self';",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith('/api/');

  // ── CORS pre-flight ──────────────────────────────────────────────────────────
  const origin = request.headers.get('origin');

  if (isApiRoute && request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin':  origin ?? '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age':       '86400',
      },
    });
  }

  // ── Block disallowed origins on API routes ────────────────────────────────────
  if (isApiRoute && origin && !isAllowedOrigin(origin)) {
    return NextResponse.json(
      { error: 'Forbidden: cross-origin request not allowed' },
      { status: 403 },
    );
  }

  // ── Block known scanner / bad-bot User-Agents ─────────────────────────────────
  if (isApiRoute) {
    const ua = (request.headers.get('user-agent') ?? '').toLowerCase();
    const badBots = ['sqlmap', 'nikto', 'masscan', 'zgrab', 'nmap', 'dirbuster', 'hydra'];
    if (badBots.some(bot => ua.includes(bot))) {
      return new NextResponse(null, { status: 403 });
    }
  }

  // ── Apply security headers to all responses ───────────────────────────────────
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // Also echo CORS header for allowed API requests
  if (isApiRoute && isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin ?? '*');
    response.headers.set('Vary', 'Origin');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico, public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|mp4|woff2?|ttf)$).*)',
  ],
};
