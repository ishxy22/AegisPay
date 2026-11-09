import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submitDisputeEvidence } from '@/lib/paypal';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { notes, dossierHash } = body;

    const dispute = await db.getDisputeById(id);
    if (!dispute) {
      return NextResponse.json({ error: 'Dispute record not found' }, { status: 404 });
    }

    const submissionResult = await submitDisputeEvidence({
      disputeId: dispute.paypal_dispute_id,
      evidenceType: 'PROOF_OF_FULFILLMENT',
      notes: notes || 'AegisPay Digital Fulfillment Evidence Dossier submitted with cryptographic verification.',
      dossierHash: dossierHash || dispute.evidence_dossier_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    });

    // ONLY mark dispute as submitted if PayPal API genuinely returns HTTP success
    if (submissionResult.success && submissionResult.isRealPayPal) {
      await db.updateDispute(dispute.id, {
        status: 'evidence_submitted',
        evidence_submitted_at: submissionResult.submittedAt || new Date().toISOString(),
        paypal_response_notes: submissionResult.message,
      });

      await db.logActivity({
        project_id: dispute.project_id,
        action: 'DISPUTE_EVIDENCE_SUBMITTED',
        category: 'dispute',
        details: {
          dispute_id: dispute.paypal_dispute_id,
          status: 'evidence_submitted',
          reference_id: submissionResult.referenceId,
          http_status: submissionResult.httpStatus,
        },
      });

      return NextResponse.json({
        success: true,
        disputeStatus: 'evidence_submitted',
        displayStatus: 'Evidence Submitted to PayPal',
        result: submissionResult,
      });
    }

    // Submission was rejected or not acknowledged by PayPal (e.g. HTTP 404 RESOURCE_NOT_FOUND)
    // Strictly preserve truthfulness: NEVER set status to evidence_submitted without live PayPal confirmation
    await db.updateDispute(dispute.id, {
      status: 'evidence_awaiting_approval',
      evidence_submitted_at: undefined,
      paypal_response_notes: submissionResult.message,
    });

    await db.logActivity({
      project_id: dispute.project_id,
      action: 'DISPUTE_EVIDENCE_SUBMISSION_ATTEMPTED',
      category: 'dispute',
      details: {
        dispute_id: dispute.paypal_dispute_id,
        status: 'evidence_awaiting_approval',
        http_status: submissionResult.httpStatus,
        message: submissionResult.message,
      },
    });

    return NextResponse.json(
      {
        success: false,
        disputeStatus: 'evidence_awaiting_approval',
        displayStatus: 'Evidence Ready – Submission Pending',
        error: submissionResult.message,
        result: submissionResult,
      },
      { status: submissionResult.httpStatus && submissionResult.httpStatus >= 400 && submissionResult.httpStatus < 500 ? submissionResult.httpStatus : 422 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
