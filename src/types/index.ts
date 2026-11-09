// ==============================================================================
// AEGISPAY CORE DOMAIN AND DATABASE TYPES
// ==============================================================================

export type UserRole = 'service_provider' | 'client' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'draft' | 'active' | 'in_dispute' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  title: string;
  description: string;
  client_id: string;
  client_name: string;
  client_email: string;
  provider_id: string;
  provider_name: string;
  provider_email: string;
  total_budget: number;
  currency: string;
  deadline: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  milestone_count?: number;
  completed_milestones?: number;
}

export type MilestoneStatus =
  | 'draft'
  | 'payment_requested'
  | 'payment_approved'
  | 'payment_captured'
  | 'in_progress'
  | 'submitted'
  | 'verifying'
  | 'verified'
  | 'partially_verified'
  | 'disputed'
  | 'completed'
  | 'refund_requested'
  | 'refund_completed';

export interface AcceptanceCriterion {
  id: string;
  milestone_id: string;
  description: string;
  verification_method: 'automated_test' | 'github_inspection' | 'visual_ai' | 'manual_review';
  status: 'pending' | 'passed' | 'failed' | 'partially_satisfied';
  evidence_notes?: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  deliverables: string[];
  acceptance_criteria: AcceptanceCriterion[];
  expected_completion_date: string;
  allocated_amount: number;
  percentage_of_budget: number;
  dependencies: string[]; // Milestone IDs or titles
  verification_requirements: string[];
  status: MilestoneStatus;
  paypal_order_id?: string;
  paypal_capture_id?: string;
  paypal_invoice_id?: string;
  verified_at?: string;
  proof_receipt_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliverableSubmission {
  id: string;
  milestone_id: string;
  project_id: string;
  submitted_by: string;
  github_repo_url?: string;
  github_pr_url?: string;
  commit_sha?: string;
  deployment_url?: string;
  screenshot_urls: string[];
  document_urls: string[];
  notes: string;
  created_at: string;
}

export interface CriterionResult {
  criterion_id: string;
  description: string;
  status: 'passed' | 'failed' | 'partially_satisfied';
  confidence: number; // 0.0 - 1.0
  evidence_found: string;
  reasoning: string;
}

export interface VerificationReport {
  id: string;
  submission_id: string;
  milestone_id: string;
  project_id: string;
  total_criteria: number;
  passed_criteria: number;
  failed_criteria: number;
  partially_satisfied_criteria: number;
  completion_percentage: number;
  evidence_references: {
    github?: {
      repo?: string;
      pr_number?: number;
      commits_analyzed?: number;
      files_changed?: number;
      checks_status?: string;
    };
    deployment?: {
      url?: string;
      status_code?: number;
      response_time_ms?: number;
      accessible?: boolean;
    };
    visual_inspection?: {
      images_analyzed: number;
      ui_fidelity_score: number;
      observations: string[];
    };
  };
  agent_confidence: number; // 0.0 - 1.0
  recommendations: string[];
  timestamp: string;
  status: 'completed' | 'failed';
}

export interface ProofOfWorkReceipt {
  id: string;
  receipt_version: string;
  project_id: string;
  milestone_id: string;
  provider_id: string;
  client_id: string;
  commit_sha?: string;
  pull_request_ref?: string;
  deployment_url?: string;
  test_results_summary: string;
  acceptance_criteria_results: {
    total: number;
    passed: number;
    completion_rate: number;
  };
  verification_report_id: string;
  timestamp: string;
  content_sha256: string;
  tamper_evident: boolean;
  canonical_payload: string;
  created_at: string;
}

export type TransactionStatus =
  | 'initiated'
  | 'approved'
  | 'captured'
  | 'partially_refunded'
  | 'refunded'
  | 'disputed'
  | 'failed';

export interface FinancialTransaction {
  id: string;
  project_id: string;
  milestone_id?: string;
  client_id: string;
  client_name: string;
  provider_id: string;
  provider_name: string;
  amount: number;
  currency: string;
  type: 'milestone_payment' | 'milestone_capture' | 'refund' | 'dispute_hold';
  status: TransactionStatus;
  paypal_order_id?: string;
  paypal_capture_id?: string;
  paypal_refund_id?: string;
  verification_status: 'unverified' | 'in_review' | 'verified' | 'failed';
  receipt_hash?: string;
  dispute_status?: DisputeStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PayPalInvoice {
  id: string;
  invoice_number: string;
  project_id: string;
  milestone_id: string;
  recipient_email: string;
  recipient_name: string;
  amount: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  paypal_invoice_id: string;
  invoice_url?: string;
  due_date: string;
  created_at: string;
}

export type DisputeStatus =
  | 'evidence_generated'
  | 'evidence_awaiting_approval'
  | 'evidence_submitted'
  | 'submission_acknowledged'
  | 'dispute_outcome_pending'
  | 'dispute_won'
  | 'dispute_lost'
  | 'action_required';

export interface DisputeRecord {
  id: string;
  paypal_dispute_id: string;
  project_id: string;
  milestone_id?: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  dispute_reason:
    | 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED'
    | 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED'
    | 'UNAUTHORISED'
    | 'OTHER';
  dispute_state: 'REQUIRED_ACTION' | 'UNDER_REVIEW' | 'RESOLVED';
  status: DisputeStatus;
  evidence_dossier_id?: string;
  evidence_dossier_hash?: string;
  evidence_submitted_at?: string;
  defense_mode: 'assisted' | 'autonomous';
  paypal_response_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MediationProposal {
  id: string;
  case_id: string;
  project_id: string;
  milestone_id: string;
  original_amount: number;
  currency: string;
  verified_completion_percentage: number;
  proposed_refund_amount: number;
  proposed_retained_amount: number;
  explanation: string;
  supporting_evidence: string[];
  risks_and_limitations: string[];
  client_status: 'pending' | 'accepted' | 'rejected' | 'countered';
  provider_status: 'pending' | 'accepted' | 'rejected' | 'countered';
  overall_status: 'draft' | 'active' | 'agreed' | 'rejected' | 'settled_with_refund';
  paypal_refund_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  project_id?: string;
  user_id?: string;
  action: string;
  category: 'payment' | 'verification' | 'mediation' | 'dispute' | 'system';
  details: Record<string, unknown>;
  timestamp: string;
}
