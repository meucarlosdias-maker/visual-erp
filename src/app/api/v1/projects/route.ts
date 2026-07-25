import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api-middleware';

export const GET = withApiAuth(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  return NextResponse.json({
    success: true,
    message: 'Projetos listados',
    data: [],
    meta: {
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 10),
      total: 0,
    },
  });
});