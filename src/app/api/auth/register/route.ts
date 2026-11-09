import { NextRequest, NextResponse } from 'next/server';
import { signUpUser } from '@/lib/auth';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, role } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    const result = await signUpUser({
      email,
      password: password || 'Password123!',
      fullName,
      role: (role as UserRole) || 'service_provider',
    });

    if (!result.success || !result.session) {
      return NextResponse.json({ error: result.error || 'Registration failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      session: result.session,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}

