import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    return Response.json({ verified: true, payment_id: razorpay_payment_id });
  } catch (error: any) {
    console.error('Razorpay verify error:', error);
    return Response.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
