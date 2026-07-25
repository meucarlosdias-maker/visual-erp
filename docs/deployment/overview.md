# Deploy

## Containerização com Docker

O Visual ERP utiliza Docker e Docker Compose para ambiente de desenvolvimento e produção.

### Dockerfile

```dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN pnpm install --prod
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env.production
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: visual-erp
      POSTGRES_PASSWORD: ${DB_PASSWORD}

volumes:
  postgres_data:
```

## Variáveis de Ambiente

O projeto utiliza múltiplos arquivos `.env` para cada ambiente:

```
.env                # Valores padrão (versionado)
.env.example        # Template (versionado)
.env.development    # Desenvolvimento local
.env.staging        # Homologação
.env.production     # Produção
```

### Variáveis Essenciais

```
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=postgresql://user:password@host:5432/visual-erp
DIRECT_URL=postgresql://user:password@host:5432/visual-erp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

## Build Process

O build utiliza o Next.js com compilação TypeScript e otimizações:

```bash
# Build completo
pnpm build

# O comando executa:
# 1. next build (compilação + otimização)
# 2. Geração de arquivos estáticos
# 3. Code splitting automático
# 4. Tree shaking
```

## CI/CD

### Estrutura de Pipeline

O pipeline de CI/CD segue estas etapas:

1. **Lint** — `pnpm lint` (ESLint)
2. **Type Check** — `pnpm typecheck` (TypeScript strict)
3. **Testes Unitários** — `pnpm test` (Vitest)
4. **Testes E2E** — `pnpm test:e2e` (Playwright)
5. **Build** — `pnpm build`
6. **Deploy** — Docker build + push + deploy

### Scripts Disponíveis

```bash
pnpm dev              # Desenvolvimento (next dev)
pnpm build            # Build de produção
pnpm start            # Iniciar produção
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm test             # Testes unitários
pnpm test:coverage    # Testes com cobertura
pnpm test:e2e         # Testes E2E
pnpm format           # Prettier
```

## Docker Compose para Desenvolvimento

Para ambiente de desenvolvimento local com banco de dados:

```bash
# Iniciar dependências (PostgreSQL)
docker-compose up -d db

# Rodar migrações
pnpm db:migrate

# Iniciar app
pnpm dev
```

## Observações

- A aplicação utiliza Prisma ORM com suporte a migrations
- O adaptador PostgreSQL (`@prisma/adapter-pg`) é configurado via variável `DATABASE_URL`
- O Next.js 16 otimiza automaticamente imagens, fontes e scripts
- O Turborepo (`turbo.json`) gerencia o cache de build entre pacotes
