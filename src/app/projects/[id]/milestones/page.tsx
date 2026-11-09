'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { MilestoneTimelineViewer } from '@/components/MilestoneTimelineViewer';
import { Milestone } from '@/types';

export default function MilestonesTimelinePage() {
  const params = useParams();
  const id = (params?.id as string) || 'proj_web_dev_3000';

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}/milestones`)
      .then((r) => r.json())
      .then((data) => setMilestones(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/projects/${id}`} className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Project Overview</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Project Milestone Timeline & Gantt Schedule</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Bryntum Gantt Integration Engine. Visualize dependencies, completion dates, and deliverable verification states.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading milestone timeline...</div>
      ) : (
        <MilestoneTimelineViewer milestones={Array.isArray(milestones) ? milestones : []} />
      )}
    </div>
  );
}
