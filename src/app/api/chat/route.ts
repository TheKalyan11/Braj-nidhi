/**
 * /api/chat — Secure OpenAI proxy with accounting + training
 *
 * • API key stays on server
 * • Logs every conversation for accounting
 * • Injects custom training data into the system prompt
 */
import { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/apiAuth';
import { saveChatLog, buildTrainingPrompt } from '@/lib/chatStore';

const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: NextRequest) {
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

    const sanitizedMessages = messages
      .slice(-10)
      .map((m: any) => {
        if (typeof m?.role !== 'string' || typeof m?.content !== 'string') return null;
        const role = ['user', 'assistant'].includes(m.role) ? m.role : 'user';
        return { role, content: sanitizeString(m.content, MAX_MESSAGE_LENGTH) };
      })
      .filter(Boolean);

    // Build system prompt with training data injected
    let fullSystemPrompt = sanitizeString(systemPrompt ?? '', 3000);
    try {
      const trainingAddon = await buildTrainingPrompt();
      if (trainingAddon) fullSystemPrompt += trainingAddon;
    } catch (e) {
      console.error('[chat] training data load failed:', e);
    }

    const openAiBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        ...(fullSystemPrompt ? [{ role: 'system', content: fullSystemPrompt }] : []),
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
      return Response.json({ error: 'AI service temporarily unavailable' }, { status: 502 });
    }

    const data = await openAiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? '';
    const tokensUsed = data.usage?.total_tokens ?? 0;

    // ── Log for accounting (non-blocking) ───────────────────────────────────
    const lastUserMsg = sanitizedMessages.filter((m: any) => m.role === 'user').pop();
    saveChatLog({
      id: `CL${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ip,
      userMessage: lastUserMsg?.content ?? '',
      botReply: reply.slice(0, 300),
      tokens: tokensUsed,
      timestamp: new Date().toISOString(),
    }).catch(e => console.error('[chat] log save failed:', e));

    return Response.json({ reply, tokens: tokensUsed });
  } catch (e: any) {
    console.error('[/api/chat] Error:', e);
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
