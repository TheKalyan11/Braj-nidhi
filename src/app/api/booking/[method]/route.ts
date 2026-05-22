import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ method: string }> }
) {
  try {
    const { method } = await context.params;
    const body = await request.json();

    // Check if custom credentials are provided in headers or body for private testing
    // Otherwise fall back to server-side environment variables
    const apiKey = request.headers.get('x-api-key') || process.env.ERP_API_KEY;
    const apiSecret = request.headers.get('x-api-secret') || process.env.ERP_API_SECRET;
    const customBase = request.headers.get('x-erp-base') || 'https://pankaj.vcmerp.in/api/method/guesthouse.website_booking_api';

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: 'ERP connection credentials are not configured. Please add ERP_API_KEY and ERP_API_SECRET to your environment variables.' },
        { status: 400 }
      );
    }

    const targetUrl = `${customBase.replace(/\/$/, '')}.${method}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `token ${apiKey}:${apiSecret}`,
    };

    const erpResponse = await fetch(targetUrl, {
      method: 'POST',
      headers,
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
