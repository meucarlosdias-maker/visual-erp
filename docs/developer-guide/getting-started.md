# Getting Started

## Pré-requisitos

- **Node.js** 20.x ou superior
- **pnpm** 9.x (corepack recomendado: `corepack enable && corepack prepare pnpm --activate`)
- **PostgreSQL** 16 (opcional em desenvolvimento — usar SQLite via mock)
- **Docker** + **Docker Compose** (para ambiente completo)

## Setup Inicial

```bash
# 1. Clone o repositório
git clone https://github.com/visual-erp/visual-erp.git
cd visual-erp

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.development
# Edite .env.development com suas configurações locais

# 4. Gere o Prisma Client
pnpm db:generate

# 5. Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`.

## Scripts Principais

```bash
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm start            # Servidor de produção
pnpm lint             # ESLint
pnpm typecheck        # Verificação de tipos TypeScript
pnpm test             # Testes unitários (Vitest)
pnpm test:watch       # Testes em modo watch
pnpm test:coverage    # Testes com cobertura
pnpm test:e2e         # Testes E2E (Playwright)
pnpm test:e2e:ui      # Playwright UI mode
pnpm format           # Formatação (Prettier)
```

## Banco de Dados

```bash
pnpm db:generate      # Gerar Prisma Client
pnpm db:push          # Push schema para o banco
pnpm db:migrate       # Criar migração
pnpm db:studio        # Abrir Prisma Studio
```

## Estrutura do Projeto

```
apps/                 # Aplicações (portal-colaborador, portal-cliente, mobile)
packages/             # Pacotes compartilhados (ui, api, auth, config, types, utils)
src/                  # Código fonte principal
  app/                #   Next.js App Router
  modules/            #   29 módulos de negócio
  core/               #   14 domínios fundamentais
  components/         #   Componentes globais
  config/             #   Configurações
  lib/                #   Bibliotecas e utilitários
prisma/               # Schema Prisma
tests/                # Testes
docs/                 # Documentação
```

## Fluxo de Desenvolvimento

1. **Crie um módulo** em `src/modules/<nome>/` seguindo a estrutura padronizada
2. **Defina tipos** em `types/` e **schemas Zod** em `schemas/`
3. **Implemente o repositório** em `repository/`
4. **Crie serviços** com regras de negócio em `services/`
5. **Adicione server actions** em `actions/`
6. **Crie hooks** React Query em `hooks/`
7. **Desenvolva componentes** em `components/`
8. **Exporte** tudo via `index.ts` (barrel export)
9. **Crie as páginas** em `src/app/`

## Convenções

- TypeScript strict mode (sem `any`)
- PascalCase para componentes e tipos
- camelCase para funções e variáveis
- kebab-case para nomes de arquivo
- Barrel exports (`index.ts`) em cada módulo
- Zod schemas para validação de dados
- Server actions com padrão `ActionResponse`
- Commits semânticos seguindo o padrão do repositório

## Testes

```bash
# Unitários (Vitest)
pnpm test

# E2E (Playwright)
pnpm test:e2e

# Com cobertura
pnpm test:coverage
```

Os mocks estão em `tests/mocks/` e fixtures em `tests/fixtures/`.
