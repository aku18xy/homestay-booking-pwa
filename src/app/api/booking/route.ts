import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking, webhookUrl } = body;

    if (!booking) {
      return NextResponse.json({ error: 'Missing booking payload' }, { status: 400 });
    }

    // Forward to Google Sheets Webhook if provided
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking),
        });
      } catch (webhookErr) {
        console.warn('Google Sheets Webhook sync warning:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      booking_code: booking.booking_code,
      message: 'Booking successfully processed and synced',
    });
  } catch (err: any) {
    console.error('Booking API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
