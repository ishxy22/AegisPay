import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const body = await req.json().catch(() => ({}));
    const { milestoneId } = body;

    const capture = await capturePayPalOrder(orderId);

    if (milestoneId) {
      await db.updateMilestone(milestoneId, {
        paypal_capture_id: capture.id,
        status: 'payment_captured',
      });
    }

    return NextResponse.json({
      success: true,
      capture,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
