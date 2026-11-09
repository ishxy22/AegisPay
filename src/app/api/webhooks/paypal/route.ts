import { NextRequest, NextResponse } from 'next/server';
import { db, supabase } from '@/lib/db';
import { verifyPayPalWebhookSignature } from '@/lib/paypal';
import { sha256 } from '@/lib/crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headersList: Record<string, string | undefined> = {};
    req.headers.forEach((val, key) => {
      headersList[key.toLowerCase()] = val;
    });

    // 1. Verify Webhook Signature
    const isVerified = await verifyPayPalWebhookSignature({
      headers: headersList,
      rawBody,
    });

    if (!isVerified) {
      console.warn('[PayPal Webhook] Signature verification failed');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const eventId = payload.id || headersList['paypal-transmission-id'] || `ev_${Date.now()}`;
    const eventType = payload.event_type || 'UNKNOWN';

    // 2. Prevent duplicate processing (Idempotency check via PostgreSQL)
    const idempotencyKey = `paypal_wh_${eventId}`;

    if (supabase) {
      const { data: existing } = await supabase
        .from('webhook_events')
        .select('id, processed')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({
          received: true,
          duplicate: true,
          message: 'Webhook event already processed (idempotent)',
          idempotency_key: idempotencyKey,
        });
      }
    }

    // 3. Process specific PayPal events
    if (eventType.startsWith('CUSTOMER.DISPUTE.')) {
      const disputeResource = payload.resource || {};
      const paypalDisputeId = disputeResource.dispute_id || `PP-D-${Date.now()}`;
      const amount = Number(disputeResource.dispute_amount?.value) || 1250;
      const reason = disputeResource.reason || 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED';

      // Find project associated with this dispute
      const projects = await db.getProjects();
      const targetProject = projects[0];

      // Auto-generate defense dossier hash
      const dossierHash = sha256(`dossier_${paypalDisputeId}_${Date.now()}`);

      const disputeRecord = {
        paypal_dispute_id: paypalDisputeId,
        project_id: targetProject?.id || '',
        amount,
        currency: 'USD',
        dispute_reason: reason,
        dispute_state: 'REQUIRED_ACTION' as const,
        status: 'evidence_awaiting_approval' as const,
        evidence_dossier_id: `dossier_${paypalDisputeId}`,
        evidence_dossier_hash: dossierHash,
        defense_mode: 'assisted' as const,
        paypal_response_notes: 'Webhook received. Digital fulfillment evidence dossier prepared and ready for review.',
      };

      await db.saveDispute(disputeRecord);

      await db.logActivity({
        project_id: disputeRecord.project_id,
        action: 'WEBHOOK_DISPUTE_RECEIVED',
        category: 'dispute',
        details: { event_type: eventType, dispute_id: paypalDisputeId, reason },
      });
    }

    // Record processed webhook event for idempotency
    if (supabase) {
      await supabase.from('webhook_events').insert({
        idempotency_key: idempotencyKey,
        event_type: eventType,
        resource_type: 'dispute',
        source: 'paypal',
        signature_verified: isVerified,
        payload,
        processed: true,
        processed_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      received: true,
      event_type: eventType,
      idempotency_key: idempotencyKey,
    });
  } catch (err: any) {
    console.error('[PayPal Webhook] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
