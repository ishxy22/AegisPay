'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Scale, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">AegisPay Core Capabilities</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Comprehensive payment protection and chargeback defense engineered for digital freelancers, agencies, and SaaS clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-primary">
            <Zap className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Smart Milestone Engine (Gemini 2.5)</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Deconstructs plain-English briefs into structured deliverables and acceptance criteria. Integrates with PayPal Checkout orders and maintains an internal funds allocation ledger.
          </p>
          <ul className="text-xs space-y-1.5 text-muted-foreground pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Editable AI milestone generation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Official PayPal Sandbox checkout approval</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Digital Fulfillment Inspector</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Verifies GitHub repositories, PRs, commit SHAs, and live staging URLs. Issues canonical SHA-256 Proof-of-Work receipts stored append-only in PostgreSQL.
          </p>
          <ul className="text-xs space-y-1.5 text-muted-foreground pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Deterministic code & test inspection</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Cryptographic Proof-of-Work receipt seal</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-amber-600">
            <Scale className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">AI Mediation Engine (Groq Llama 3)</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Calculates proportional value compromises when milestone verification is partial, allowing both parties to negotiate and execute authorized PayPal refunds before formal arbitration.
          </p>
          <ul className="text-xs space-y-1.5 text-muted-foreground pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Proactive pre-dispute resolution</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Authorized PayPal Sandbox refund triggers</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-rose-600">
            <FileText className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Autonomous Dispute Defense Engine</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Detects PayPal dispute webhooks, compares evidence against dispute categories, compiles branded vector PDF dossiers, and transmits evidence through PayPal Customer Disputes API.
          </p>
          <ul className="text-xs space-y-1.5 text-muted-foreground pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Branded vector PDF dossier compiler</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Dual Assisted & Autonomous defense modes</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-colors"
        >
          <span>Explore Live Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
