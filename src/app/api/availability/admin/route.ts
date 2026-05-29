import { NextRequest } from 'next/server';
import {
  readBookings,
  cancelBooking,
  restoreBooking,
  retryERPSync,
  getAvailabilityForRange,
  TOTAL_ROOMS,
  UPGRADE_ORDER,
} from '@/lib/roomAvailability';
import type { RoomType } from '@/lib/roomAvailability';
import { isAdminAuthorized, unauthorizedResponse } from '@/lib/apiAuth';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();

  const ip = getClientIp(req);
  const rl = checkRateLimit(`admin:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const bookings = await readBookings();

    const today = new Date();
    const from = today.toISOString().split('T')[0];
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + 90);
    const to = toDate.toISOString().split('T')[0];

    const snapshot: Record<string, Record<string, number>> = {};
    for (const rt of UPGRADE_ORDER as RoomType[]) {
      snapshot[rt] = await getAvailabilityForRange(rt, from, to);
    }

    const erpConfig = {
      hasCredentials: !!(process.env.ERP_API_KEY && process.env.ERP_API_SECRET),
      property: process.env.ERP_PROPERTY ?? '',
      roomTypes: {
        deluxe2: process.env.ERP_ROOM_TYPE_DELUXE2 ?? '',
        deluxe3: process.env.ERP_ROOM_TYPE_DELUXE3 ?? '',
        deluxe4: process.env.ERP_ROOM_TYPE_DELUXE4 ?? '',
      },
    };

    return Response.json({ bookings, snapshot, totalRooms: TOTAL_ROOMS, erpConfig });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) return unauthorizedResponse();

  const ip = getClientIp(req);
  const rl = checkRateLimit(`admin-patch:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  const { searchParams } = new URL(req.url);
  const id     = searchParams.get('id');
  const action = searchParams.get('action');

  if (!id || !action) {
    return Response.json({ error: 'Missing id or action' }, { status: 400 });
  }
  if (!/^BK[A-Za-z0-9_-]+$/.test(id)) {
    return Response.json({ error: 'Invalid booking id format' }, { status: 400 });
  }

  const ALLOWED_ACTIONS = ['cancel', 'restore', 'retry-erp'];
  if (!ALLOWED_ACTIONS.includes(action)) {
    return Response.json({ error: 'Unknown action' }, { status: 400 });
  }

  if (action === 'cancel')    return Response.json({ success: await cancelBooking(id) });
  if (action === 'restore')   return Response.json({ success: await restoreBooking(id) });
  if (action === 'retry-erp') return Response.json(await retryERPSync(id));

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}
