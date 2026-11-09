'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DefensePage from '@/app/defense/page';

export default function ProjectDisputesPage() {
  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </Link>
      <DefensePage />
    </div>
  );
}
