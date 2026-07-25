# Visão Geral da Arquitetura

**Visual ERP** é uma plataforma SaaS para empresas de Comunicação Visual, construída como um monorepo gerenciado com pnpm workspaces. A aplicação utiliza Next.js 16 com App Router, Prisma ORM, Supabase para autenticação e armazenamento, e segue uma arquitetura em camadas com módulos independentes.

## Estrutura em Monorepo

O repositório é organizado com pnpm workspaces, contendo dois diretórios principais:

- **`apps/`** — Aplicações independentes que consomem os pacotes compartilhados:
  - `portal-colaborador` — Aplicação web para funcionários
  - `portal-cliente` — Portal do cliente
  - `mobile` — Aplicação mobile

- **`packages/`** — Pacotes compartilhados entre as aplicações:
  - `ui` — Componentes de interface reutilizáveis
  - `api` — Cliente HTTP e integrações
  - `auth` — Lógica de autenticação compartilhada
  - `config` — Configurações centralizadas
  - `types` — Tipos e interfaces compartilhadas
  - `utils` — Utilitários gerais

## Camadas da Arquitetura

### Apresentação — `src/app/`

Utiliza o App Router do Next.js 16 com rotas em português (`/app/clientes`, `/app/orcamentos`, `/app/producao`). Contém:

- **Páginas públicas**: `/auth/login`, `/auth/recuperar-senha`
- **Páginas privadas**: `/app/*` (dashboard, módulos de negócio)
- **API Routes**: `/api/v1/*` (REST endpoints)
- **Plataforma**: `/platform/*` (administração global SaaS)

### Aplicação — `src/modules/`

29 módulos de negócio, cada um autocontido com sua própria estrutura de types, schemas, validators, repository, services, actions, hooks e components. Exemplos: `crm`, `projects`, `quotations`, `financial`, `work-orders`, `materials`, `equipments`, `calendar`, `teams`, `users`.

### Domínio — `src/core/`

14 domínios fundamentais que implementam lógica de negócio reutilizável:

- **tenant** — Isolamento multi-tenant (contexto, middleware, resolver)
- **permissions** — RBAC e controle de acesso
- **audit** — Auditoria e logging
- **engines** — Motores de cálculo (pricing, formula)
- **workflow** — Automação de processos
- **security** — Políticas de segurança
- **ai** — Integração com IA
- **knowledge** — Base de conhecimento
- **events** — Barramento de eventos
- **queue** — Filas de processamento
- **analytics** — Métricas e analytics
- **automation** — Automação de tarefas
- **communication** — Canais de comunicação
- **plugins** — Sistema de plugins

### Infraestrutura — `prisma/`, `src/lib/`, `src/config/`

- **Prisma ORM** — Schema com 46+ modelos, SQLite em dev, PostgreSQL em produção
- **Bibliotecas** — `repository-base.ts`, `service-base.ts`, `action-response.ts`, `prisma.ts`, `security.ts`, `errors.ts`
- **Config** — Rotas, permissões, módulos, sistema, navegação

## Padrões da Arquitetura

- **Repository Pattern** — Abstração de acesso a dados com `BaseRepository`
- **Service Layer** — Regras de negócio em `BaseService`
- **Server Actions** — Ações do servidor utilizando `ActionResponse`
- **Mock Data** — Repositórios em memória para desenvolvimento rápido
- **Barrel Exports** — Exportação centralizada via `index.ts`

## Tecnologias Principais

| Tecnologia | Versão | Propósito |
|---|---|---|
| Next.js | 16.2.11 | Framework web |
| React | 19.2.4 | UI Library |
| Prisma | 7.9.0 | ORM |
| TypeScript | 5.x | Linguagem |
| Tailwind CSS | 4.x | Estilização |
| Zustand | 5.x | Estado global |
| TanStack Query | 5.x | Data fetching |
| TanStack Table | 8.x | Tabelas |
| Zod | 4.x | Validação |
| Supabase | 2.x | Auth + Storage |
| PostgreSQL | — | Banco de dados |
| Docker | — | Containerização |
