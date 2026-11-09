'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderGit2, Plus, ArrowRight, ShieldCheck, Calendar, DollarSign } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        setProjects(data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Protected Projects</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage digital service agreements, smart milestone allocations, and delivery verification.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New AI Project</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4 hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                <StatusBadge status={p.status} />
              </div>
              <h2 className="text-base font-bold text-foreground">{p.title}</h2>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Client</span>
                  <span className="font-medium text-foreground">{p.client_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Service Provider</span>
                  <span className="font-medium text-foreground">{p.provider_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Budget</span>
                  <span className="font-bold text-foreground">
                    ${p.total_budget.toLocaleString()} {p.currency}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Target Deadline</span>
                  <span className="font-medium text-foreground">
                    {new Date(p.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <Link
                  href={`/projects/${p.id}`}
                  className="font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  <span>Project Overview</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/projects/${p.id}/verification`}
                  className="text-muted-foreground hover:text-foreground font-medium"
                >
                  Verify Deliverables →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
