'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let bg = 'bg-muted text-muted-foreground border-border';

  switch (status.toLowerCase()) {
    case 'verified':
    case 'completed':
    case 'captured':
    case 'paid':
    case 'dispute_won':
    case 'settled_with_refund':
      bg = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      break;
    case 'partially_verified':
    case 'in_progress':
    case 'sent':
    case 'active':
    case 'in_review':
      bg = 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400';
      break;
    case 'payment_requested':
    case 'evidence_awaiting_approval':
    case 'evidence_ready_pending_submission':
    case 'pending':
    case 'action_required':
      bg = 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
      break;
    case 'disputed':
    case 'dispute_lost':
    case 'failed':
      bg = 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400';
      break;
    case 'evidence_submitted':
      bg = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      break;
    case 'submission_acknowledged':
    case 'dispute_outcome_pending':
      bg = 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400';
      break;
    default:
      bg = 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400';
  }

  let label = status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (
    status.toLowerCase() === 'evidence_awaiting_approval' ||
    status.toLowerCase() === 'evidence_ready_pending_submission'
  ) {
    label = 'Evidence Ready – Submission Pending';
  } else if (status.toLowerCase() === 'evidence_submitted') {
    label = 'Evidence Submitted to PayPal';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
}
