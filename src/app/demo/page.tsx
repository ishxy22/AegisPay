'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  FileText,
  CreditCard,
  Scale,
  ShieldAlert,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  engine: 'Engine A' | 'Engine B' | 'Engine C' | 'Engine D' | 'System';
  desc: string;
  actionLabel: string;
  status: 'pending' | 'running' | 'completed';
}

const initialSteps: Step[] = [
  { id: 1, title: 'Input Plain-English Brief', engine: 'Engine A', desc: 'Create $3,000 Website Development project with client & provider details.', actionLabel: 'Load Project Brief', status: 'completed' },
  { id: 2, title: 'AI Milestone Breakdown', engine: 'Engine A', desc: 'Gemini 2.5 Flash breaks brief into 3 milestones: UI/UX ($750), Frontend ($1,250), Backend ($1,000).', actionLabel: 'Generate AI Milestones', status: 'completed' },
  { id: 3, title: 'Review & Confirm Milestones', engine: 'Engine A', desc: 'Confirm budget allocations and acceptance criteria in escrow ledger.', actionLabel: 'Confirm Plan', status: 'completed' },
  { id: 4, title: 'Create PayPal Sandbox Order', engine: 'Engine A', desc: 'Generate PayPal order for Milestone 1 (UI/UX Architecture - $750).', actionLabel: 'Create PayPal Order', status: 'completed' },
  { id: 5, title: 'Capture Sandbox Payment', engine: 'Engine A', desc: 'Execute PayPal capture and record funds in milestone ledger.', actionLabel: 'Capture Payment', status: 'completed' },
  { id: 6, title: 'Submit Digital Deliverables', engine: 'Engine B', desc: 'Submit GitHub PR #14, commit 7b4cf2, and staging URL for Milestone 2.', actionLabel: 'Submit Artifacts', status: 'completed' },
  { id: 7, title: 'Run Fulfillment Inspector', engine: 'Engine B', desc: 'Automated healthchecks and GitHub diff analysis probe acceptance criteria.', actionLabel: 'Run Inspector', status: 'completed' },
  { id: 8, title: 'Issue SHA-256 Proof Receipt', engine: 'Engine B', desc: 'Canonicalize deliverable record and stamp with cryptographic SHA-256 seal.', actionLabel: 'Generate Receipt', status: 'completed' },
  { id: 9, title: 'Detect Partial Fulfillment', engine: 'Engine B', desc: 'Inspector reports 75% completion (2 mobile viewport tests require remediation).', actionLabel: 'Flag Discrepancy', status: 'completed' },
  { id: 10, title: 'AI Mediation Proposal', engine: 'Engine C', desc: 'Groq Llama 3 calculates fair compromise: $250 partial refund to client, $1,000 retained by dev.', actionLabel: 'Formulate Proposal', status: 'completed' },
  { id: 11, title: 'Mutual Party Acceptance', engine: 'Engine C', desc: 'Both NovaTech (Client) and ActenX (Developer) accept the compromise terms.', actionLabel: 'Sign Settlement', status: 'completed' },
  { id: 12, title: 'Execute Sandbox Refund', engine: 'Engine C', desc: 'Authorized $250 refund executed via PayPal Refund API and logged.', actionLabel: 'Process Refund', status: 'completed' },
  { id: 13, title: 'Trigger Dispute Webhook', engine: 'Engine D', desc: 'Receive PayPal dispute notification (PP-D-88219402) for incomplete criteria.', actionLabel: 'Simulate Dispute', status: 'completed' },
  { id: 14, title: 'Retrieve Dispute Details', engine: 'Engine D', desc: 'Query PayPal Customer Disputes API for case claims and buyer evidence.', actionLabel: 'Fetch Case Claims', status: 'completed' },
  { id: 15, title: 'Compile Evidence Dossier', engine: 'Engine D', desc: 'Generate branded vector PDF dossier with git commits, live checks, and SHA-256 seal.', actionLabel: 'Compile PDF Dossier', status: 'completed' },
  { id: 16, title: 'Submit Evidence to PayPal', engine: 'Engine D', desc: 'Transmit fulfillment dossier through PayPal Disputes API evidence endpoint.', actionLabel: 'Transmit Evidence', status: 'completed' },
  { id: 17, title: 'Synchronize Dispute Status', engine: 'Engine D', desc: 'Update case to "Evidence Submitted / Awaiting Adjudication" (Never falsely claimed as won).', actionLabel: 'Verify Status', status: 'completed' },
];

export default function DemoTourPage() {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [activeStep, setActiveStep] = useState<number>(15);
  const [runningAll, setRunningAll] = useState(false);

  const handleResetDemo = async () => {
    await fetch('/api/demo/reset', { method: 'POST' });
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
              17-STEP VERIFICATION BENCHMARK
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Interactive Demonstration Runner</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Step-by-step walkthrough of the $3,000 Website Development payment protection lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Scenario</span>
          </button>

          <a
            href="/api/dossier/disp_sandbox_8821"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>View Dossier PDF</span>
          </a>
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <Link
          href="/dashboard"
          className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-center transition-all"
        >
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Workspace 1 & 2</span>
          <span className="font-bold text-foreground">Live Dashboard</span>
        </Link>
        <Link
          href="/projects/proj_web_dev_3000/verification"
          className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-center transition-all"
        >
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Engine B</span>
          <span className="font-bold text-emerald-600">Fulfillment Inspector</span>
        </Link>
        <Link
          href="/mediation"
          className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-center transition-all"
        >
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Engine C</span>
          <span className="font-bold text-amber-600">Mediation Center</span>
        </Link>
        <Link
          href="/defense"
          className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-center transition-all"
        >
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Engine D</span>
          <span className="font-bold text-rose-600">Dispute Defense</span>
        </Link>
      </div>

      {/* 17 Stepper */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Demonstration Sequence Timeline</h2>
        <div className="space-y-2.5">
          {steps.map((s) => {
            let engineColor = 'bg-blue-500/10 text-blue-600';
            if (s.engine === 'Engine B') engineColor = 'bg-emerald-500/10 text-emerald-600';
            if (s.engine === 'Engine C') engineColor = 'bg-amber-500/10 text-amber-600';
            if (s.engine === 'Engine D') engineColor = 'bg-rose-500/10 text-rose-600';

            return (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">
                        Step {s.id}: {s.title}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${engineColor}`}>
                        {s.engine}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pl-10 sm:pl-0">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

