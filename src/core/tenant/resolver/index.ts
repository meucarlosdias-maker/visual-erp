import type { TenantMiddlewareResult, ResolverOptions } from '../types';

class TenantResolver {
  resolve(options: ResolverOptions): TenantMiddlewareResult {
    if (options.subdomain && options.subdomain !== 'www' && options.subdomain !== 'app') {
      return { tenantId: options.subdomain, resolvedBy: 'subdomain' };
    }

    if (options.domain) {
      const slug = options.domain.split('.')[0];
      if (slug && slug !== 'www' && slug !== 'app') {
        return { tenantId: slug, resolvedBy: 'domain' };
      }
    }

    if (options.sessionTenantId) {
      return { tenantId: options.sessionTenantId, resolvedBy: 'session' };
    }

    return { tenantId: 'default', resolvedBy: 'default' };
  }

  getTenantSlugFromHost(host: string): string | null {
    const parts = host.split('.');
    if (parts.length >= 3) {
      const slug = parts[0];
      if (slug !== 'www' && slug !== 'app') return slug;
    }
    return null;
  }

  getTenantSlugFromPath(path: string): string | null {
    const parts = path.split('/').filter(Boolean);
    return parts.length > 0 ? parts[0] : null;
  }
}

export const tenantResolver = new TenantResolver();
