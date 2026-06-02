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
// Explicit extra origins (add your custom domain here when ready)
const EXTRA_ALLOWED_ORIGINS: string[] = [
  // 'https://www.brajnidhiguesthouse.com',
];

/**
 * Allow an origin when:
 *  1. No origin header (server-to-server call, curl, Postman)
 *  2. Origin is localhost (local dev)
 *  3. Origin is any *.vercel.app subdomain (all Vercel preview/production deployments)
 *  4. Origin matches the request's own host (same-site fetch — the most common case)
 *  5. Origin is in the explicit EXTRA_ALLOWED_ORIGINS list
 */
function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return true;

  // localhost dev
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;

  // any Vercel deployment (*.vercel.app)
  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith('.vercel.app')) return true;

    // same host as the incoming request (production custom domain)
    if (host && hostname === host) return true;
  } catch {
    return false;
  }

  // explicit whitelist
  return EXTRA_ALLOWED_ORIGINS.some(o => origin.startsWith(o));
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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://chatling.ai https://*.chatling.ai; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://chatling.ai https://*.chatling.ai; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://*.chatling.ai; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://api.openai.com https://graph.facebook.com https://api.callmebot.com https://pankaj.vcmerp.in https://chatling.ai https://*.chatling.ai; " +
    "frame-src https://api.razorpay.com https://checkout.razorpay.com https://www.google.com https://maps.google.com https://maps.googleapis.com https://chatling.ai https://*.chatling.ai; " +
    "worker-src 'self' blob: https://chatling.ai https://*.chatling.ai; " +
    "object-src 'none'; " +
    "base-uri 'self';",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith('/api/');

  // ── CORS pre-flight ──────────────────────────────────────────────────────────
  const origin = request.headers.get('origin');
  const host   = request.headers.get('host');

  if (isApiRoute && request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin, host)) {
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
  if (isApiRoute && origin && !isAllowedOrigin(origin, host)) {
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
  if (isApiRoute && isAllowedOrigin(origin, host)) {
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
