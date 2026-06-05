import { NextRequest } from 'next/server';
import { clearERPCache } from '@/lib/roomAvailability';
import { isAdminAuthorized } from '@/lib/apiAuth';

/**
 * POST /api/availability/invalidate
 *
 * Instantly clears the in-memory ERP availability cache so the next
 * availability request fetches fresh data from the ERP.
 *
 * Auth: ADMIN_SECRET header, or ERP webhook secret via ?secret= param.
 *
 * Usage from ERP:
 *   curl -X POST https://yoursite.com/api/availability/invalidate?secret=YOUR_ADMIN_SECRET
 *
 * Can be wired as a Frappe webhook on Reservation doc_events (on_update,
 * on_cancel, after_insert) for true instant sync.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const adminSecret = process.env.ADMIN_SECRET;

  const authorized =
    isAdminAuthorized(req) ||
    (adminSecret && secret === adminSecret);

  if (!authorized) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  clearERPCache();
  return Response.json({ success: true, message: 'ERP cache cleared' });
}
