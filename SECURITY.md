# Segurança - Visual ERP

## Política de Segurança

### Reportando Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança, por favor:

1. **Não abra uma issue pública**
2. Envie um e-mail para: security@visualerp.com.br
3. Aguarde nossa resposta (máximo 48h)

### Práticas de Segurança

## Autenticação

- Supabase Auth gerenciando login, logout e sessões
- Tokens JWT com expiração configurável
- Refresh tokens para sessões de longa duração
- Rate limiting no login (máx. 5 tentativas por minuto)

## Autorização (RBAC)

| Role | Descrição |
|------|-----------|
| SUPER_ADMIN | Acesso total ao sistema |
| ADMIN | Gerenciamento de usuários, clientes, projetos |
| MANAGER | CRUD de clientes, visualização de projetos |
| TEAM_MEMBER | Operações do dia a dia |
| VIEWER | Apenas visualização |

## Proteção de Dados

- **Headers HTTP:** CSP, HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Sanitização:** Inputs sanitizados contra XSS em todas as entradas
- **SQL Injection:** Prevenido pelo Prisma ORM (parameterized queries)
- **CSRF:** Proteção via cookies SameSite e tokens

## Variáveis de Ambiente

- `NEXT_PUBLIC_*`: Apenas variáveis públicas
- `SUPABASE_SERVICE_ROLE_KEY`: **Nunca expor ao cliente**
- `DATABASE_URL`: **Nunca versionar ou expor**
- Arquivo `.env` ignorado pelo `.gitignore`

## Sessões

- Sessões gerenciadas via Supabase Auth
- Todas as sessões são logadas em `sessions`
- Revogação de sessão disponível no painel admin
- Timeout de inatividade: 30 minutos

## Auditoria

- Todas as operações CRUD são registradas em `audit_logs`
- Logs incluem: ação, entidade, usuário, IP, timestamp, valores antigos/novos
- Logs são imutáveis (append-only)

## Boas Práticas

- Mantenha dependências atualizadas (`npm audit` regular)
- Use `PRISMA_CLIENT_ENGINE_TYPE=` vazio (binary engine)
- Rotacione chaves do Supabase periodicamente
- Ative MFA nas contas admin do Supabase
- Monitore logs de acesso regularmente
