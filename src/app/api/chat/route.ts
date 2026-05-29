/**
 * /api/chat — Secure OpenAI proxy
 *
 * The OpenAI API key stays on the server (OPENAI_API_KEY in .env.local).
 * The browser never sees the key. The floating widget calls this endpoint instead.
 */
import { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/apiAuth';

// Max characters in a single user message
const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: NextRequest) {
  // ── Rate limit: 20 messages/min per IP ──────────────────────────────────────
  const ip = getClientIp(req);
  const rl = checkRateLimit(`chat:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'AI chat is not configured' }, { status: 503 });
    }

    const { messages, systemPrompt } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'messages array is required' }, { status: 400 });
    }

    // Validate and sanitize each message
    const sanitizedMessages = messages
      .slice(-10) // keep last 10 messages to limit token usage
      .map((m: any) => {
        if (typeof m?.role !== 'string' || typeof m?.content !== 'string') return null;
        const role = ['user', 'assistant'].includes(m.role) ? m.role : 'user';
        const content = sanitizeString(m.content, MAX_MESSAGE_LENGTH);
        return { role, content };
      })
      .filter(Boolean);

    const cleanSystemPrompt = sanitizeString(systemPrompt ?? '', 3000);

    const openAiBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        ...(cleanSystemPrompt ? [{ role: 'system', content: cleanSystemPrompt }] : []),
        ...sanitizedMessages,
      ],
      max_tokens: 250,
    };

    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(openAiBody),
      signal: AbortSignal.timeout(20_000),
    });

    if (!openAiRes.ok) {
      const err = await openAiRes.json().catch(() => ({}));
      console.error('[/api/chat] OpenAI error:', err);
      return Response.json(
        { error: 'AI service temporarily unavailable' },
        { status: 502 },
      );
    }

    const data = await openAiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? '';
    return Response.json({ reply });
  } catch (e: any) {
    console.error('[/api/chat] Error:', e);
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
