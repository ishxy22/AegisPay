import { NextRequest, NextResponse } from 'next/server';
import { signInUser } from '@/lib/auth';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const result = await signInUser({
      email,
      password,
      roleOverride: role as UserRole,
    });

    if (!result.success || !result.session) {
      return NextResponse.json({ error: result.error || 'Login failed' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      session: result.session,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
