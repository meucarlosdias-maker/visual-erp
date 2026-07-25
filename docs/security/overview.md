# Segurança

## RBAC — Controle de Acesso Baseado em Funções

O Visual ERP implemente RBAC com 5 níveis hierárquicos de acesso. Cada função possui um conjunto de permissões que determinam quais recursos o usuário pode acessar.

### Funções (Roles)

| Role | Hierarquia | Descrição |
|---|---|---|
| `SUPER_ADMIN` | 100 | Acesso total ao sistema, incluindo plataforma SaaS |
| `ADMIN` | 80 | Acesso administrativo por empresa |
| `MANAGER` | 60 | Gerencia projetos, equipes e clientes |
| `TEAM_MEMBER` | 40 | Executa tarefas operacionais |
| `VIEWER` | 20 | Acesso apenas para leitura |

### Matriz de Permissões

As permissões seguem o padrão `recurso:acao` (ex: `client:view`, `project:*`). O SUPER_ADMIN possui permissão universal (`*`).

**ADMIN** possui permissões amplas:
- `company.*`, `user:*`, `client:*`, `project:*`
- `api.*`, `workflow.*`, `ai.*`, `knowledge.*`, `plugins.*`
- `communication.*`, `builder.*`, `templates.*`
- `portal.client`, `portal.employee`, `mobile.*`
- `system.*`, `security.*`, `platform.*`

**MANAGER** possui permissões gerenciais:
- `company.view`, `client:view`, `client:create`, `client:update`, `project:*`

**TEAM_MEMBER** possui permissões operacionais:
- `company.view`, `client:view`, `project:view`, `project:update`

**VIEWER** possui acesso apenas de leitura:
- `company.view`, `client:view`, `project:view`

## Multi-Tenant Isolation

O isolamento entre tenants é feito pelo campo `companyId` presente em todos os modelos principais. O módulo `src/core/tenant/` implementa:

- **TenantContext** — Contexto React com informações do tenant ativo
- **TenantMiddleware** — Middleware Next.js que extrai o tenant da requisição
- **TenantResolver** — Resolve o tenant a partir do domínio/subdomínio
- **TenantIsolation** — Garante que consultas SQL sejam filtradas por `companyId`

```ts
// Exemplo de consulta com isolamento
const clients = await prisma.client.findMany({
  where: { companyId: tenantId, deletedAt: null },
});
```

## Auditoria

### AuditLog

Registra ações em entidades do sistema:

```ts
model AuditLog {
  action     String   // created, updated, deleted
  entityType String   // Client, Project, Quotation
  entityId   String
  changes    Json?    // Antigos e novos valores
  userId     String?
  companyId  String?
}
```

### AuditEvent

Registro detalhado para trilha de auditoria:

```ts
model AuditEvent {
  entity    String
  action    String
  oldValues Json?
  newValues Json?
  ip        String?
  userAgent String?
  sessionId String?
}
```

### AccessLog

Registro de acesso a recursos:

```ts
model AccessLog {
  userId    String?
  action    String
  resource  String
  status    String   // allowed, denied
  ip        String?
  userAgent String?
}
```

## Políticas de Segurança

O modelo `SecurityPolicy` permite configurar regras por empresa:

```ts
model SecurityPolicy {
  companyId String
  name      String
  rules     Json?    // Regras customizadas
  active    Boolean
}
```

## Configurações de Senha e Sessão

A autenticação é gerenciada pelo Supabase, que provê:
- **Política de senhas** — configurável (complexidade, expiração)
- **Sessões** — gerenciamento de sessão JWT
- **MFA** — estrutura preparada para autenticação multifator
- **Email verification** — verificação de email obrigatória

```ts
model User {
  email           String   @unique
  status          String   @default("active")
  ultimoLogin     DateTime?
  emailVerificado Boolean  @default(false)
}
```

## Sanitização e Rate Limiting

### Sanitização de Input

```ts
export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

### Rate Limiting

```ts
export class RateLimiter {
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000,
  ) {}
  check(key: string): boolean { /* ... */ }
}
```

## Data Retention

O modelo `DataRetentionPolicy` define políticas de retenção por entidade:

```ts
model DataRetentionPolicy {
  entity        String
  retentionDays Int
  archiveAfter  Int?
  deleteAfter   Int?
  active        Boolean
}
```

## Resumo das Camadas de Segurança

| Camada | Implementação |
|---|---|
| Autenticação | Supabase Auth (JWT + sessão) |
| Autorização | RBAC com permissões granulares |
| Isolamento | Multi-tenant via companyId |
| Auditoria | AuditLog, AuditEvent, AccessLog |
| API Security | API Keys + HMAC Signature |
| Rate Limiting | RateLimiter in-memory |
| Sanitização | Sanitize input/output |
| Políticas | SecurityPolicy configurável |
| Retenção | DataRetentionPolicy |
