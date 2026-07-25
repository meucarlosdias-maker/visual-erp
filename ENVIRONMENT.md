# Variáveis de Ambiente

## Ambientes

| Variável | Desenvolvimento | Staging | Produção |
|----------|----------------|---------|----------|
| `NODE_ENV` | `development` | `staging` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | Localhost:54321 | staging.supabase.co | project.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dev key | Staging key | Prod key |
| `SUPABASE_SERVICE_ROLE_KEY` | Dev key | Staging key | Prod key |
| `DATABASE_URL` | localhost:5432 | staging-host | prod-host |
| `DIRECT_URL` | localhost:5432 | staging-host-direct | prod-host-direct |
| `NEXT_PUBLIC_SITE_URL` | http://localhost:3000 | https://staging.visualerp.com.br | https://app.visualerp.com.br |
| `APP_URL` | http://localhost:3000 | https://staging.visualerp.com.br | https://app.visualerp.com.br |
| `NEXTAUTH_URL` | http://localhost:3000 | https://staging.visualerp.com.br | https://app.visualerp.com.br |
| `NEXTAUTH_SECRET` | Dev secret | Staging secret | Prod secret |
| `PRISMA_CLIENT_ENGINE_TYPE` | (vazio) | (vazio) | (vazio) |

## Arquivos de Ambiente

| Arquivo | Uso |
|---------|-----|
| `.env.development` | Desenvolvimento local |
| `.env.staging` | Ambiente de staging |
| `.env.production` | Ambiente de produção |
| `.env.example` | Template para referência |

## Descrição das Variáveis

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `NODE_ENV` | Sim | Ambiente de execução |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL pública do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anônima (pública) |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave de serviço (secreta) |
| `DATABASE_URL` | Sim | Connection string PostgreSQL |
| `DIRECT_URL` | Não | Connection string direta (pooling) |
| `NEXT_PUBLIC_SITE_URL` | Sim | URL pública do site |
| `APP_URL` | Sim | URL interna da aplicação |
| `NEXTAUTH_URL` | Sim | URL do NextAuth |
| `NEXTAUTH_SECRET` | Sim | Secret do NextAuth |
| `PRISMA_CLIENT_ENGINE_TYPE` | Não | Engine Prisma |

## Segurança

- **Nunca** commite arquivos `.env` com valores reais
- **Nunca** compartilhe `SUPABASE_SERVICE_ROLE_KEY`
- Use variáveis de ambiente no Vercel Dashboard para staging/produção
- Rotacione chaves periodicamente
- Cada ambiente deve ter **chaves independentes**
