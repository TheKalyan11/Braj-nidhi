import { NextRequest } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', reservation_id } = await request.json();

    if (!amount || amount <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: reservation_id || `rcpt_${Date.now()}`,
      notes: { reservation_id: reservation_id || '' },
    });

    return Response.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    return Response.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
