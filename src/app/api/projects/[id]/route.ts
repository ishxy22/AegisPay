import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, canUserAccessProject } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await db.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const session = await getSession();
  if (session && !canUserAccessProject(project, session)) {
    return NextResponse.json(
      { error: 'Forbidden: You do not have permission to view this project.' },
      { status: 403 }
    );
  }

  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await db.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const session = await getSession();
  if (session && !canUserAccessProject(project, session)) {
    return NextResponse.json(
      { error: 'Forbidden: You do not have permission to modify this project.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const updated = await db.updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
