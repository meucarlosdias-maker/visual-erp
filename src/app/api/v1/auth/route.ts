import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/modules/api/services/api-key-service';
import { apiLogService } from '@/modules/api/services/api-log-service';

export async function POST(request: NextRequest) {
  const start = Date.now();
  const apiKey = request.headers.get('X-API-Key') ?? '';
  const secret = request.headers.get('X-Signature') ?? '';

  try {
    const key = await apiKeyService.validateKey(apiKey, secret);
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Autenticado com sucesso',
      data: {
        permissions: key.permissions,
        name: key.name,
      },
    });
  } finally {
    await apiLogService.create({
      apiKeyId: apiKey,
      endpoint: '/auth',
      method: 'POST',
      statusCode: 200,
      responseTime: Date.now() - start,
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined,
    });
  }
}