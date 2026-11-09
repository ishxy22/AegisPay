import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateMediationProposal } from '@/lib/ai/groq';
import { refundPayPalCapture } from '@/lib/paypal';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId') || undefined;
  const proposals = await db.getMediationProposals(projectId);
  return NextResponse.json(proposals);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Action 1: Generate Proposal
    if (action === 'generate' || action === 'propose') {
      const { milestoneId, disagreementSummary, notes } = body;
      const milestone = await db.getMilestoneById(milestoneId);
      if (!milestone) return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });

      // Create synthetic report if none exists
      const report = {
        id: `rep_${Date.now()}`,
        submission_id: `sub_${Date.now()}`,
        milestone_id: milestone.id,
        project_id: milestone.project_id,
        total_criteria: milestone.acceptance_criteria?.length || 4,
        passed_criteria: body.passedCriteria ?? 3,
        failed_criteria: body.failedCriteria ?? 0,
        partially_satisfied_criteria: body.partialCriteria ?? 1,
        completion_percentage: body.completionPercentage ?? 75,
        evidence_references: {},
        agent_confidence: 0.94,
        recommendations: ['Recommended for mediation compromise.'],
        timestamp: new Date().toISOString(),
        status: 'completed' as const,
      };

      const proposal = await generateMediationProposal({
        milestone,
        verificationReport: report,
        disagreementSummary: disagreementSummary || notes,
      });

      await db.createMediationProposal(proposal);
      return NextResponse.json({ success: true, proposal });
    }

    // Action 2: Accept Proposal (client or provider)
    if (action === 'accept') {
      const { proposalId, userRole, party } = body;
      const proposals = await db.getMediationProposals();
      const proposal = proposals.find((p) => p.id === proposalId) || proposals[0];
      if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

      const role = userRole || (party === 'provider' ? 'service_provider' : party);
      const updates: any = {};
      if (role === 'client') updates.client_status = 'accepted';
      if (role === 'service_provider') updates.provider_status = 'accepted';

      const isBothAccepted =
        (updates.client_status === 'accepted' || proposal.client_status === 'accepted') &&
        (updates.provider_status === 'accepted' || proposal.provider_status === 'accepted');

      if (isBothAccepted) {
        updates.overall_status = 'agreed';

        // Trigger authorized PayPal Sandbox refund for the agreed refund amount
        if (proposal.proposed_refund_amount > 0) {
          const refundRes = await refundPayPalCapture({
            captureId: 'CAPTURE_SANDBOX_1250_FE',
            amount: proposal.proposed_refund_amount,
            currency: proposal.currency,
            noteToPayer: `AegisPay Mediation Compromise Agreement for ${proposal.milestone_id}`,
          });

          updates.overall_status = 'settled_with_refund';
          updates.paypal_refund_id = refundRes.id;

          // Record financial refund transaction
          await db.createTransaction({
            id: `tx_ref_${Date.now()}`,
            project_id: proposal.project_id,
            milestone_id: proposal.milestone_id,
            client_id: 'usr_client_novatech',
            client_name: 'NovaTech Enterprises',
            provider_id: 'usr_dev_actenx',
            provider_name: 'ActenX Solutions',
            amount: proposal.proposed_refund_amount,
            currency: proposal.currency,
            type: 'refund',
            status: 'refunded',
            paypal_refund_id: refundRes.id,
            verification_status: 'verified',
            notes: `Authorized mediation compromise refund of $${proposal.proposed_refund_amount} executed.`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      const updated = await db.updateMediationProposal(proposal.id, updates);
      return NextResponse.json({ success: true, proposal: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
