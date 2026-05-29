/**
 * /api/chat/training — CRUD for chatbot training data
 *
 * All operations require ADMIN_SECRET auth.
 */
import { NextRequest } from 'next/server';
import { isAdminAuthorized } from '@/lib/apiAuth';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { getTrainingData, saveTrainingEntry, deleteTrainingEntry, TrainingEntry } from '@/lib/chatStore';
import { sanitizeString } from '@/lib/apiAuth';

// ── GET — list all training entries ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`training-get:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const data = await getTrainingData();
    return Response.json({ entries: data });
  } catch (e) {
    console.error('[training] GET error:', e);
    return Response.json({ error: 'Failed to load training data' }, { status: 500 });
  }
}

// ── POST — create or update a training entry ────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`training-post:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json();
    const { id, question, answer, category } = body;

    if (!question || !answer) {
      return Response.json({ error: 'question and answer are required' }, { status: 400 });
    }

    const entry: TrainingEntry = {
      id: id || `TR${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      question: sanitizeString(question, 500),
      answer: sanitizeString(answer, 2000),
      category: sanitizeString(category || 'general', 100),
      createdAt: new Date().toISOString(),
    };

    await saveTrainingEntry(entry);
    return Response.json({ success: true, entry });
  } catch (e) {
    console.error('[training] POST error:', e);
    return Response.json({ error: 'Failed to save training entry' }, { status: 500 });
  }
}

// ── DELETE — remove a training entry by id ──────────────────────────────────────
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = checkRateLimit(`training-del:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const { id } = await req.json();
    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    const deleted = await deleteTrainingEntry(id);
    if (!deleted) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (e) {
    console.error('[training] DELETE error:', e);
    return Response.json({ error: 'Failed to delete training entry' }, { status: 500 });
  }
}
