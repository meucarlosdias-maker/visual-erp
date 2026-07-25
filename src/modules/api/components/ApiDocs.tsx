'use client';

import { Badge } from '@/components/ui/badge';
import { openApiSpec } from '../docs/openapi';

export function ApiDocs() {
  const paths = Object.entries(openApiSpec.paths);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Endpoints Disponíveis</h2>
        <p className="text-sm text-muted-foreground">
          A API do Visual ERP utiliza autenticação via API Key + HMAC Signature.
          Todas as requisições devem incluir os headers <code className="text-xs bg-muted px-1">X-API-Key</code>,{' '}
          <code className="text-xs bg-muted px-1">X-Timestamp</code> e{' '}
          <code className="text-xs bg-muted px-1">X-Signature</code>.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-medium">Base URL</h3>
        <code className="text-sm bg-muted px-2 py-1 rounded block">https://{'{sua-url}'}/api/v1</code>
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-medium">Resposta Padrão</h3>
        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{JSON.stringify({
  success: true,
  message: 'Operação realizada com sucesso',
  data: {},
  meta: { page: 1, limit: 10, total: 100 },
  errors: {},
}, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Códigos de Erro</h3>
        <div className="space-y-1 text-sm">
          <p><code className="bg-muted px-1">401</code> — Não autorizado (API Key inválida ou expirada)</p>
          <p><code className="bg-muted px-1">403</code> — Sem permissão para o recurso</p>
          <p><code className="bg-muted px-1">404</code> — Recurso não encontrado</p>
          <p><code className="bg-muted px-1">422</code> — Dados inválidos</p>
          <p><code className="bg-muted px-1">429</code> — Muitas requisições (rate limit)</p>
          <p><code className="bg-muted px-1">500</code> — Erro interno do servidor</p>
        </div>
      </div>

      {paths.map(([path, methods]) => {
        const method = Object.keys(methods)[0];
        const details = methods[method as keyof typeof methods] as { summary?: string; tags?: string[] };
        return (
          <div key={path} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs uppercase">
                {method ?? 'GET'}
              </Badge>
              <code className="text-sm font-mono">/api/v1{path}</code>
            </div>
            <p className="text-sm text-muted-foreground">{details?.summary ?? path}</p>
            {details?.tags && (
              <div className="flex gap-1">
                {details.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}