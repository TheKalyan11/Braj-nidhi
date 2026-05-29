/**
 * In-memory rate limiter
 * Works perfectly on a single VPS / dedicated server.
 * For Vercel (serverless), upgrade to @upstash/ratelimit + Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Global store — persists across requests in the same process
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window length in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check whether a given key (usually IP + route) is within rate limits.
 * Returns { allowed, remaining, resetAt }.
 */
export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + opts.windowMs };
    store.set(key, newEntry);
    return { allowed: true, remaining: opts.limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= opts.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: opts.limit - entry.count, resetAt: entry.resetAt };
}

/** Extract the real client IP from Next.js request headers */
export function getClientIp(req: Request): string {
  const headers = req.headers as Headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? headers.get('cf-connecting-ip') ?? 'unknown';
}

/** Build a standard 429 response with Retry-After header */
export function rateLimitResponse(resetAt: number): Response {
  const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
  return Response.json(
    { error: 'Too many requests. Please slow down and try again.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSecs),
        'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
      },
    },
  );
}
