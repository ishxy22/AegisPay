import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  await db.resetDemoScenario();
  return NextResponse.json({
    success: true,
    message: 'Demo scenario successfully reset to the initial $3,000 Website Development benchmark.',
  });
}
