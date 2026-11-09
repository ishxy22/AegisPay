import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, canUserAccessProject } from '@/lib/auth';
import { Project } from '@/types';

export async function GET() {
  const session = await getSession();
  const allProjects = await db.getProjects();

  if (session && session.role !== 'admin') {
    const userProjects = allProjects.filter((p) => canUserAccessProject(p, session));
    return NextResponse.json(userProjects);
  }

  return NextResponse.json(allProjects);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const providerId = session?.role === 'service_provider' ? session.userId : (body.provider_id || 'de0b6989-bf7e-4d6e-b127-397af924a75b');
    const providerName = session?.role === 'service_provider' ? session.fullName : (body.provider_name || 'Service Provider');
    const providerEmail = session?.role === 'service_provider' ? session.email : (body.provider_email || 'provider@example.com');

    const clientId = session?.role === 'client' ? session.userId : (body.client_id || 'fe62449c-8908-479f-9302-470005140e70');
    const clientName = session?.role === 'client' ? session.fullName : (body.client_name || 'Client Representative');
    const clientEmail = session?.role === 'client' ? session.email : (body.client_email || 'client@example.com');

    const newProject: Partial<Project> = {
      title: body.title || 'Untitled Project',
      description: body.description || '',
      client_id: clientId,
      client_name: clientName,
      client_email: clientEmail,
      provider_id: providerId,
      provider_name: providerName,
      provider_email: providerEmail,
      total_budget: Number(body.total_budget) || 1000,
      currency: body.currency || 'USD',
      deadline: body.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'active',
      milestone_count: 0,
      completed_milestones: 0,
    };

    const saved = await db.createProject(newProject as Project);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 400 });
  }
}
