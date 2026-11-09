import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyDeliverableWithAI } from '@/lib/ai/gemini';
import { generateProofReceipt } from '@/lib/crypto';
import { DeliverableSubmission } from '@/types';
import { DEFAULT_NOVATECH_MILESTONES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { milestoneId, githubRepoUrl, githubPrUrl, commitSha, deploymentUrl, notes, screenshots } = body;

    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 });
    }

    let milestone = await db.getMilestoneById(milestoneId);
    if (!milestone) {
      milestone = DEFAULT_NOVATECH_MILESTONES.find((m) => m.id === milestoneId) || null;
    }
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    let project = await db.getProjectById(milestone.project_id);
    if (!project) {
      project = {
        id: milestone.project_id,
        title: 'Enterprise Web Application (NovaTech Benchmark)',
        description: 'Complete modern web application with Next.js App Router, Tailwind CSS, and PayPal Checkout.',
        client_id: 'fe62449c-8908-479f-9302-470005140e70',
        client_name: 'NovaTech Enterprises',
        client_email: 'finance@novatech.io',
        provider_id: 'de0b6989-bf7e-4d6e-b127-397af924a75b',
        provider_name: 'ActenX Solutions (Ishita & Fuzail)',
        provider_email: 'fuzail@actenx.com',
        total_budget: 3000,
        currency: 'USD',
        deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // 1. Record Deliverable Submission
    const submission: DeliverableSubmission = {
      id: `sub_${Date.now()}`,
      milestone_id: milestone.id,
      project_id: project.id,
      submitted_by: project.provider_id,
      github_repo_url: githubRepoUrl,
      github_pr_url: githubPrUrl,
      commit_sha: commitSha || (githubPrUrl ? '7b4cf288e219ba38029a1b' : undefined),
      deployment_url: deploymentUrl,
      screenshot_urls: screenshots || [],
      document_urls: [],
      notes: notes || 'Submitted for AegisPay AI verification.',
      created_at: new Date().toISOString(),
    };
    await db.createSubmission(submission);

    // 2. Execute AI Fulfillment Inspector
    const report = await verifyDeliverableWithAI({
      milestone,
      submission: {
        githubRepoUrl,
        githubPrUrl,
        commitSha: submission.commit_sha,
        deploymentUrl,
        notes,
        screenshots,
      },
    });
    await db.saveVerificationReport(report);

    // 3. Generate Tamper-Evident SHA-256 Proof-of-Work Receipt
    const receipt = generateProofReceipt({
      projectId: project.id,
      milestoneId: milestone.id,
      providerId: project.provider_id,
      clientId: project.client_id,
      commitSha: submission.commit_sha,
      pullRequestRef: githubPrUrl,
      deploymentUrl,
      testResultsSummary: `${report.passed_criteria} passed, ${report.partially_satisfied_criteria} partial, ${report.failed_criteria} failed`,
      criteriaResults: {
        total: report.total_criteria,
        passed: report.passed_criteria,
        completion_rate: report.completion_percentage,
      },
      verificationReportId: report.id,
    });
    await db.saveProofReceipt(receipt);

    // 4. Update Milestone & Transaction Status
    const newMilestoneStatus =
      report.completion_percentage >= 95
        ? 'verified'
        : report.completion_percentage >= 50
        ? 'partially_verified'
        : 'verifying';

    await db.updateMilestone(milestone.id, {
      status: newMilestoneStatus,
      verified_at: new Date().toISOString(),
      proof_receipt_id: receipt.id,
    });

    // Update corresponding financial transaction if exists
    const txs = await db.getTransactions(project.id);
    const relatedTx = txs.find((t) => t.milestone_id === milestone.id);
    if (relatedTx) {
      await db.updateTransaction(relatedTx.id, {
        verification_status: newMilestoneStatus === 'verified' ? 'verified' : 'in_review',
        receipt_hash: receipt.content_sha256,
      });
    }

    return NextResponse.json({
      success: true,
      report,
      receipt,
      milestoneStatus: newMilestoneStatus,
    });
  } catch (err: any) {
    console.error('[Verification API] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
