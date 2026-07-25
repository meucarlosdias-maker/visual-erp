import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api-middleware';

export const GET = withApiAuth(async () => {
  return NextResponse.json({
    success: true,
    message: 'Clientes listados com sucesso',
    data: [],
    meta: { page: 1, limit: 10, total: 0 },
  });
});

export const POST = withApiAuth(async (request: NextRequest) => {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    message: 'Cliente criado com sucesso',
    data: body,
  }, { status: 201 });
});