import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEvidenceDossierPdf } from '@/lib/pdf/dossier-generator';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const disputes = await db.getDisputes();
    const dispute = disputes.find((d) => d.id === id || d.paypal_dispute_id === id) || disputes[0];

    const project = (await db.getProjectById(dispute.project_id)) || (await db.getProjects())[0];
    const milestones = await db.getMilestonesByProject(project.id);
    const milestone = milestones.find((m) => m.id === dispute.milestone_id) || milestones[1] || milestones[0];

    const receipt = milestone?.proof_receipt_id ? await db.getProofReceipt(milestone.proof_receipt_id) : null;
    const report = milestone?.id ? await db.getVerificationReport(`rep_${milestone.id}`) : null;

    const pdfBytes = await generateEvidenceDossierPdf({
      dispute,
      project,
      milestone,
      receipt,
      verificationReport: report,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="AegisPay-Dossier-${dispute.paypal_dispute_id}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: any) {
    console.error('[Dossier PDF API] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
