# Relatório de Migração — Prisma Postgres → Supabase PostgreSQL

**Data:** 2026-07-25  
**Projeto:** Visual ERP v1.0.0  
**Supabase Project:** `itqsmczpaqacsbplykqc`  
**Região:** `ca-central-1` (Canadá Central)

---

## 1. Configurações Alteradas

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `.env` | Substituído `prisma+postgres://localhost:51213` por conexão Supabase via session pooler |
| `.env.development` | Substituído `localhost:5432` por Supabase; adicionados Supabase keys reais |
| `.env.production` | Preenchido com URL do Supabase, anon key, service role key e connection strings |
| `prisma.config.ts` | Ajustado `datasource.url` (removido `directUrl` que não existe no tipo) |
| `package.json` | Adicionado `"vercel-build": "prisma generate && next build"` para Vercel |

### Connection Strings

```env
# Session pooler (Prisma CLI + runtime local)
DATABASE_URL="postgresql://postgres.itqsmczpaqacsbplykqc:i0W0WrqhMc8UpfGZ@aws-0-ca-central-1.pooler.supabase.com:5432/postgres"

# Transaction pooler (produção - Vercel)
DATABASE_URL="postgresql://postgres.itqsmczpaqacsbplykqc:i0W0WrqhMc8UpfGZ@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"

# Para deploy: PRISMA_DIRECT_URL deve usar session pooler
PRISMA_DIRECT_URL="postgresql://postgres.itqsmczpaqacsbplykqc:i0W0WrqhMc8UpfGZ@aws-0-ca-central-1.pooler.supabase.com:5432/postgres"
```

---

## 2. Comandos Executados

| Comando | Resultado |
|---------|-----------|
| `npx prisma validate` | Schema válido ✅ |
| `npx prisma generate` | Client gerado em `src/generated/prisma` ✅ |
| `npx prisma db push --accept-data-loss` | Schema enviado ao Supabase (67s) ✅ |
| `npx prisma migrate diff --from-empty --to-schema` | SQL gerado (76KB) ✅ |
| `npx prisma migrate resolve --applied 0001_init` | Migration marcada como aplicada ✅ |
| `npx prisma migrate status` | "Database schema is up to date!" ✅ |
| `npm run typecheck` | 0 erros TypeScript ✅ |
| `npm run build` | Build concluído, 0 erros ✅ |

---

## 3. Conexão com o Banco

```
Host:        aws-0-ca-central-1.pooler.supabase.com
Porta (qry): 5432 (session) / 6543 (transaction pooler)
Database:    postgres
Schema:      public
SSL:         Required (rejectUnauthorized: false configurado)
Status:      Conectado ✅
```

---

## 4. Migration

**Arquivo:** `prisma/migrations/0001_init/migration.sql` (76KB)

Contém a criação de todas as 70+ tabelas definidas no schema Prisma (1867 linhas).

**Status:** Aplicada e sincronizada.

---

## 5. Build

```
npm run build    → 0 erros
npm run typecheck → 0 erros
```

Todas as rotas compiladas, incluindo as 5 novas páginas de navegação e a página de autenticação.

---

## 6. Pendências Antes do Deploy na Vercel

### No Vercel Dashboard, configurar as variáveis de ambiente:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres.itqsmczpaqacsbplykqc:i0W0WrqhMc8UpfGZ@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://itqsmczpaqacsbplykqc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...WDzSqH4...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...EXNOEk...` |
| `NEXT_PUBLIC_SITE_URL` | `https://app.visualerp.com.br` |
| `DIRECT_URL` | `postgresql://postgres.itqsmczpaqacsbplykqc:i0W0WrqhMc8UpfGZ@aws-0-ca-central-1.pooler.supabase.com:5432/postgres` |

### Configurar no Supabase:

- [ ] **Authentication Providers**: Habilitar Email/Password em Authentication > Providers
- [ ] **Storage Bucket**: Criar bucket `visual-erp-uploads` (ou o nome configurado)
- [ ] **Row Level Security (RLS)**: Configurar políticas se necessário

### Configurar no projeto:

- [ ] **NEXTAUTH_SECRET**: Gerar valor seguro (`openssl rand -base64 32`) e configurar na Vercel
- [ ] **ENCRYPTION_KEY**: Gerar chave de 32 caracteres para criptografia AES-256-GCM

### Deploy:

```bash
# 1. Conectar repositório na Vercel
# 2. Adicionar variáveis de ambiente (acima)
# 3. Build automático detectará Next.js + Prisma
# 4. Rodar migration no banco de produção:
npx prisma migrate deploy

# 5. Ou se for primeira vez:
npx prisma migrate resolve --applied 0001_init
```
