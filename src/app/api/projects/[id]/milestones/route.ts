import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Milestone } from '@/types';
import { DEFAULT_NOVATECH_MILESTONES } from '@/lib/constants';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const milestones = await db.getMilestonesByProject(id);
  if ((!milestones || milestones.length === 0) && id === 'proj_web_dev_3000') {
    return NextResponse.json(DEFAULT_NOVATECH_MILESTONES);
  }
  return NextResponse.json(milestones);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const rawMilestones = Array.isArray(body)
      ? body
      : Array.isArray(body.milestones)
      ? body.milestones
      : [body];

    const newMilestones: Milestone[] = rawMilestones.map((m: any, idx: number) => ({
      id: m.id || `ms_${Date.now()}_${idx}`,
      project_id: id,
      title: m.title || 'Untitled Milestone',
      description: m.description || '',
      deliverables: m.deliverables || [],
      acceptance_criteria: (m.acceptance_criteria || []).map((c: any, cIdx: number) => ({
        id: c.id || `crit_${Date.now()}_${cIdx}`,
        milestone_id: m.id || `ms_${Date.now()}_${idx}`,
        description: c.description || 'Deliverable criteria',
        verification_method: c.verification_method || 'github_inspection',
        status: c.status || 'pending',
      })),
      expected_completion_date: m.expected_completion_date || new Date().toISOString(),
      allocated_amount: Number(m.allocated_amount) || 0,
      percentage_of_budget: Number(m.percentage_of_budget) || 0,
      dependencies: m.dependencies || [],
      verification_requirements: m.verification_requirements || [],
      status: m.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const saved = await db.createMilestones(newMilestones);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Milestone ID required' }, { status: 400 });
    }
    const updated = await db.updateMilestone(body.id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
