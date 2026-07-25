# Visual ERP

Sistema de Gestão Visual — ERP modular para empresas de comunicação visual.

**Versão:** 1.0.0-rc1 | **Status:** Release Candidate | **Licença:** Proprietária

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js Server Actions + Prisma ORM 7
- **Auth:** Supabase Auth
- **Database:** PostgreSQL (Supabase)
- **Validação:** Zod v4
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Testes:** Vitest + Playwright

## Módulos

| Módulo | Descrição | Status |
|--------|-----------|--------|
| Dashboard | Indicadores, BI, gráficos (Bar, Line, Area, Pie, Funnel) | ✅ |
| Auth | Login, logout, recuperação de senha | ✅ |
| Users | Usuários, papéis, permissões | ✅ |
| Company | Configurações da empresa | ✅ |
| CRM | Leads, atividades, visitas | ✅ |
| Quotations | Orçamentos | ✅ |
| Projects | Projetos, tarefas, produção | ✅ |
| Work Orders | Ordens de serviço | ✅ |
| Installations | Instalações em campo | ✅ |
| Financial | Contas a receber/pagar, fluxo de caixa | ✅ |
| Calendar | Agenda corporativa | ✅ |
| Catalog | Catálogo de serviços, categorias, componentes | ✅ |
| Materials | Materiais e categorias | ✅ |
| Equipments | Equipamentos e categorias | ✅ |
| Teams | Equipes, membros, produtividade | ✅ |
| System | RBAC, auditoria, logs, sessões, segurança | ✅ |

## Fluxo de Negócio

```
Lead → Cliente → Visita → Orçamento → Projeto → OS → Produção → Instalação → Entrega → Financeiro
```

## Início Rápido

```bash
git clone <repo-url> visual-erp
cd visual-erp
cp .env.example .env.local
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Acessar: [http://localhost:3000](http://localhost:3000)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Testes unitários + integração |
| `npm run test:coverage` | Testes com cobertura |
| `npm run test:e2e` | Playwright E2E |
| `npm run format` | Prettier |
| `npm run db:generate` | Prisma Client |
| `npm run db:migrate` | Migration |
| `npm run db:studio` | Prisma Studio |

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [CHANGELOG.md](CHANGELOG.md) | Histórico de versões |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guia de contribuição |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura do sistema |
| [DEPLOY.md](DEPLOY.md) | Guia de deploy |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Variáveis de ambiente |
| [SECURITY.md](SECURITY.md) | Política de segurança |
| [OPERATIONS.md](OPERATIONS.md) | Manual de operações |
| [BACKUP.md](BACKUP.md) | Procedimentos de backup |
| [RESTORE.md](RESTORE.md) | Procedimentos de restore |
| [VERSIONING.md](VERSIONING.md) | Estratégia de versionamento |
| [docs/admin-manual.md](docs/admin-manual.md) | Manual do administrador |
| [docs/user-manual.md](docs/user-manual.md) | Manual do usuário |

## Qualidade

- **ESLint:** 0 erros (excluindo pattern `set-state-in-effect`)
- **TypeScript:** strict mode, 0 erros
- **Build:** compilado com sucesso (72 páginas)
- **Testes:** 162 testes passando
- **Cobertura:** ≥ 75% nas bibliotecas core
- **Health Check:** `GET /api/health`

## Segurança

- Headers HTTP: CSP, HSTS, X-XSS-Protection, X-Frame-Options
- Sanitização de inputs (XSS)
- Rate limiting estrutural
- RBAC com 5 papéis
- Auditoria completa
- Sessões gerenciadas via Supabase

## Projetos Relacionados

- [Supabase](https://supabase.com) — Backend as a Service
- [Vercel](https://vercel.com) — Plataforma de deploy
- [Prisma](https://prisma.io) — ORM
- [Next.js](https://nextjs.org) — Framework
