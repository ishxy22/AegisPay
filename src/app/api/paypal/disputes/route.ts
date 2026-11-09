import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listPayPalDisputes } from '@/lib/paypal';

export async function GET() {
  // Sync live/cached disputes
  const internalDisputes = await db.getDisputes();
  const paypalDisputes = await listPayPalDisputes();

  return NextResponse.json({
    internalDisputes,
    paypalDisputes,
  });
}
