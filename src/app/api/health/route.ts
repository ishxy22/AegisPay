import { NextResponse } from 'next/server';
import { getSystemCapabilities } from '@/lib/env';

export async function GET() {
  const capabilities = getSystemCapabilities();
  return NextResponse.json({
    status: 'healthy',
    product: 'AegisPay',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    capabilities,
  });
}
