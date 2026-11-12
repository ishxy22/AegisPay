import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, canUserAccessProject } from '@/lib/auth';
import { Project } from '@/types';

export async function GET() {
  const session = await getSession();
  const allProjects = await db.getProjects();

  if (session && session.role !== 'admin') {
    const userProjects = allProjects.filter((p) => canUserAccessProject(p, session));
    if (userProjects.length > 0) {
      return NextResponse.json(userProjects);
    }
  }

  return NextResponse.json(allProjects);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const providerEmail = body.provider_email?.trim() || (session?.role === 'service_provider' ? session.email : 'provider@example.com');
    const providerName = body.provider_name?.trim() || ((session && session.email.toLowerCase() === providerEmail.toLowerCase()) ? session.fullName : 'Service Provider');
    const providerId = (session?.email && session.email.toLowerCase() === providerEmail.toLowerCase())
      ? session.userId
      : (body.provider_id || `usr_prov_${Date.now()}`);

    const clientEmail = body.client_email?.trim() || (session?.role === 'client' ? session.email : 'client@example.com');
    const clientName = body.client_name?.trim() || ((session && session.email.toLowerCase() === clientEmail.toLowerCase()) ? session.fullName : 'Client Representative');
    const clientId = (session?.email && session.email.toLowerCase() === clientEmail.toLowerCase())
      ? session.userId
      : (body.client_id || `usr_client_${Date.now()}`);

    const newProject: Partial<Project> = {
      title: body.title?.trim() || 'Untitled Project',
      description: body.description?.trim() || '',
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
