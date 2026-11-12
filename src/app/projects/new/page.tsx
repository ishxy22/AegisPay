'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Plus, Trash2, ShieldCheck, CheckCircle2, Loader2, ArrowLeft, Mail, UserCheck } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [totalBudget, setTotalBudget] = useState(3000);
  const [currency, setCurrency] = useState('USD');
  const [deadline, setDeadline] = useState('2026-12-20');
  const [brief, setBrief] = useState('');

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check current session to prefill either client or provider
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.authenticated && data.session) {
          const user = data.session;
          if (user.role === 'service_provider') {
            setProviderName(user.fullName || 'Service Provider');
            setProviderEmail(user.email || '');
          } else if (user.role === 'client') {
            setClientName(user.fullName || 'Client Representative');
            setClientEmail(user.email || '');
          }
        }
      })
      .catch(() => {});
  }, []);

  // Quick Preset for Evaluator Benchmarking
  const handleLoadPreset = () => {
    setTitle('Full-Stack SaaS Platform Development');
    setDescription('End-to-end multi-tenant web application with billing, AI workflows, and Supabase integration.');
    setClientName('Apex Digital Ventures');
    setClientEmail('contact@apexdigital.com');
    setProviderName('ActenX Solutions (Fuzail & Ishita)');
    setProviderEmail('team@actenx.com');
    setTotalBudget(3000);
    setDeadline('2026-12-20');
    setBrief(
      'Complete modern web application with Next.js App Router, Tailwind CSS, and PayPal Checkout integration. Automated verification of code quality via GitHub PR inspection, live staging deployment healthcheck, and an administrative dispute defense dossier generation engine.'
    );
  };

  // Generate Milestones with Gemini
  const handleGenerateMilestones = async () => {
    if (!title.trim()) {
      setError('Please provide a Project Title before generating milestones');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || title,
          totalBudget,
          currency,
          deadline,
          brief: brief || title,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate milestones');
      }

      const generated = (data.milestones || []).map((m: any) => ({
        ...m,
        assignee_email: providerEmail || '',
      }));

      setMilestones(generated);
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
      assignee_email: providerEmail || '',
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
    if (!title.trim() || !clientEmail.trim() || !providerEmail.trim()) {
      setError('Please provide Project Title, Client Email, and Service Provider Email');
      return;
    }

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
          client_name: clientName || clientEmail.split('@')[0],
          client_email: clientEmail.trim(),
          provider_name: providerName || providerEmail.split('@')[0],
          provider_email: providerEmail.trim(),
          total_budget: totalBudget,
          currency,
          deadline: new Date(deadline).toISOString(),
        }),
      });

      const project = await projRes.json();
      if (!projRes.ok) throw new Error(project.error || 'Failed to save project');

      // 2. Save Milestones
      if (milestones.length > 0) {
        const milestonesToSave = milestones.map((m) => ({
          ...m,
          assignee_email: m.assignee_email || providerEmail.trim(),
        }));

        await fetch(`/api/projects/${project.id}/milestones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestonesToSave),
        });
      }

      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to confirm project');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
        <button
          type="button"
          onClick={handleLoadPreset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary transition-colors shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>⚡ Auto-Fill Benchmark Example</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Protected Project & Assign Tasks</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Engine A: Smart Milestone Engine. Convert natural-language project briefs into verifiable payment milestones assigned to any client and contractor email.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Project Metadata Form */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span>1. Project Information & Commercial Parties</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground">Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mobile App Backend & GraphQL API"
              required
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="font-semibold text-foreground">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Microservice backend architecture with real-time push notifications"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Client Details (Any Email) */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-xs text-primary">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Client / Buyer Representative</span>
            </span>
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground text-[11px]">Client Company / Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground outline-none text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground text-[11px]">Client Email *</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="e.g. procurement@acme.com"
                required
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground outline-none text-xs font-mono"
              />
            </div>
          </div>

          {/* Service Provider / Developer Details (Any Email) */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-xs text-primary">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Service Provider / Agency Lead</span>
            </span>
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground text-[11px]">Provider Company / Name</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. CloudTech Solutions"
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground outline-none text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground text-[11px]">Provider Work Email *</label>
              <input
                type="email"
                value={providerEmail}
                onChange={(e) => setProviderEmail(e.target.value)}
                placeholder="e.g. lead@cloudtech.dev"
                required
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground outline-none text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Total Budget (${currency}) *</label>
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
            Plain-English Project Scope & Deliverable Brief (Used by Gemini AI to synthesize milestones)
          </label>
          <textarea
            rows={4}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Paste contract specs, client requirements, or statement of work..."
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerateMilestones}
            disabled={generating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Generate Milestones with Gemini AI</span>
          </button>
          <button
            type="button"
            onClick={handleAddMilestone}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Manual Milestone</span>
          </button>
        </div>
      </div>

      {/* Step 2: Milestone Review & Task Email Assignment */}
      {milestones.length > 0 && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">2. Structured Milestones & Assignee Delegation</h2>
              <p className="text-xs text-muted-foreground">
                Assign each milestone to any specific developer or team member email. Acceptance criteria determine escrow release.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Another Milestone</span>
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
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Escrow Amount ($)</span>
                      <input
                        type="number"
                        value={ms.allocated_amount}
                        onChange={(e) => {
                          const copy = [...milestones];
                          copy[idx].allocated_amount = Number(e.target.value);
                          copy[idx].percentage_of_budget = Math.round((Number(e.target.value) / (totalBudget || 1)) * 100);
                          setMilestones(copy);
                        }}
                        className="w-24 text-right font-bold text-sm text-foreground bg-muted p-1.5 rounded border border-border text-xs outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(idx)}
                      className="p-1.5 text-muted-foreground hover:text-rose-500 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Milestone Specific Assignee Email Field */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/60 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-muted-foreground shrink-0 text-[11px]">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>Assignee Work Email:</span>
                  </div>
                  <input
                    type="email"
                    value={ms.assignee_email || ''}
                    placeholder="Enter assignee email (e.g. contractor@studio.com)"
                    onChange={(e) => {
                      const copy = [...milestones];
                      copy[idx].assignee_email = e.target.value;
                      setMilestones(copy);
                    }}
                    className="p-1.5 rounded border border-border bg-background text-foreground text-xs flex-1 font-mono outline-none"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {ms.assignee_email ? 'Assigned' : 'Defaults to project provider'}
                  </span>
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
              type="button"
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
