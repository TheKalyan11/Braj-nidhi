import { NextRequest } from 'next/server';
import {
  getAvailabilityForRange,
  getUnavailableDates,
  suggestUpgrade,
} from '@/lib/roomAvailability';
import type { RoomType } from '@/lib/roomAvailability';
import { isValidDate } from '@/lib/apiAuth';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';

const VALID_ROOM_TYPES: RoomType[] = ['deluxe2', 'deluxe3', 'deluxe4'];

export async function GET(req: NextRequest) {
  // ── Rate limit: 30 req/min per IP ───────────────────────────────────────────
  const ip = getClientIp(req);
  const rl = checkRateLimit(`availability:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const { searchParams } = new URL(req.url);
  const roomType = searchParams.get('roomType') as RoomType;
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const rooms = parseInt(searchParams.get('rooms') || '1', 10);

  // ── Input validation ────────────────────────────────────────────────────────
  if (!roomType || !from || !to) {
    return Response.json(
      { error: 'Missing params: roomType, from, to' },
      { status: 400 },
    );
  }

  if (!VALID_ROOM_TYPES.includes(roomType)) {
    return Response.json({ error: 'Invalid roomType' }, { status: 400 });
  }

  if (!isValidDate(from) || !isValidDate(to)) {
    return Response.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
  }

  if (new Date(from) >= new Date(to)) {
    return Response.json({ error: 'from must be before to' }, { status: 400 });
  }

  // Max 90-day window to prevent large computation
  const daysDiff = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
  if (daysDiff > 90) {
    return Response.json({ error: 'Date range cannot exceed 90 days' }, { status: 400 });
  }

  if (isNaN(rooms) || rooms < 1 || rooms > 10) {
    return Response.json({ error: 'rooms must be between 1 and 10' }, { status: 400 });
  }

  try {
    const availability = getAvailabilityForRange(roomType, from, to);
    const unavailableDates = getUnavailableDates(roomType, from, to, rooms);
    const upgrade =
      unavailableDates.length > 0
        ? suggestUpgrade(roomType, from, to, rooms)
        : null;

    return Response.json({ availability, unavailableDates, upgrade });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
