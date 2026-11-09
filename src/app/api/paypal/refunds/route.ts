import { NextRequest, NextResponse } from 'next/server';
import { refundPayPalCapture } from '@/lib/paypal';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { captureId, amount, currency, noteToPayer, projectId, milestoneId } = body;

    if (!captureId) {
      return NextResponse.json({ error: 'Capture ID is required' }, { status: 400 });
    }

    // Idempotency: verify if refund already exists for this capture
    const existingTransactions = await db.getTransactions(projectId);
    const alreadyRefunded = existingTransactions.find(
      (t) => t.type === 'refund' && t.notes?.includes(captureId)
    );

    if (alreadyRefunded) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        message: 'Refund has already been executed for this capture.',
        refund: {
          id: alreadyRefunded.paypal_refund_id || 'REFUND_IDEMPOTENT',
          status: 'COMPLETED',
          amount: { value: String(alreadyRefunded.amount), currency_code: alreadyRefunded.currency },
        },
      });
    }

    const refund = await refundPayPalCapture({
      captureId,
      amount: amount ? Number(amount) : undefined,
      currency: currency || 'USD',
      noteToPayer,
    });

    if (projectId) {
      const clientId = session?.userId || 'fe62449c-8908-479f-9302-470005140e70';
      const clientName = session?.fullName || 'NovaTech Enterprises';

      await db.createTransaction({
        id: crypto.randomUUID(),
        project_id: projectId,
        milestone_id: milestoneId,
        client_id: clientId,
        client_name: clientName,
        provider_id: 'de0b6989-bf7e-4d6e-b127-397af924a75b',
        provider_name: 'ActenX Solutions',
        amount: Number(refund.amount.value),
        currency: refund.amount.currency_code,
        type: 'refund',
        status: 'refunded',
        paypal_refund_id: refund.id,
        verification_status: 'verified',
        notes: `${noteToPayer || 'Authorized refund executed'} [Capture: ${captureId}]`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, refund });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
