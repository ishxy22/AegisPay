'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Lock,
  GitPullRequest,
  CheckCircle2,
  FileText,
  Scale,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Zap className="h-3.5 w-3.5" />
          <span>Next-Generation B2B Digital Commerce Protection</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Every payment should have proof.{' '}
          <span className="text-primary block sm:inline">Every deliverable should have protection.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Physical commerce has tracking numbers and delivery signatures. Digital work has code commits,
          pull requests, and live deployment tests. AegisPay converts these digital artifacts into structured,
          timestamped, and tamper-evident fulfillment records.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-all group"
          >
            <span>Launch Live Sandbox Demo</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/projects/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all"
          >
            <span>Plan Project with AI</span>
          </Link>
        </div>

        {/* Live Metrics Proof Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/60 max-w-3xl mx-auto">
          <div className="p-3 text-center">
            <span className="text-2xl font-bold text-foreground">100%</span>
            <span className="block text-xs text-muted-foreground mt-0.5">Deterministic Verification</span>
          </div>
          <div className="p-3 text-center">
            <span className="text-2xl font-bold text-foreground">SHA-256</span>
            <span className="block text-xs text-muted-foreground mt-0.5">Cryptographic Seals</span>
          </div>
          <div className="p-3 text-center">
            <span className="text-2xl font-bold text-foreground">&lt; 15s</span>
            <span className="block text-xs text-muted-foreground mt-0.5">Dossier PDF Generation</span>
          </div>
          <div className="p-3 text-center">
            <span className="text-2xl font-bold text-emerald-600">PayPal</span>
            <span className="block text-xs text-muted-foreground mt-0.5">Sandbox Integration</span>
          </div>
        </div>
      </section>

      {/* The 4 Connected Engines */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Four Connected Intelligent Engines</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Autonomous protection guarding the entire digital services lifecycle from scope to arbitration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engine A */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 font-bold">
                A
              </div>
              <span className="text-xs font-mono uppercase text-muted-foreground">Smart Milestone Engine</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">AI Project Breakdown & PayPal Allocation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transforms natural-language briefs into structured, editable milestone plans with deliverables,
              acceptance criteria, and PayPal order synchronization. Funds are tracked in an internal allocation ledger.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-primary">
              <Link href="/projects/new" className="flex items-center gap-1 hover:underline">
                <span>Create AI Milestone Plan</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Engine B */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                B
              </div>
              <span className="text-xs font-mono uppercase text-muted-foreground">Digital Fulfillment Inspector</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">Multimodal Inspection & Cryptographic Proof</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspects GitHub PRs, commits, live endpoints, and screenshots using Gemini 2.5 Vision.
              Generates canonical SHA-256 Proof-of-Work receipts stored append-only in PostgreSQL.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-emerald-600">
              <Link href="/projects/proj_web_dev_3000/verification" className="flex items-center gap-1 hover:underline">
                <span>Inspect Deliverables</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Engine C */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 font-bold">
                C
              </div>
              <span className="text-xs font-mono uppercase text-muted-foreground">AI Mediation Engine</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">Pre-Dispute Compromise & Mutual Settlement</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Resolves disagreements before formal payment disputes. Evaluates partial fulfillment and calculates
              equitable settlement proposals with counteroffers and authorized PayPal refund triggers.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-amber-600">
              <Link href="/mediation" className="flex items-center gap-1 hover:underline">
                <span>Open Mediation Center</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Engine D */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 font-bold">
                D
              </div>
              <span className="text-xs font-mono uppercase text-muted-foreground">Autonomous Dispute Defense</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">PayPal Webhooks & Evidence Dossier Compiler</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Receives verified PayPal dispute webhooks, compares evidence against dispute reasons, generates
              tamper-evident PDF dossiers, and submits evidence through the PayPal Customer Disputes API.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-rose-600">
              <Link href="/defense" className="flex items-center gap-1 hover:underline">
                <span>Access Defense Center</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Dossier Callout */}
      <section className="p-8 rounded-2xl bg-sidebar-bg text-sidebar-fg border border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
            Verifiable Digital Evidence
          </span>
          <h3 className="text-2xl font-bold text-white">Generate Branded Evidence Dossier PDF</h3>
          <p className="text-xs text-sidebar-muted max-w-lg leading-relaxed">
            Download our tamper-evident, cryptographically sealed evidence dossier compiled for the $3,000
            Website Development benchmark dispute.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <a
            href="/api/dossier/disp_sandbox_8821"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Download Sample PDF Dossier</span>
          </a>
        </div>
      </section>
    </div>
  );
}
