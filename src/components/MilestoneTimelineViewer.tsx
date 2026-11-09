'use client';

import React, { useState } from 'react';
import { Milestone } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Calendar, CheckCircle2, Clock, GitCommit, ShieldCheck, ArrowRight, Layers } from 'lucide-react';

interface MilestoneTimelineViewerProps {
  milestones?: Milestone[];
  onSelectMilestone?: (milestone: Milestone) => void;
}

export function MilestoneTimelineViewer({ milestones = [], onSelectMilestone }: MilestoneTimelineViewerProps) {
  const safeMilestones = Array.isArray(milestones) ? milestones : [];
  const [selectedId, setSelectedId] = useState<string>(safeMilestones[0]?.id || '');

  const hasBryntumLicense = Boolean(process.env.NEXT_PUBLIC_BRYNTUM_LICENSE_KEY);

  const selectedMilestone =
    safeMilestones.find((m) => m?.id === selectedId) || safeMilestones[0];

  const criteria =
    (Array.isArray(selectedMilestone?.acceptance_criteria)
      ? selectedMilestone.acceptance_criteria
      : Array.isArray((selectedMilestone as any)?.criteria)
      ? (selectedMilestone as any).criteria
      : Array.isArray((selectedMilestone as any)?.acceptanceCriteria)
      ? (selectedMilestone as any).acceptanceCriteria
      : []);

  return (
    <div className="space-y-4">
      {/* Bryntum Integration Header & License Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Project Milestone Delivery Timeline</h3>
            <p className="text-xs text-muted-foreground">
              Bryntum Gantt Integration Interface • Interactive Schedule & Dependency Engine
            </p>
          </div>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          {hasBryntumLicense ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Bryntum License: Active
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
              Bryntum Engine: Community / Interface Mode
            </span>
          )}
        </div>
      </div>

      {/* Interactive Gantt Timeline Track */}
      <div className="p-5 rounded-lg border border-border bg-card shadow-sm space-y-6">
        <div className="space-y-4">
          {(Array.isArray(milestones) ? milestones : []).map((ms, index) => {
            const isSelected = ms?.id === selectedId;
            const isCompleted = ms?.status === 'completed' || ms?.status === 'verified';
            const isPartial = ms?.status === 'partially_verified';

            return (
              <div
                key={ms?.id || index}
                onClick={() => {
                  if (ms?.id) setSelectedId(ms.id);
                  if (onSelectMilestone && ms) onSelectMilestone(ms);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-1 ring-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isPartial
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{ms?.title}</h4>
                        <StatusBadge status={ms?.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ms?.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 pl-10 md:pl-0">
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Budget Allocation</span>
                      <span className="font-bold text-foreground">
                        ${ms?.allocated_amount} ({ms?.percentage_of_budget}%)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Target Date</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {ms?.expected_completion_date ? new Date(ms.expected_completion_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isCompleted ? 'bg-emerald-500 w-full' : isPartial ? 'bg-blue-500 w-3/4' : 'bg-muted-foreground/30 w-1/4'
                    }`}
                  />
                </div>

                {/* Dependencies */}
                {(Array.isArray(ms?.dependencies) ? ms.dependencies : []).length > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>Dependency:</span>
                    <span className="font-medium text-foreground">{(ms?.dependencies ?? []).join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Drill-down Card */}
      {selectedMilestone && (
        <div className="p-5 rounded-lg border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h4 className="font-bold text-sm text-foreground">Milestone Acceptance Criteria & Verification Checklist</h4>
            </div>
            <span className="text-xs font-mono text-muted-foreground">ID: {selectedMilestone?.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {(Array.isArray(criteria) ? criteria : []).map((c: any, i: number) => (
              <div key={c?.id || i} className="p-3 rounded-lg border border-border bg-muted/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Criterion {i + 1}</span>
                  <StatusBadge status={c?.status} />
                </div>
                <p className="text-muted-foreground">{c?.description}</p>
                <div className="text-[10px] text-primary font-mono uppercase">
                  Method: {c?.verification_method ? String(c.verification_method).replace('_', ' ') : 'Manual'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
