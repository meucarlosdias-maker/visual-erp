import { NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api-middleware';

export const GET = withApiAuth(async () => {
  return NextResponse.json({
    success: true,
    message: 'Instalações listadas',
    data: [],
    meta: { page: 1, limit: 10, total: 0 },
  });
});