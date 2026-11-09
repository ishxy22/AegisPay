'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Send } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Generate Verifiable Milestones',
      desc: 'Paste a project brief. Gemini 2.5 breaks the scope into 3+ structured milestones with deliverables, acceptance criteria, and funding allocations.',
    },
    {
      step: '02',
      title: 'Fund with PayPal Sandbox',
      desc: 'The client approves the milestone and authorizes payment through official PayPal Checkout. Funds are recorded in the internal escrow allocation ledger.',
    },
    {
      step: '03',
      title: 'Submit Digital Deliverables',
      desc: 'The developer submits GitHub PRs, commit SHAs, live staging URLs, and screenshots for automated inspection.',
    },
    {
      step: '04',
      title: 'AI Verification & Cryptographic Proof',
      desc: 'The inspector tests artifacts against agreed criteria, computes completion %, and seals the verification in an append-only SHA-256 Proof-of-Work receipt.',
    },
    {
      step: '05',
      title: 'Mediation & Autonomous Dispute Defense',
      desc: 'If discrepancies arise, AI mediation proposes compromise settlements. If a PayPal chargeback occurs, AegisPay compiles and transmits a verified PDF dossier.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">How AegisPay Works</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          From natural-language project planning to automated chargeback defense in five clear stages.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.step} className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base">
              {s.step}
            </span>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">{s.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md transition-colors"
        >
          <span>Try Interactive Demonstration</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
