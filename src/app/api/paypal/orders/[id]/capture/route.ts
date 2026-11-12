import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const body = await req.json().catch(() => ({}));
    const { milestoneId, simulate } = body;

    const capture = await capturePayPalOrder(orderId, { allowSimulation: Boolean(simulate) });

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
    const isUnapproved = err.message?.includes('ORDER_NOT_APPROVED') || err.message?.includes('Ensure buyer completes');
    return NextResponse.json(
      { error: err.message, requiresApproval: isUnapproved },
      { status: isUnapproved ? 422 : 500 }
    );
  }
}
