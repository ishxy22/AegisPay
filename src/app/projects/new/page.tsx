'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Milestone } from '@/types';

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('Full-Stack SaaS Platform Development');
  const [description, setDescription] = useState(
    'End-to-end multi-tenant web application with billing, AI workflows, and Supabase integration.'
  );
  const [clientName, setClientName] = useState('Apex Digital Ventures');
  const [clientEmail, setClientEmail] = useState('contact@apexdigital.com');
  const [providerName, setProviderName] = useState('ActenX Solutions (Fuzail & Ishita)');
  const [providerEmail, setProviderEmail] = useState('team@actenx.com');
  const [totalBudget, setTotalBudget] = useState(3000);
  const [currency, setCurrency] = useState('USD');
  const [deadline, setDeadline] = useState('2026-12-20');
  const [brief, setBrief] = useState(
    'We need a complete modern web application built with Next.js App Router, Tailwind CSS, and PayPal Checkout integration. The system must include responsive navigation, automated verification of code quality via GitHub PR inspection, live staging deployment healthcheck, and an administrative dispute defense dossier generation engine.'
  );

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Generate Milestones with Gemini
  const handleGenerateMilestones = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          totalBudget,
          currency,
          deadline,
          brief,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate milestones');
      }

      setMilestones(data.milestones || []);
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  // Add custom milestone
  const handleAddMilestone = () => {
    const newMs = {
      title: 'New Custom Milestone',
      description: 'Describe deliverable requirements...',
      deliverables: ['Custom Deliverable 1'],
      acceptance_criteria: [
        {
          id: `crit_${Date.now()}`,
          description: 'Custom acceptance criterion',
          verification_method: 'automated_test',
          status: 'pending',
        },
      ],
      expected_completion_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      allocated_amount: 500,
      percentage_of_budget: Math.round((500 / totalBudget) * 100),
      dependencies: [],
      verification_requirements: ['GitHub Pull Request'],
      status: 'draft',
    };
    setMilestones([...milestones, newMs]);
  };

  // Delete milestone
  const handleDeleteMilestone = (index: number) => {
    const copy = [...milestones];
    copy.splice(index, 1);
    setMilestones(copy);
  };

  // Confirm & Save Project
  const handleConfirmProject = async () => {
    setSaving(true);
    setError(null);

    try {
      // 1. Create Project
      const projRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          client_name: clientName,
          client_email: clientEmail,
          provider_name: providerName,
          provider_email: providerEmail,
          total_budget: totalBudget,
          currency,
          deadline: new Date(deadline).toISOString(),
        }),
      });

      const project = await projRes.json();
      if (!projRes.ok) throw new Error(project.error || 'Failed to save project');

      // 2. Save Milestones
      if (milestones.length > 0) {
        await fetch(`/api/projects/${project.id}/milestones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestones),
        });
      }

      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm project');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Protected Project</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Engine A: Smart Milestone Engine. Convert natural-language project briefs into verifiable payment milestones.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs">
          {error}
        </div>
      )}

      {/* Step 1: Project Metadata Form */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span>1. Project Information & Commercial Terms</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Client Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Total Budget (${currency})</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Target Completion Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Natural Language Brief Area */}
        <div className="space-y-2 pt-2">
          <label className="font-semibold text-foreground text-xs block">
            Plain-English Project Scope & Deliverable Brief
          </label>
          <textarea
            rows={4}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Paste raw requirements, client emails, or project scope..."
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleGenerateMilestones}
          disabled={generating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>Generate Milestones with Gemini AI</span>
        </button>
      </div>

      {/* Step 2: Milestone Review & Customization */}
      {milestones.length > 0 && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">2. Review & Edit Structured Milestones</h2>
              <p className="text-xs text-muted-foreground">
                AI milestones are fully editable. Add deliverables, adjust funding allocations, and configure acceptance criteria.
              </p>
            </div>
            <button
              onClick={handleAddMilestone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {milestones.map((ms, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={ms.title}
                        onChange={(e) => {
                          const copy = [...milestones];
                          copy[idx].title = e.target.value;
                          setMilestones(copy);
                        }}
                        className="font-bold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none flex-1"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={ms.description}
                      onChange={(e) => {
                        const copy = [...milestones];
                        copy[idx].description = e.target.value;
                        setMilestones(copy);
                      }}
                      className="w-full text-xs text-muted-foreground bg-transparent border rounded p-2 border-border/50 focus:border-primary outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Amount ($)</span>
                      <input
                        type="number"
                        value={ms.allocated_amount}
                        onChange={(e) => {
                          const copy = [...milestones];
                          copy[idx].allocated_amount = Number(e.target.value);
                          copy[idx].percentage_of_budget = Math.round((Number(e.target.value) / totalBudget) * 100);
                          setMilestones(copy);
                        }}
                        className="w-24 text-right font-bold text-sm text-foreground bg-muted p-1.5 rounded border border-border text-xs outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteMilestone(idx)}
                      className="p-1.5 text-muted-foreground hover:text-rose-500 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Acceptance Criteria Chips */}
                <div className="pt-2 border-t border-border/50">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-2">
                    Acceptance Criteria & Verification Methods:
                  </span>
                  <div className="space-y-2">
                    {ms.acceptance_criteria?.map((crit: any, cIdx: number) => (
                      <div
                        key={cIdx}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50 text-xs"
                      >
                        <span className="text-foreground">{crit.description}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {crit.verification_method?.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleConfirmProject}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              <span>Confirm Project & Activate Escrow Ledger</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
