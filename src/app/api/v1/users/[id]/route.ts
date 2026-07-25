import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api-middleware';

export const GET = withApiAuth(async (request: NextRequest) => {
  const userId = request.nextUrl.pathname.split('/').pop()!;
  return NextResponse.json({
    success: true,
    message: 'Usuário encontrado',
    data: { id: userId },
  });
});