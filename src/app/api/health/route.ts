import { NextResponse } from 'next/server';
import { getHealthStatus } from '@/lib/monitoring';

export async function GET() {
  const health = getHealthStatus(true);
  return NextResponse.json(health);
}
