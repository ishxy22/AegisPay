-- ==============================================================================
-- AEGISPAY PRODUCTION RELATIONAL SCHEMA MIGRATION
-- Compatible with both standard UUIDs and structured domain identifiers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'service_provider',
    organization_id TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORGANIZATION_MEMBERS
CREATE TABLE IF NOT EXISTS organization_members (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    organization_id TEXT,
    profile_id TEXT,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    client_id TEXT,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    provider_id TEXT,
    provider_name TEXT NOT NULL,
    provider_email TEXT NOT NULL,
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    deadline TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active',
    milestone_count INT DEFAULT 0,
    completed_milestones INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECT_MEMBERS
CREATE TABLE IF NOT EXISTS project_members (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT,
    profile_id TEXT,
    role TEXT NOT NULL DEFAULT 'collaborator',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables JSONB DEFAULT '[]'::jsonb,
    acceptance_criteria JSONB DEFAULT '[]'::jsonb,
    expected_completion_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    allocated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    percentage_of_budget NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    dependencies JSONB DEFAULT '[]'::jsonb,
    verification_requirements JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft',
    paypal_order_id TEXT,
    paypal_capture_id TEXT,
    paypal_invoice_id TEXT,
    verified_at TIMESTAMPTZ,
    proof_receipt_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACCEPTANCE_CRITERIA
CREATE TABLE IF NOT EXISTS acceptance_criteria (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    milestone_id TEXT NOT NULL,
    description TEXT NOT NULL,
    verification_method TEXT NOT NULL DEFAULT 'automated_test',
    status TEXT NOT NULL DEFAULT 'pending',
    evidence_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DELIVERABLE_SUBMISSIONS
CREATE TABLE IF NOT EXISTS deliverable_submissions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    milestone_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    submitted_by TEXT,
    github_repo_url TEXT,
    github_pr_url TEXT,
    commit_sha TEXT,
    deployment_url TEXT,
    screenshot_urls JSONB DEFAULT '[]'::jsonb,
    document_urls JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. VERIFICATION_RUNS
CREATE TABLE IF NOT EXISTS verification_runs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    submission_id TEXT,
    milestone_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    total_criteria INT NOT NULL DEFAULT 0,
    passed_criteria INT NOT NULL DEFAULT 0,
    failed_criteria INT NOT NULL DEFAULT 0,
    partially_satisfied_criteria INT NOT NULL DEFAULT 0,
    completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    agent_confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    evidence_references JSONB DEFAULT '{}'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. VERIFICATION_RESULTS
CREATE TABLE IF NOT EXISTS verification_results (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    verification_run_id TEXT,
    criterion_id TEXT,
    status TEXT NOT NULL DEFAULT 'passed',
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    evidence_found TEXT,
    reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PROOF_OF_WORK_RECEIPTS (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS proof_of_work_receipts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    receipt_version TEXT NOT NULL DEFAULT '1.0.0',
    project_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    provider_id TEXT,
    client_id TEXT,
    commit_sha TEXT,
    pull_request_ref TEXT,
    deployment_url TEXT,
    test_results_summary TEXT,
    acceptance_criteria_results JSONB NOT NULL,
    verification_report_id TEXT,
    content_sha256 VARCHAR(64) NOT NULL,
    canonical_payload TEXT NOT NULL,
    tamper_evident BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT NOT NULL,
    milestone_id TEXT,
    client_id TEXT,
    client_name TEXT NOT NULL,
    provider_id TEXT,
    provider_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    paypal_order_id TEXT,
    paypal_capture_id TEXT,
    paypal_refund_id TEXT,
    verification_status TEXT NOT NULL DEFAULT 'unverified',
    receipt_hash VARCHAR(64),
    dispute_status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PAYPAL_ORDERS
CREATE TABLE IF NOT EXISTS paypal_orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    paypal_order_id TEXT UNIQUE NOT NULL,
    project_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL,
    intent TEXT NOT NULL DEFAULT 'CAPTURE',
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PAYPAL_INVOICES
CREATE TABLE IF NOT EXISTS paypal_invoices (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    invoice_number TEXT UNIQUE NOT NULL,
    paypal_invoice_id TEXT UNIQUE NOT NULL,
    project_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL,
    invoice_url TEXT,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. REFUNDS
CREATE TABLE IF NOT EXISTS refunds (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    paypal_refund_id TEXT UNIQUE,
    paypal_capture_id TEXT NOT NULL,
    transaction_id TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'completed',
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MEDIATION_CASES
CREATE TABLE IF NOT EXISTS mediation_cases (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    client_id TEXT,
    provider_id TEXT,
    disagreement_summary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SETTLEMENT_PROPOSALS
CREATE TABLE IF NOT EXISTS settlement_proposals (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    case_id TEXT,
    project_id TEXT NOT NULL,
    milestone_id TEXT NOT NULL,
    original_amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    verified_completion_percentage NUMERIC(5, 2) NOT NULL,
    proposed_refund_amount NUMERIC(12, 2) NOT NULL,
    proposed_retained_amount NUMERIC(12, 2) NOT NULL,
    explanation TEXT NOT NULL,
    supporting_evidence JSONB DEFAULT '[]'::jsonb,
    risks_and_limitations JSONB DEFAULT '[]'::jsonb,
    client_status TEXT NOT NULL DEFAULT 'pending',
    provider_status TEXT NOT NULL DEFAULT 'pending',
    overall_status TEXT NOT NULL DEFAULT 'draft',
    paypal_refund_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. DISPUTES
CREATE TABLE IF NOT EXISTS disputes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    paypal_dispute_id TEXT UNIQUE NOT NULL,
    project_id TEXT NOT NULL,
    milestone_id TEXT,
    transaction_id TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    dispute_reason TEXT NOT NULL,
    dispute_state TEXT NOT NULL,
    status TEXT NOT NULL,
    defense_mode TEXT NOT NULL DEFAULT 'assisted',
    evidence_dossier_id TEXT,
    evidence_dossier_hash VARCHAR(64),
    evidence_submitted_at TIMESTAMPTZ,
    paypal_response_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. DISPUTE_EVIDENCE
CREATE TABLE IF NOT EXISTS dispute_evidence (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    dispute_id TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    document_url TEXT,
    sha256_hash VARCHAR(64) NOT NULL,
    submitted_to_paypal BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. WEBHOOK_EVENTS
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    idempotency_key TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'paypal',
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. ACTIVITY_LOGS (APPEND-ONLY AUDIT LOG)
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id TEXT,
    user_id TEXT,
    action TEXT NOT NULL,
    category TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AI_AGENT_RUNS
CREATE TABLE IF NOT EXISTS ai_agent_runs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    agent_name TEXT NOT NULL,
    model_identifier TEXT NOT NULL,
    prompt_tokens INT,
    completion_tokens INT,
    latency_ms INT,
    input_payload JSONB,
    output_payload JSONB,
    status TEXT NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. INTEGRATIONS
CREATE TABLE IF NOT EXISTS integrations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    profile_id TEXT,
    provider TEXT NOT NULL,
    account_identifier TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT LOOKUPS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_disputes_project_id ON disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_receipts_sha256 ON proof_of_work_receipts(content_sha256);
CREATE INDEX IF NOT EXISTS idx_webhook_idempotency ON webhook_events(idempotency_key);
