// ==============================================================================
// AEGISPAY CRYPTOGRAPHIC VERIFICATION & RECEIPT CANONICALIZATION
// Generates tamper-evident SHA-256 hashes of digital proof-of-work receipts.
// ==============================================================================

import crypto from 'crypto';
import { ProofOfWorkReceipt } from '@/types';

/**
 * Deterministically sort object keys for canonical JSON serialization.
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalizeJson(item)).join(',') + ']';
  }

  const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = sortedKeys.map((key) => {
    const val = (obj as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  });

  return '{' + pairs.join(',') + '}';
}

/**
 * Compute SHA-256 hex digest from arbitrary string content.
 */
export function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Generate a complete, tamper-evident ProofOfWorkReceipt.
 */
export function generateProofReceipt(params: {
  projectId: string;
  milestoneId: string;
  providerId: string;
  clientId: string;
  commitSha?: string;
  pullRequestRef?: string;
  deploymentUrl?: string;
  testResultsSummary: string;
  criteriaResults: {
    total: number;
    passed: number;
    completion_rate: number;
  };
  verificationReportId: string;
  receiptVersion?: string;
}): ProofOfWorkReceipt {
  const timestamp = new Date().toISOString();
  const receiptId = `pow_rcpt_${crypto.randomUUID().slice(0, 12)}`;
  const version = params.receiptVersion || '1.0.0';

  const rawPayload = {
    receipt_version: version,
    project_id: params.projectId,
    milestone_id: params.milestoneId,
    provider_id: params.providerId,
    client_id: params.clientId,
    commit_sha: params.commitSha || null,
    pull_request_ref: params.pullRequestRef || null,
    deployment_url: params.deploymentUrl || null,
    test_results_summary: params.testResultsSummary,
    acceptance_criteria_results: {
      total: params.criteriaResults.total,
      passed: params.criteriaResults.passed,
      completion_rate: Number(params.criteriaResults.completion_rate.toFixed(2)),
    },
    verification_report_id: params.verificationReportId,
    timestamp,
    disclaimer: 'AegisPay Cryptographic Proof-of-Work Receipt. Not a physical carrier tracking number.',
  };

  const canonicalPayload = canonicalizeJson(rawPayload);
  const contentSha256 = sha256(canonicalPayload);

  return {
    id: receiptId,
    receipt_version: version,
    project_id: params.projectId,
    milestone_id: params.milestoneId,
    provider_id: params.providerId,
    client_id: params.clientId,
    commit_sha: params.commitSha,
    pull_request_ref: params.pullRequestRef,
    deployment_url: params.deploymentUrl,
    test_results_summary: params.testResultsSummary,
    acceptance_criteria_results: {
      total: params.criteriaResults.total,
      passed: params.criteriaResults.passed,
      completion_rate: params.criteriaResults.completion_rate,
    },
    verification_report_id: params.verificationReportId,
    timestamp,
    content_sha256: contentSha256,
    tamper_evident: true,
    canonical_payload: canonicalPayload,
    created_at: timestamp,
  };
}

/**
 * Verify receipt integrity by recomputing hash of canonical payload.
 */
export function verifyReceiptIntegrity(receipt: ProofOfWorkReceipt): boolean {
  if (!receipt.canonical_payload || !receipt.content_sha256) return false;
  const recomputed = sha256(receipt.canonical_payload);
  return recomputed === receipt.content_sha256;
}
