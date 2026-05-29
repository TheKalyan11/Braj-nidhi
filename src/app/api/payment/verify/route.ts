import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { sendBookingNotifications } from '@/lib/notifications';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // ── Rate limit: 10 verify attempts/min per IP ────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit(`verify:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingDetails,
    } = body;

    // ── Input validation ────────────────────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Validate Razorpay ID formats to reject obviously fake payloads
    if (
      !/^order_[A-Za-z0-9]+$/.test(razorpay_order_id) ||
      !/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id) ||
      !/^[a-f0-9]{64}$/.test(razorpay_signature)
    ) {
      return Response.json({ error: 'Invalid payment ID format' }, { status: 400 });
    }

    // ── Verify Razorpay HMAC signature ──────────────────────────────────────────
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[verify] RAZORPAY_KEY_SECRET not set');
      return Response.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Constant-time comparison — prevents timing attacks
    const sigBuffer = Buffer.from(razorpay_signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const signaturesMatch =
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    if (!signaturesMatch) {
      console.warn(`[verify] Signature mismatch from IP ${ip} — possible tamper attempt`);
      return Response.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // ── Fire notifications (non-blocking) ───────────────────────────────────────
    if (bookingDetails) {
      sendBookingNotifications({
        ...bookingDetails,
        paymentId: razorpay_payment_id,
      }).catch(err => console.error('[notifications] background error:', err));
    }

    return Response.json({ verified: true, payment_id: razorpay_payment_id });
  } catch (error: any) {
    console.error('Razorpay verify error:', error);
    return Response.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
