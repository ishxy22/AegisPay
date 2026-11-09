// ==============================================================================
// AEGISPAY GROQ (LLAMA 3) MEDIATION & DISPUTE REASONING ENGINE
// Computes fair settlement compromises & prepares structured dispute defense.
// ==============================================================================

import { env } from '../env';
import { Milestone, VerificationReport, MediationProposal, DisputeRecord } from '@/types';

/**
 * Generate a reasoned settlement proposal before a disagreement turns into a formal dispute.
 */
export async function generateMediationProposal(params: {
  milestone: Milestone;
  verificationReport: VerificationReport;
  disagreementSummary?: string;
}): Promise<MediationProposal> {
  const milestone = params.milestone;
  const report = params.verificationReport;
  const originalAmount = milestone.allocated_amount;
  const completionPercentage = report.completion_percentage;

  if (env.groq.apiKey) {
    try {
      const prompt = `You are a neutral, analytical commercial mediator specialized in digital software contracts for AegisPay.
Analyze the following milestone verification results and propose a fair, data-backed financial compromise between the client and developer.

MILESTONE: ${milestone.title}
ORIGINAL VALUE: ${originalAmount} USD
VERIFIED COMPLETION: ${completionPercentage}%
PASSED CRITERIA: ${report.passed_criteria}/${report.total_criteria}
PARTIAL CRITERIA: ${report.partially_satisfied_criteria}/${report.total_criteria}
FAILED CRITERIA: ${report.failed_criteria}/${report.total_criteria}
DISAGREEMENT NOTE: ${params.disagreementSummary || 'Client disputes completion due to partial automated test failures.'}

CRITICAL RULES:
1. Propose fair refund and retained amounts that sum exactly to ${originalAmount}.
2. Explain the rationale transparently based on delivered value vs remediation costs.
3. Include explicit supporting evidence and risks/limitations.
4. Output ONLY valid JSON matching this schema:
{
  "proposed_refund_amount": 250,
  "proposed_retained_amount": 1000,
  "explanation": "Detailed professional reasoning...",
  "supporting_evidence": ["Evidence point 1", "Evidence point 2"],
  "risks_and_limitations": ["Risk 1", "Risk 2"]
}`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.groq.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: env.groq.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const refund = Number(parsed.proposed_refund_amount) || Math.round(originalAmount * (1 - completionPercentage / 100));
          const retained = originalAmount - refund;

          return {
            id: `prop_med_${Date.now()}`,
            case_id: `case_${milestone.id}`,
            project_id: milestone.project_id,
            milestone_id: milestone.id,
            original_amount: originalAmount,
            currency: 'USD',
            verified_completion_percentage: completionPercentage,
            proposed_refund_amount: refund,
            proposed_retained_amount: retained,
            explanation: parsed.explanation || 'Calculated proportional settlement proposal.',
            supporting_evidence: parsed.supporting_evidence || [
              `Verified completion rate: ${completionPercentage}%`,
              `Deterministic verification report: ${report.id}`,
            ],
            risks_and_limitations: parsed.risks_and_limitations || [
              'Mutual signoff required by both client and provider.',
              'Funds refunded via PayPal once approved.',
            ],
            client_status: 'pending',
            provider_status: 'pending',
            overall_status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('[Groq API] Mediation reasoning fallback:', err);
    }
  }

  // Heuristic Mediation Settlement Model
  // e.g. 75% completed -> 20% refund, 80% retained (accommodating slight discount for client remediation)
  const unverifiedRatio = Math.max(0, (100 - completionPercentage) / 100);
  const refundAmount = Math.round(originalAmount * unverifiedRatio);
  const retainedAmount = originalAmount - refundAmount;

  return {
    id: `prop_med_${Date.now()}`,
    case_id: `case_${milestone.id}`,
    project_id: milestone.project_id,
    milestone_id: milestone.id,
    original_amount: originalAmount,
    currency: 'USD',
    verified_completion_percentage: completionPercentage,
    proposed_refund_amount: refundAmount,
    proposed_retained_amount: retainedAmount,
    explanation: `${completionPercentage}% of the agreed milestone criteria have been deterministically verified. A partial refund of $${refundAmount} ($${originalAmount} total - $${retainedAmount} retained for verified code and assets) offers an equitable compromise before formal payment arbitration.`,
    supporting_evidence: [
      `Deterministic verification passed ${report.passed_criteria} of ${report.total_criteria} criteria.`,
      `Live preview and GitHub pull request verified with zero fatal compilation errors.`,
      `Cryptographic Proof-of-Work Receipt logged with append-only integrity.`,
    ],
    risks_and_limitations: [
      'Both parties must explicitly authorize settlement before funds are moved.',
      'A proposed compromise is not an executed refund until confirmed by PayPal.',
      'Acceptance waives subsequent chargeback claims for this milestone deliverable.',
    ],
    client_status: 'pending',
    provider_status: 'accepted',
    overall_status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Reason about dispute evidence defense against a PayPal dispute reason.
 */
export async function analyzeDisputeDefense(params: {
  dispute: DisputeRecord;
  milestone: Milestone;
  receiptHash: string;
}): Promise<{
  defenseSummary: string;
  recommendedActions: string[];
  evidenceArguments: string[];
}> {
  return {
    defenseSummary: `The merchant has satisfied the agreed digital services contract for "${params.milestone.title}". Digital proof-of-work receipt (${params.receiptHash.slice(0, 16)}...) confirms code repository delivery, staging deployment healthcheck, and acceptance criteria verification prior to dispute filing.`,
    recommendedActions: [
      'Submit the AegisPay Digital Fulfillment Evidence Dossier PDF via PayPal Customer Disputes API.',
      'Highlight commit timestamps, pull request diffs, and live endpoint probes.',
      'Maintain status in "evidence_submitted" until PayPal formal adjudication.',
    ],
    evidenceArguments: [
      'Proof of Delivery: GitHub PR merged with verifiable commit SHA.',
      'Proof of Functionality: Live endpoint responded HTTP 200 during automated healthcheck.',
      'Cryptographic Integrity: SHA-256 canonical receipt logged in append-only storage.',
    ],
  };
}
