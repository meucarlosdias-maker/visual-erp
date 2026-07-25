import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api-middleware';

export const GET = withApiAuth(async (_request: NextRequest, { id }: { id: string }) => {
  const clientId = _request.nextUrl.pathname.split('/').pop()!;
  return NextResponse.json({
    success: true,
    message: 'Cliente encontrado',
    data: { id: clientId },
  });
});

export const PUT = withApiAuth(async (request: NextRequest) => {
  const clientId = request.nextUrl.pathname.split('/').pop()!;
  const body = await request.json();
  return NextResponse.json({
    success: true,
    message: 'Cliente atualizado',
    data: { id: clientId, ...body },
  });
});

export const DELETE = withApiAuth(async (request: NextRequest) => {
  const clientId = request.nextUrl.pathname.split('/').pop()!;
  return NextResponse.json({
    success: true,
    message: 'Cliente excluído',
    data: { id: clientId },
  });
});