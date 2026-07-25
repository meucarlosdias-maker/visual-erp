# Manual de Operações - Visual ERP

## Ambientes

### Development

| Recurso | Valor |
|---------|-------|
| URL | `http://localhost:3000` |
| Database | PostgreSQL local |
| Supabase | Local ou projeto dev |
| Storage | Supabase Storage dev |
| Variáveis | `.env.development` |

### Staging

| Recurso | Valor |
|---------|-------|
| URL | `https://staging.visualerp.com.br` |
| Database | Supabase staging |
| Supabase | Projeto staging |
| Storage | Supabase Storage staging |
| Variáveis | `.env.staging` |

### Production

| Recurso | Valor |
|---------|-------|
| URL | `https://app.visualerp.com.br` |
| Database | Supabase production |
| Supabase | Projeto production |
| Storage | Supabase Storage production |
| Variáveis | `.env.production` |

## Deploy

### Supabase

1. Criar projeto no dashboard do Supabase
2. Configurar Auth (email/password, redirect URLs)
3. Criar bucket de storage
4. Executar migrations: `npm run db:migrate`
5. Gerar client: `npm run db:generate`

### Vercel

1. Conectar repositório no Vercel Dashboard
2. Configurar variáveis de ambiente por ambiente
3. Framework: Next.js
4. Build: `npm run build`
5. Saída: `.next/`

### Domínio

1. Configurar DNS apontando para Vercel
2. Adicionar domínio no Vercel Dashboard
3. Configurar SSL (automático via Vercel)
4. Atualizar `NEXT_PUBLIC_SITE_URL`

## Monitoramento

### Health Check

```http
GET /api/health

Response:
{
  "status": "ok",
  "version": "1.0.0",
  "database": "connected",
  "uptime": "3600s",
  "timestamp": "2026-07-22T..."
}
```

### Métricas de Performance

```typescript
// Uso de memória, CPU, tempo de resposta
// Logados automaticamente via src/lib/monitoring.ts
```

### Logs

- Logger estruturado com `requestId` e `correlationId`
- Todos os logs em formato JSON
- Níveis: debug, info, warn, error

### Auditoria

- Audit trail completo no banco (`audit_logs`)
- Painel admin em `/app/admin/auditoria`
- Logs do sistema em `/app/admin/logs`

## Troubleshooting

### Problema: Build falha

1. Verificar `npm run lint`
2. Verificar `npm run typecheck`
3. Verificar `npm audit`
4. Limpar cache: `rm -rf .next node_modules && npm install`

### Problema: Database

1. Verificar `DATABASE_URL`
2. Executar `npx prisma validate`
3. Executar `npx prisma db push --accept-data-loss` (apenas dev)

### Problema: Performance

1. Verificar health check: `GET /api/health`
2. Verificar logs de erro
3. Verificar uso de memória
4. Verificar queries lentas no Supabase Dashboard
