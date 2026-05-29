import { NextRequest } from 'next/server';
import { sendBookingNotifications } from '@/lib/notifications';
import type { BookingNotificationPayload } from '@/lib/notifications';
import { isAdminAuthorized, unauthorizedResponse, sanitizeString, isValidEmail } from '@/lib/apiAuth';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  // ── Auth — only admin or internal server calls can trigger notifications ─────
  if (!isAdminAuthorized(req)) return unauthorizedResponse();

  // ── Rate limit: 3 req/min per IP ─────────────────────────────────────────────
  const ip = getClientIp(req);
  const rl = checkRateLimit(`notifications:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = (await req.json()) as BookingNotificationPayload;

    if (!body.bookingRef || !body.guestEmail || !body.guestPhone) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(body.guestEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Sanitize text fields before passing to notification sender
    const payload: BookingNotificationPayload = {
      ...body,
      guestName:  sanitizeString(body.guestName, 100),
      guestEmail: body.guestEmail.trim().toLowerCase(),
      guestPhone: body.guestPhone.trim(),
      roomName:   sanitizeString(body.roomName, 100),
      bookingRef: sanitizeString(body.bookingRef, 50),
    };

    const result = await sendBookingNotifications(payload);
    return Response.json({ success: true, result });
  } catch (e: any) {
    console.error('[/api/notifications] Error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
