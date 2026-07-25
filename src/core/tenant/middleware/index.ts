import type { TenantMiddlewareResult } from '../types';
import { tenantResolver } from '../resolver';

export interface TenantMiddlewareRequest {
  headers: Record<string, string | undefined>;
  url?: string;
  session?: { tenantId?: string };
}

class TenantMiddleware {
  async resolve(request: TenantMiddlewareRequest): Promise<TenantMiddlewareResult> {
    const host = request.headers['host'] ?? '';
    const subdomain = tenantResolver.getTenantSlugFromHost(host);

    return tenantResolver.resolve({
      subdomain: subdomain ?? undefined,
      sessionTenantId: request.session?.tenantId,
    });
  }

  async validate(request: TenantMiddlewareRequest): Promise<{ valid: boolean; tenantId?: string; error?: string }> {
    try {
      const result = await this.resolve(request);
      if (!result.tenantId || result.tenantId === 'default') {
        return { valid: false, error: 'Tenant não identificado' };
      }
      return { valid: true, tenantId: result.tenantId };
    } catch (error) {
      return { valid: false, error: String(error) };
    }
  }

  getTenantFromHeaders(headers: Record<string, string | undefined>): string | null {
    const tenantHeader = headers['x-tenant-id'];
    if (tenantHeader) return tenantHeader;

    const host = headers['host'] ?? '';
    return tenantResolver.getTenantSlugFromHost(host);
  }
}

export const tenantMiddleware = new TenantMiddleware();
