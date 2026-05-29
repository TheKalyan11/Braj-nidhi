/**
 * /api/chat/logs — Chat accounting & stats
 *
 * Requires ADMIN_SECRET auth.
 */
import { NextRequest } from 'next/server';
import { isAdminAuthorized } from '@/lib/apiAuth';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { getChatLogs, getChatStats } from '@/lib/chatStore';

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`chat-logs:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const url = new URL(req.url);
    const limitParam = parseInt(url.searchParams.get('limit') ?? '50', 10);
    const limit = Math.min(Math.max(1, limitParam), 500);

    const [logs, stats] = await Promise.all([
      getChatLogs(limit),
      getChatStats(),
    ]);

    return Response.json({ logs, stats });
  } catch (e) {
    console.error('[chat/logs] GET error:', e);
    return Response.json({ error: 'Failed to load chat logs' }, { status: 500 });
  }
}
