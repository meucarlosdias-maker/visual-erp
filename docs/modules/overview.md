# Módulos do Visual ERP

## Lista Completa (29 Módulos)

| Módulo | Descrição | Páginas |
|--------|-----------|---------|
| ai | Inteligência Artificial — chat, prompts, provedores | 5 |
| analytics | Analytics e relatórios | 0 |
| api | API externa, webhooks, chaves de API | 5 |
| auth | Autenticação e autorização | 2 |
| builder | No-code builder de entidades e formulários | 5 |
| calendar | Agenda e calendário | 3 |
| catalog | Catálogo de serviços, categorias | 7 |
| communication | Comunicação unificada (omnichannel) | 4 |
| company | Configurações da empresa | 1 |
| crm | CRM — leads, visitas, pipeline | 7 |
| dashboard | Dashboard executivo | 1 |
| devops | Observabilidade e operações | 6 |
| equipments | Cadastro de equipamentos | 3 |
| financial | Financeiro — contas a pagar/receber | 9 |
| installations | Instalações — agendamento, equipes | 6 |
| jobs | Jobs, filas e processamento assíncrono | 4 |
| knowledge | Base de conhecimento e busca semântica | 5 |
| materials | Cadastro de materiais | 3 |
| platform | Administração global Super Admin | 8 |
| plugins | Engine de plugins e marketplace | 3 |
| projects | Projetos e ordens de produção | 4 |
| quotations | Orçamentos | 1 |
| security | Auditoria, compliance e governança | 6 |
| system | Administração do sistema | 13 |
| teams | Equipes, membros e produtividade | 3 |
| tenants | Multiempresa e assinatura | 1 |
| users | Usuários e convites | 1 |
| work-orders | Ordens de serviço | 4 |
| workflows | Automação de workflows | 5 |

## Estrutura Padrão

Cada módulo segue a estrutura:

```
src/modules/<nome>/
├── types/          # Interfaces TypeScript
├── schemas/        # Schemas Zod
├── validators/     # Re-exports e validações
├── repository/     # Acesso a dados (mock ou core wrapper)
├── services/       # Lógica de negócio
├── actions/        # Server Actions
├── hooks/          # React Hooks
├── components/     # Componentes React
└── index.ts        # Barrel exports
```

## Core Domains (14)

Os módulos consomem serviços dos core domains:

- `src/core/ai/` — IA
- `src/core/analytics/` — Analytics
- `src/core/builder/` — Builder
- `src/core/communication/` — Comunicação
- `src/core/devops/` — DevOps/Observabilidade
- `src/core/engines/` — Motores (pricing, formula)
- `src/core/events/` — Event Bus
- `src/core/knowledge/` — Knowledge Base
- `src/core/platform/` — Plataforma
- `src/core/plugins/` — Plugins
- `src/core/queue/` — Filas/Jobs
- `src/core/security/` — Segurança
- `src/core/tenant/` — Multi-tenant
- `src/core/workflow/` — Workflows
