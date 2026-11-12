'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  Scale,
  FileText,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { AGGridTransactions } from '@/components/AGGridTransactions';
import { MilestoneTimelineViewer } from '@/components/MilestoneTimelineViewer';
import { FinancialTransaction, Milestone, Project, ActivityLog } from '@/types';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, msRes, txRes, actRes] = await Promise.all([
          fetch('/api/projects').then((r) => r.json()),
          fetch('/api/projects/proj_web_dev_3000/milestones').then((r) => r.json()),
          fetch('/api/transactions').then((r) => r.json()),
          fetch('/api/activity').then((r) => r.json()),
        ]);

        setProjects(Array.isArray(projRes) ? projRes : []);
        setMilestones(Array.isArray(msRes) ? msRes : []);
        setTransactions(Array.isArray(txRes) ? txRes : []);
        setActivityLogs(Array.isArray(actRes) ? actRes : []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalVolume = projects.reduce((acc, p) => acc + (p.total_budget || 0), 0);
  const totalCaptured = transactions
    .filter((t) => t.status === 'captured')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const openDisputesCount = 1;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Escrow & Defense Command Center</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time digital milestone fulfillment, PayPal Sandbox synchronization, and cryptographic proof ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New AI Project</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Total Contract Volume</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="text-xl font-bold text-foreground">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground">{projects.length} Active B2B Engagements</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>PayPal Captured Funds</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600">
            ${totalCaptured.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-muted-foreground">Recorded in Milestone Ledger</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Pending Verifications</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-foreground">1 Milestone</div>
          <p className="text-[11px] text-amber-600">75% Verified • Mediation Active</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Active Disputes</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600">{openDisputesCount} Dispute</div>
          <p className="text-[11px] text-rose-500">Dossier Compiled • Awaiting Review</p>
        </div>
      </div>

      {/* Workspace 1: Project Delivery & Milestones (Bryntum Gantt Interface) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Workspace 1: Project Delivery & Milestones</h2>
            <p className="text-xs text-muted-foreground">
              Powered by the Bryntum Gantt Engine Interface. Track deliverables, dates, and verification status.
            </p>
          </div>
          <Link
            href={projects[0]?.id ? `/projects/${projects[0].id}/milestones` : '/projects/proj_web_dev_3000/milestones'}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Manage Milestones →
          </Link>
        </div>

        {(Array.isArray(milestones) ? milestones : []).length > 0 ? (
          <MilestoneTimelineViewer milestones={Array.isArray(milestones) ? milestones : []} />
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            Loading timeline milestones...
          </div>
        )}
      </section>

      {/* Workspace 2: Revenue & Dispute Command Center (AG Grid React) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Workspace 2: Revenue & Dispute Command Center</h2>
            <p className="text-xs text-muted-foreground">
              Integrated AG Grid React data grid. Interactive sorting, column reordering, proof inspection, and CSV export.
            </p>
          </div>
          <Link href="/transactions" className="text-xs text-primary font-semibold hover:underline">
            View Full Ledger →
          </Link>
        </div>

        <AGGridTransactions transactions={transactions} />
      </section>

      {/* Recent Append-Only Activity Log Stream */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Tamper-Evident Activity Audit Trail</h2>
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2.5">
          {activityLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {log.category}
                </span>
                <span className="font-semibold text-foreground">{log.action.replace(/_/g, ' ')}</span>
              </div>
              <span className="text-muted-foreground font-mono text-[11px]">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
