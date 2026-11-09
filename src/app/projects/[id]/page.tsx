'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Project, Milestone } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { MilestoneTimelineViewer } from '@/components/MilestoneTimelineViewer';
import { PayPalButtonWrapper } from '@/components/PayPalButtonWrapper';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingMilestoneId, setPayingMilestoneId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const [pRes, mRes] = await Promise.all([
          fetch(`/api/projects/${id}`).then((r) => r.json()),
          fetch(`/api/projects/${id}/milestones`).then((r) => r.json()),
        ]);
        setProject(pRes);
        setMilestones(Array.isArray(mRes) ? mRes : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProjectData();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-muted-foreground">Loading project details...</div>;
  }

  if (!project) {
    return <div className="p-8 text-center text-xs text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-muted-foreground">{project.id}</span>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{project.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.id}/verification`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Verify Deliverables</span>
          </Link>
        </div>
      </div>

      {/* Commercial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase font-semibold">Total Escrow Budget</span>
          <div className="text-xl font-bold text-foreground">
            ${project.total_budget.toLocaleString()} {project.currency}
          </div>
          <p className="text-[11px] text-muted-foreground">{(Array.isArray(milestones) ? milestones : []).length} Structured Milestones</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase font-semibold">Client Representative</span>
          <div className="text-sm font-bold text-foreground">{project.client_name}</div>
          <p className="text-[11px] text-muted-foreground">{project.client_email}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase font-semibold">Service Provider</span>
          <div className="text-sm font-bold text-foreground">{project.provider_name}</div>
          <p className="text-[11px] text-muted-foreground">{project.provider_email}</p>
        </div>
      </div>

      {/* Bryntum Gantt Timeline */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Milestone Delivery Schedule</h2>
        <MilestoneTimelineViewer milestones={Array.isArray(milestones) ? milestones : []} />
      </section>

      {/* Milestones Action Grid with PayPal Sandbox Checkout */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Milestones & Payment Ledger</h2>
        <div className="space-y-4">
          {(Array.isArray(milestones) ? milestones : []).map((ms, index) => {
            const isPaid = ms.status === 'payment_captured' || ms.status === 'completed' || ms.status === 'verified';
            const isPaymentRequested = ms.status === 'payment_requested' || ms.status === 'draft';

            return (
              <div key={ms.id} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-foreground">{ms.title}</h3>
                        <StatusBadge status={ms.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{ms.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-10 md:pl-0">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Allocation</span>
                      <span className="font-bold text-foreground">${ms.allocated_amount} USD</span>
                    </div>

                    {/* PayPal Payment Action */}
                    {isPaymentRequested && (
                      <button
                        onClick={() => setPayingMilestoneId(payingMilestoneId === ms.id ? null : ms.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0070BA] hover:bg-[#005ea6] text-white shadow-sm transition-colors"
                      >
                        {payingMilestoneId === ms.id ? 'Close Checkout' : 'Pay with PayPal'}
                      </button>
                    )}

                    {isPaid && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Funds Captured</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline PayPal Checkout Drawer */}
                {payingMilestoneId === ms.id && (
                  <div className="p-4 rounded-lg bg-muted/40 border border-border animate-in fade-in-50">
                    <h4 className="text-xs font-bold text-foreground mb-2">
                      Authorize Payment for Milestone {index + 1}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Payment is processed through the official PayPal Developer Sandbox API. Funds are captured and
                      recorded in the AegisPay append-only ledger.
                    </p>
                    <PayPalButtonWrapper
                      milestoneId={ms.id}
                      amount={ms.allocated_amount}
                      onSuccess={() => {
                        setPayingMilestoneId(null);
                        window.location.reload();
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
