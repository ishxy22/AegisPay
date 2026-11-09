import { NextResponse } from 'next/server';
import { db, supabase } from '@/lib/db';
import { DEFAULT_NOVATECH_MILESTONES } from '@/lib/constants';

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    }

    const projects = await db.getProjects();
    const allMilestones: any[] = [];
    for (const p of projects) {
      const ms = await db.getMilestonesByProject(p.id);
      allMilestones.push(...ms);
    }

    if (allMilestones.length > 0) {
      return NextResponse.json(allMilestones);
    }

    return NextResponse.json(DEFAULT_NOVATECH_MILESTONES);
  } catch {
    return NextResponse.json(DEFAULT_NOVATECH_MILESTONES);
  }
}
