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
  Plus,
  Mail,
  Loader2,
  X,
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

  // New task modal / inline drawer state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAmount, setNewTaskAmount] = useState(500);
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-12-15');
  const [newTaskCriteria, setNewTaskCriteria] = useState('Automated test suite passing and merged PR');
  const [submittingTask, setSubmittingTask] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const [pRes, mRes] = await Promise.all([
          fetch(`/api/projects/${id}`).then((r) => r.json()),
          fetch(`/api/projects/${id}/milestones`).then((r) => r.json()),
        ]);
        setProject(pRes);
        setMilestones(Array.isArray(mRes) ? mRes : []);
        if (pRes?.provider_email) {
          setNewTaskAssignee(pRes.provider_email);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProjectData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setTaskError('Task title is required');
      return;
    }
    setSubmittingTask(true);
    setTaskError(null);

    try {
      const newMilestonePayload = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || newTaskTitle.trim(),
        allocated_amount: Number(newTaskAmount) || 500,
        percentage_of_budget: project?.total_budget ? Math.round((Number(newTaskAmount) / project.total_budget) * 100) : 25,
        expected_completion_date: new Date(newTaskDeadline).toISOString(),
        assignee_email: newTaskAssignee.trim() || project?.provider_email || '',
        deliverables: [
          newTaskAssignee.trim() ? `Assignee: ${newTaskAssignee.trim()}` : `Assignee: ${project?.provider_email || 'Unassigned'}`,
          newTaskTitle.trim(),
        ],
        acceptance_criteria: [
          {
            id: `crit_${Date.now()}`,
            description: newTaskCriteria.trim() || 'Verified milestone deliverable',
            verification_method: 'automated_test',
            status: 'pending',
          },
        ],
        verification_requirements: ['GitHub Pull Request', 'CI/CD Pass'],
        status: 'draft',
      };

      const res = await fetch(`/api/projects/${id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMilestonePayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add task');
      }

      const added = Array.isArray(data) ? data : [data];
      setMilestones((prev) => [...prev, ...added]);
      setIsAddingTask(false);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAmount(500);
    } catch (err: any) {
      setTaskError(err.message || 'Failed to save task');
    } finally {
      setSubmittingTask(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-muted-foreground">Loading project details...</div>;
  }

  if (!project) {
    return <div className="p-8 text-center text-xs text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task / Milestone</span>
          </button>
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
          <p className="text-[11px] text-muted-foreground font-mono">{project.client_email}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-muted-foreground text-[11px] uppercase font-semibold">Service Provider Lead</span>
          <div className="text-sm font-bold text-foreground">{project.provider_name}</div>
          <p className="text-[11px] text-muted-foreground font-mono">{project.provider_email}</p>
        </div>
      </div>

      {/* Inline New Task / Milestone Modal Drawer */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="p-5 rounded-xl border border-primary/30 bg-card shadow-md space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Assign New Milestone or Task to Any Email</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {taskError && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs">
              {taskError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-foreground">Milestone / Task Title *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Implement Webhook Handlers & Retries"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-foreground">Scope / Description</label>
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="e.g. Robust event listener with cryptographic signature verification and idempotent processing"
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Assignee Work Email *</label>
              <input
                type="email"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                placeholder="e.g. any_contractor@example.com"
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none font-mono"
              />
              <span className="text-[10px] text-muted-foreground">Assign directly to any contractor, freelancer, or team email</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Escrow Amount ($ USD) *</label>
              <input
                type="number"
                value={newTaskAmount}
                onChange={(e) => setNewTaskAmount(Number(e.target.value))}
                required
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Target Completion Date</label>
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Verification Criterion</label>
              <input
                type="text"
                value={newTaskCriteria}
                onChange={(e) => setNewTaskCriteria(e.target.value)}
                placeholder="e.g. Passing Jest test suite and staging deploy"
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTask}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs disabled:opacity-50"
            >
              {submittingTask ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              <span>Save & Register in Escrow</span>
            </button>
          </div>
        </form>
      )}

      {/* Bryntum Gantt Timeline */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Milestone Delivery Schedule</h2>
        <MilestoneTimelineViewer milestones={Array.isArray(milestones) ? milestones : []} />
      </section>

      {/* Milestones Action Grid with PayPal Sandbox Checkout */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Milestones & Payment Ledger</h2>
          <button
            type="button"
            onClick={() => setIsAddingTask(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="space-y-4">
          {(Array.isArray(milestones) ? milestones : []).map((ms, index) => {
            const isPaid = ms.status === 'payment_captured' || ms.status === 'completed' || ms.status === 'verified';
            const isPaymentRequested = ms.status === 'payment_requested' || ms.status === 'draft';
            const assignee = ms.assignee_email || (Array.isArray(ms.deliverables) && ms.deliverables.find(d => d.startsWith('Assignee: '))?.replace('Assignee: ', '')) || project.provider_email;

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

                      {/* Dynamic Task Assignee Email */}
                      {assignee && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground mt-2 bg-muted/40 px-2.5 py-0.5 rounded-md w-fit border border-border/50">
                          <Mail className="h-3 w-3 text-primary" />
                          <span>Assignee: <strong className="text-foreground">{assignee}</strong></span>
                        </div>
                      )}
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
