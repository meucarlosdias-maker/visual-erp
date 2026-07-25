import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/modules/api/services/api-key-service';
import { apiLogService } from '@/modules/api/services/api-log-service';

export type ApiHandler = (request: NextRequest, key: { id: string; permissions: string[] }) => Promise<NextResponse>;

export function withApiAuth(handler: ApiHandler) {
  return async (request: NextRequest) => {
    const start = Date.now();
    const apiKey = request.headers.get('X-API-Key') ?? '';
    const signature = request.headers.get('X-Signature') ?? '';

    const key = await apiKeyService.validateKey(apiKey, signature);
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 },
      );
    }

    const response = await handler(request, { id: key.id, permissions: key.permissions });

    const duration = Date.now() - start;
    await apiLogService.create({
      apiKeyId: key.id,
      endpoint: request.nextUrl.pathname,
      method: request.method,
      statusCode: response.status,
      responseTime: duration,
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined,
    });

    return response;
  };
}