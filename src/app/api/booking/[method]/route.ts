import { NextRequest } from 'next/server';

const ERP_API_KEY = process.env.ERP_API_KEY;
const ERP_API_SECRET = process.env.ERP_API_SECRET;
const ERP_BASE_URL = process.env.ERP_BASE_URL || 'https://pankaj.vcmerp.in/api/method/guesthouse.website_booking_api';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ method: string }> }
) {
  try {
    if (!ERP_API_KEY || !ERP_API_SECRET) {
      return Response.json(
        { error: 'ERP credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    const { method } = await context.params;
    const body = await request.json();

    const targetUrl = `${ERP_BASE_URL.replace(/\/$/, '')}.${method}`;

    const erpResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${ERP_API_KEY}:${ERP_API_SECRET}`,
      },
      body: JSON.stringify(body),
    });

    const text = await erpResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(text);
    } catch {
      responseData = { raw: text };
    }

    if (!erpResponse.ok) {
      return Response.json(
        { error: responseData.exception || responseData.exc || 'ERP Request Failed', details: responseData },
        { status: erpResponse.status }
      );
    }

    const result = responseData.message !== undefined ? responseData.message : responseData;
    return Response.json(result);
  } catch (error: any) {
    console.error('ERP API Proxy Error:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
