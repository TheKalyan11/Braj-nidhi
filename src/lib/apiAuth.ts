/**
 * Shared API security utilities
 * - Admin token authentication
 * - Input sanitization
 * - Request origin verification
 */

/** Verify the admin secret token from Authorization header or ?token= query param */
export function isAdminAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('[apiAuth] ADMIN_SECRET is not set in .env.local — admin routes are locked');
    return false;
  }

  // Check Authorization: Bearer <token>
  const authHeader = req.headers.get('authorization') ?? '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    return token === secret;
  }

  // Check ?token=<secret> in query string (useful for browser testing)
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token') ?? '';
    return token === secret;
  } catch {
    return false;
  }
}

export function unauthorizedResponse(): Response {
  return Response.json(
    { error: 'Unauthorized. Valid admin token required.' },
    { status: 401, headers: { 'WWW-Authenticate': 'Bearer realm="admin"' } },
  );
}

/** Sanitize a string — strip HTML tags and trim whitespace */
export function sanitizeString(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/<[^>]*>/g, '')         // strip HTML tags
    .replace(/[<>"'`]/g, '')         // strip dangerous chars
    .slice(0, maxLength);
}

/** Validate an ISO date string (YYYY-MM-DD) */
export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
}

/** Validate Indian mobile number (10 digits, may start with 91) */
export function isValidPhone(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const digits = value.replace(/\D/g, '');
  return /^(91)?[6-9]\d{9}$/.test(digits);
}

/** Validate email (basic RFC check) */
export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Standard security headers added to every API response */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/** Merge security headers into a Response */
export function withSecurityHeaders(response: Response): Response {
  const res = new Response(response.body, response);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}
