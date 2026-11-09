'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Hash, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Security & Evidence Integrity</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Cryptographic guarantees, append-only persistence, and strict PayPal compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Hash className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Canonical SHA-256 Hashing</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            All proof-of-work receipts are canonicalized (keys sorted recursively) and hashed with SHA-256. Any modification to deliverable metadata or timestamps invalidates the hash.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <Lock className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Append-Only Event Ledger</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Verification runs, receipts, and transactions are stored append-only in PostgreSQL with Supabase Row Level Security (RLS). Updates generate versioned iterations rather than mutations.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Deterministic Guardrails</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            AI is never permitted to move money autonomously or fabricate test results. All PayPal order captures and refunds require explicit human authorization.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="text-base font-bold text-foreground">Cryptographic Webhook Verification</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Incoming PayPal webhook notifications are verified against PayPal's public certificate and verification endpoint to prevent spoofing or replay attacks.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-colors"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
