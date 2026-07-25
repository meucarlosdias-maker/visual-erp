export const ARCHITECTURE = `
# Visual ERP — Arquitetura

## Stack
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Auth:** Supabase Auth
- **Database:** PostgreSQL (Supabase)
- **Validação:** Zod v4
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Testes:** Vitest (unit/integration), Playwright (E2E)
- **Qualidade:** ESLint, Prettier, TypeScript strict

## Estrutura de Módulos

Cada módulo do domínio segue a estrutura:

module/
  actions/     — Server Actions (operações no servidor)
  components/  — Componentes React (Client Components)
  hooks/       — Custom Hooks (use[Nome])
  repository/  — Acesso a dados (mock ou Prisma)
  schemas/     — Schemas Zod (validação + tipos)
  services/    — Lógica de negócio (chama repositories)
  types/       — Re-export de tipos dos schemas
  validators/  — Constantes, enums, labels
  index.ts     — Barrel export

## Fluxo de Dados

Page/Component → Hook → Service → Repository → (Prisma | Mock)

## Fluxos de Negócio (integrações)

Lead → Cliente → Visita → Orçamento → Projeto → OS → Produção → Instalação → Entrega → Financeiro

Cada entidade carrega o ID da entidade anterior para rastreabilidade.

## Módulos Implementados (16)

- auth          — Autenticação Supabase
- users         — Usuários do sistema
- company       — Configurações da empresa
- system        — RBAC, auditoria, logs, sessões, segurança
- crm           — Leads, atividades, visitas
- projects      — Projetos, tarefas, ordens de produção
- work-orders   — Ordens de serviço
- installations — Instalações em campo
- quotations    — Orçamentos
- financial     — Contas a receber/pagar, fluxo de caixa
- calendar      — Agenda corporativa
- catalog       — Catálogo de serviços
- materials     — Materiais e categorias
- equipments    — Equipamentos e categorias
- teams         — Equipes, membros, produtividade
- dashboard     — Dashboard executivo com indicadores

## Convenções

- Nomes de arquivo: kebab-case
- Exports: named exports (não default)
- Schemas: [nome]Schema + [nome]FormSchema (form = base omitindo id/audit)
- Tipos: [Nome]SchemaType inferido do schema
- IDs: UUID (crypto.randomUUID() em mock)
- Datas: Date (tratado via z.instanceof(Date).or(z.string().pipe(z.coerce.date())))
- Soft delete: deletedAt nullable
- Company isolation: companyId em todas as entidades
- Navegação: configurada em src/config/navigation.ts
- Ícones: centralizados em src/constants/icons.ts

## Segurança

- RBAC centralizado via módulo system (roles + permissões)
- Auditoria via audit_logs
- Sessões gerenciadas via Supabase Auth + tabela de sessões
- Server Actions com validação Zod
- Headers HTTP de segurança (CSP, HSTS, XSS, clickjacking)
- Sanitização de inputs (XSS)
- Rate limiting estrutural
- Validação de variáveis de ambiente

## Observabilidade

- Logger estruturado com requestId e correlationId
- Health Check: GET /api/health
- Performance metrics tracking
- Error tracker

## Testes

- Unitários: Vitest (helpers, validators, masks, utils, hooks, services)
- Integração: CRUD flows, auth flow
- E2E: Playwright (fluxo completo de negócio)
- Cobertura alvo: ≥ 80%
`;

export const DEVELOPMENT_GUIDE = `
## Guia de Desenvolvimento

### Criar um novo módulo

1. Criar diretório em src/modules/[nome]/
2. Adicionar subdiretórios: actions/, components/, hooks/, repository/, schemas/, services/, types/, validators/
3. Criar schemas Zod em schemas/
4. Criar tipos em types/ (re-export dos schemas)
5. Criar constantes/labels em validators/
6. Criar repository (estender classe base ou implementar interface)
7. Criar service (lógica de negócio)
8. Criar hooks (use[Nome])
9. Criar componentes
10. Criar barrel index.ts
11. Adicionar rotas em src/app/app/[nome]/
12. Registrar navegação em src/config/navigation.ts

### Padrões

- **Client Components:** 'use client' no topo
- **Server Actions:** 'use server' no topo
- **Validação:** Sempre usar Zod .parse() ou .safeParse()
- **Hooks:** Estado local com useState + useEffect + useCallback
- **Componentes:** Preferir composição sobre herança
- **Estilo:** Tailwind CSS com cn() para classes condicionais
- **Feedback:** Usar toast do @/components/feedback
- **Ícones:** Importar de @/constants/icons (centralizado)
- **Componentes UI:** Importar de @/components/ui/
- **Componentes compartilhados:** Importar de @/components/feedback/ ou @/components/shared/

### Testes

- Escrever testes unitários em tests/unit/
- Escrever testes de integração em tests/integration/
- Executar: npm run test
- Verificar cobertura: npm run test:coverage
- Cobertura mínima: 80%

### Qualidade

- ESLint: npm run lint (sem erros)
- TypeScript: npm run typecheck (sem erros)
- Build: npm run build (sem erros)
- Formatação: npm run format (Prettier)
`;
