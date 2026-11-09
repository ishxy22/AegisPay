'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Loader2,
  FileText,
} from 'lucide-react';
import { MediationProposal } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

export default function MediationPage() {
  const [proposals, setProposals] = useState<MediationProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      const res = await fetch('/api/ai/mediate');
      const data = await res.json();
      setProposals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleAcceptProposal = async (proposalId: string, role: 'client' | 'service_provider') => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/ai/mediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          proposalId,
          userRole: role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to accept proposal');

      setMessage(
        role === 'client'
          ? 'Client accepted settlement! Mutual agreement reached — PayPal Sandbox refund executed.'
          : 'Service Provider accepted settlement proposal.'
      );
      await fetchProposals();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Commercial Mediation Center</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Engine C: Proactive dispute prevention. Evaluates partial fulfillment and formulates equitable settlement compromises.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading active mediation cases...</div>
      ) : proposals.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
          No active mediation cases at this time.
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((prop) => {
            const isAgreed = prop.overall_status === 'agreed' || prop.overall_status === 'settled_with_refund';

            return (
              <div key={prop.id} className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Settlement Compromise Proposal: {prop.milestone_id}
                      </h2>
                      <span className="font-mono text-[11px] text-muted-foreground">Case ID: {prop.case_id}</span>
                    </div>
                  </div>
                  <StatusBadge status={prop.overall_status} />
                </div>

                {/* Financial Compromise Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                      Original Milestone Value
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      ${prop.original_amount} {prop.currency}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      Verified: {prop.verified_completion_percentage}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-600 uppercase font-semibold block">
                      Retained by Developer
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      ${prop.proposed_retained_amount} {prop.currency}
                    </span>
                    <span className="block text-[10px] text-emerald-600/80 mt-0.5">For Verified Code & Assets</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[10px] text-blue-600 uppercase font-semibold block">
                      Partial Refund to Client
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      ${prop.proposed_refund_amount} {prop.currency}
                    </span>
                    <span className="block text-[10px] text-blue-600/80 mt-0.5">Remediation Adjustment</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-2">
                  <span className="font-bold text-foreground block">AI Mediation Rationale & Justification:</span>
                  <p className="text-muted-foreground leading-relaxed">{prop.explanation}</p>
                </div>

                {/* Supporting Evidence & Limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-semibold text-foreground block">Verified Supporting Evidence:</span>
                    <ul className="space-y-1 text-muted-foreground">
                      {prop.supporting_evidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-foreground block">Terms & Limitations:</span>
                    <ul className="space-y-1 text-muted-foreground">
                      {prop.risks_and_limitations.map((risk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Authorization & Party Status */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Client Status</span>
                      <StatusBadge status={prop.client_status} />
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Provider Status</span>
                      <StatusBadge status={prop.provider_status} />
                    </div>
                  </div>

                  {/* Actions */}
                  {!isAgreed && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptProposal(prop.id, 'service_provider')}
                        disabled={actionLoading || prop.provider_status === 'accepted'}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors disabled:opacity-50"
                      >
                        {prop.provider_status === 'accepted' ? 'Developer Accepted' : 'Accept as Developer'}
                      </button>

                      <button
                        onClick={() => handleAcceptProposal(prop.id, 'client')}
                        disabled={actionLoading || prop.client_status === 'accepted'}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : prop.client_status === 'accepted' ? (
                          'Client Accepted'
                        ) : (
                          'Accept & Execute Refund as Client'
                        )}
                      </button>
                    </div>
                  )}

                  {isAgreed && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Mutual Settlement Executed • PayPal Refund {prop.paypal_refund_id || 'Confirmed'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
