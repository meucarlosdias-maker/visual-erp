# Estrutura de Diretórios

```
visual-erp/
├── apps/                          # Aplicações do monorepo
│   ├── mobile/                    #   Aplicativo mobile
│   ├── portal-cliente/            #   Portal do cliente
│   └── portal-colaborador/        #   Portal do colaborador
│
├── packages/                      # Pacotes compartilhados
│   ├── api/                       #   Cliente HTTP e integrações
│   ├── auth/                      #   Lógica de autenticação
│   ├── config/                    #   Configurações centralizadas
│   ├── types/                     #   Tipos compartilhados
│   ├── ui/                        #   Componentes de UI reutilizáveis
│   └── utils/                     #   Utilitários gerais
│
├── src/                           # Código fonte principal
│   ├── app/                       #   Next.js App Router
│   │   ├── api/                   #     API Routes (REST)
│   │   │   ├── health/            #       Health check
│   │   │   └── v1/                #       API v1
│   │   │       ├── auth/          #         Autenticação
│   │   │       ├── clients/       #         Clientes
│   │   │       ├── crm/           #         CRM
│   │   │       ├── financial/     #         Financeiro
│   │   │       ├── installations/ #         Instalações
│   │   │       ├── production/    #         Produção
│   │   │       ├── projects/      #         Projetos
│   │   │       ├── quotes/        #         Orçamentos
│   │   │       ├── users/         #         Usuários
│   │   │       └── work-orders/   #         Ordens de serviço
│   │   ├── app/                   #     Rotas protegidas
│   │   │   ├── admin/             #       Administração
│   │   │   ├── agenda/            #       Agenda
│   │   │   ├── ai/                #       Inteligência Artificial
│   │   │   ├── builder/           #       Construtor de entidades
│   │   │   ├── catalogo/          #       Catálogo de serviços
│   │   │   ├── comunicacao/       #       Comunicação
│   │   │   ├── configuracoes/     #       Configurações
│   │   │   ├── crm/               #       CRM
│   │   │   ├── dashboard/         #       Dashboard
│   │   │   ├── departamentos/     #       Departamentos
│   │   │   ├── empresa/           #       Empresa
│   │   │   ├── equipamentos/      #       Equipamentos
│   │   │   ├── equipes/           #       Equipes
│   │   │   ├── financeiro/        #       Financeiro
│   │   │   ├── instalacoes/       #       Instalações
│   │   │   ├── integracoes/       #       Integrações
│   │   │   ├── knowledge/         #       Base de conhecimento
│   │   │   ├── materiais/         #       Materiais
│   │   │   ├── orcamentos/        #       Orçamentos
│   │   │   ├── os/                #       Ordens de Serviço
│   │   │   ├── plugins/           #       Plugins
│   │   │   ├── producao/          #       Produção
│   │   │   ├── projetos/          #       Projetos
│   │   │   ├── security/          #       Segurança
│   │   │   ├── system/            #       Sistema
│   │   │   ├── usuarios/          #       Usuários
│   │   │   └── workflows/         #       Workflows
│   │   ├── auth/                  #     Rotas de autenticação
│   │   │   ├── callback/          #       Callback OAuth
│   │   │   ├── login/             #       Login
│   │   │   └── recuperar-senha/   #       Recuperar senha
│   │   ├── platform/              #     Rotas da plataforma SaaS
│   │   │   ├── announcements/     #       Avisos
│   │   │   ├── companies/         #       Empresas
│   │   │   ├── licenses/          #       Licenças
│   │   │   ├── metrics/           #       Métricas
│   │   │   ├── plans/             #       Planos
│   │   │   ├── settings/          #       Configurações
│   │   │   └── users/             #       Usuários
│   │   ├── globals.css            #     Estilos globais
│   │   ├── layout.tsx             #     Layout raiz
│   │   └── page.tsx               #     Página inicial
│   │
│   ├── modules/                   #   Módulos de negócio (29)
│   │   ├── ai/                    #     Inteligência Artificial
│   │   ├── analytics/             #     Analytics
│   │   ├── api/                   #     API Keys
│   │   ├── auth/                  #     Autenticação
│   │   ├── builder/               #     Construtor de entidades
│   │   ├── calendar/              #     Agenda
│   │   ├── catalog/               #     Catálogo
│   │   ├── communication/         #     Comunicação
│   │   ├── company/               #     Empresa
│   │   ├── crm/                   #     CRM
│   │   ├── dashboard/             #     Dashboard
│   │   ├── devops/                #     DevOps
│   │   ├── equipments/            #     Equipamentos
│   │   ├── financial/             #     Financeiro
│   │   ├── installations/         #     Instalações
│   │   ├── jobs/                  #     Jobs
│   │   ├── knowledge/             #     Base de conhecimento
│   │   ├── materials/             #     Materiais
│   │   ├── platform/              #     Plataforma
│   │   ├── plugins/               #     Plugins
│   │   ├── projects/              #     Projetos
│   │   ├── quotations/            #     Orçamentos
│   │   ├── security/              #     Segurança
│   │   ├── system/                #     Sistema
│   │   ├── teams/                 #     Equipes
│   │   ├── tenants/               #     Tenants
│   │   ├── users/                 #     Usuários
│   │   ├── work-orders/           #     Ordens de Serviço
│   │   └── workflows/             #     Workflows
│   │
│   ├── core/                      #   Domínios fundamentais (14)
│   │   ├── ai/                    #     Integração IA
│   │   ├── analytics/             #     Analytics
│   │   ├── audit/                 #     Auditoria
│   │   ├── automation/            #     Automação
│   │   ├── builder/               #     Construtor
│   │   ├── communication/         #     Comunicação
│   │   ├── devops/                #     DevOps
│   │   ├── engines/               #     Motores de cálculo
│   │   │   ├── formula/           #       Motor de fórmulas
│   │   │   └── pricing/           #       Motor de preços
│   │   ├── events/                #     Eventos
│   │   ├── knowledge/             #     Conhecimento
│   │   ├── permissions/           #     Permissões
│   │   ├── platform/              #     Plataforma
│   │   ├── plugins/               #     Plugins
│   │   ├── queue/                 #     Filas
│   │   ├── security/              #     Segurança
│   │   ├── tenant/                #     Multi-tenant
│   │   └── workflow/              #     Workflow
│   │
│   ├── components/                #   Componentes globais
│   │   ├── feedback/              #     Toast, alertas
│   │   ├── forms/                 #     Formulários
│   │   ├── layout/                #     Layout (sidebar, header)
│   │   ├── shared/                #     Compartilhados
│   │   ├── tables/                #     DataTable e utilitários
│   │   └── ui/                    #     primitives (shadcn)
│   │
│   ├── config/                    #   Configurações
│   │   ├── permissions/           #     Permissões por módulo
│   │   ├── index.ts               #     Barrel export
│   │   ├── menus.ts               #     Menus da aplicação
│   │   ├── modules.ts             #     Registro de módulos
│   │   ├── navigation.ts          #     Navegação
│   │   ├── routes.ts              #     Rotas centralizadas
│   │   └── system.ts              #     Configurações de sistema
│   │
│   ├── constants/                 #   Constantes
│   │   ├── colors.ts              #     Cores
│   │   ├── enums.ts               #     Enumerações
│   │   ├── formats.ts             #     Formatos
│   │   ├── icons.ts               #     Ícones
│   │   ├── index.ts               #     Barrel export
│   │   ├── messages.ts            #     Mensagens
│   │   ├── permissions.ts         #     Constantes de permissão
│   │   ├── priorities.ts          #     Prioridades
│   │   ├── roles.ts               #     Roles
│   │   └── status.ts              #     Status
│   │
│   ├── hooks/                     #   Hooks globais
│   │   ├── index.ts               #     Barrel export
│   │   ├── use-confirm.tsx         #     Confirmação
│   │   └── use-debounce.ts        #     Debounce
│   │
│   ├── lib/                       #   Bibliotecas e utilitários
│   │   ├── action-response.ts     #     Padrão de resposta
│   │   ├── api-middleware.ts       #     Middleware de API
│   │   ├── auth-helpers.ts        #     Helpers de autenticação
│   │   ├── backup.ts              #     Backup
│   │   ├── documentation/         #     Gerador de documentação
│   │   ├── errors.ts              #     Classes de erro
│   │   ├── integration/           #     Integrações externas
│   │   ├── logger.ts              #     Logger
│   │   ├── monitoring.ts          #     Monitoramento
│   │   ├── observability.ts       #     Observabilidade
│   │   ├── performance.ts         #     Performance
│   │   ├── prisma.ts              #     Cliente Prisma
│   │   ├── repository-base.ts     #     Classe base de repositório
│   │   ├── security.ts            #     Segurança (sanitize, rate limit)
│   │   ├── service-base.ts        #     Classe base de serviço
│   │   ├── supabase-server.ts     #     Supabase server client
│   │   ├── supabase.ts            #     Supabase browser client
│   │   └── utils.ts               #     Utilitários (cn)
│   │
│   ├── stores/                    #   Estado global (Zustand)
│   │   ├── index.ts               #     Barrel
│   │   └── loading-store.ts       #     Loading state
│   │
│   ├── types/                     #   Tipos globais
│   │   └── index.ts               #     Tipos
│   │
│   ├── utils/                     #   Utilitários
│   │   ├── helpers.ts             #     Helpers
│   │   ├── masks.ts               #     Máscaras de formatação
│   │   └── validators.ts          #     Validadores
│   │
│   ├── generated/                 #   Código gerado
│   │   └── prisma/                #     Prisma Client gerado
│   │       └── models/            #       Modelos tipados (46)
│   │
│   ├── services/                  #   Serviços globais
│   ├── domain/                    #   Domínio (índice)
│   ├── proxy.ts                   #   Proxy server
│   └── styles/                    #   Estilos adicionais
│
├── prisma/                        # Schema Prisma
│   └── schema.prisma              #   46 modelos, enums, índices
│
├── tests/                         # Testes
│   ├── e2e/                       #   Testes end-to-end (Playwright)
│   ├── fixtures/                  #   Fixtures
│   ├── integration/               #   Testes de integração
│   ├── mocks/                     #   Mocks
│   ├── setup/                     #   Setup de testes
│   └── unit/                      #   Testes unitários (Vitest)
│
├── scripts/                       # Scripts auxiliares
├── docs/                          # Documentação
│   ├── adr/                       #   ADRs
│   ├── api/                       #   API
│   ├── architecture/              #   Arquitetura
│   ├── changelog/                 #   Changelog
│   ├── database/                  #   Banco de dados
│   ├── deployment/                #   Deploy
│   ├── developer-guide/           #   Guia do desenvolvedor
│   ├── modules/                   #   Módulos
│   ├── security/                  #   Segurança
│   ├── admin-manual.md            #   Manual do administrador
│   └── user-manual.md             #   Manual do usuário
│
├── public/                        # Arquivos estáticos
│
├── .env.example                   # Variáveis de ambiente (template)
├── .env.development               # Variáveis de dev
├── .env.staging                   # Variáveis de staging
├── .env.production                # Variáveis de produção
├── next.config.ts                 # Configuração Next.js
├── tsconfig.json                  # TypeScript (strict mode)
├── prisma.config.ts               # Configuração Prisma
├── turbo.json                     # Configuração Turborepo
├── pnpm-workspace.yaml            # Workspaces pnpm
├── vitest.config.ts               # Configuração Vitest
├── playwright.config.ts           # Configuração Playwright
├── eslint.config.mjs              # ESLint flat config
├── postcss.config.mjs             # PostCSS config
├── tailwind.config.ts             # Tailwind CSS config
├── components.json                # shadcn/ui config
├── docker-compose.yml             # Docker Compose
├── Dockerfile                     # Dockerfile
└── package.json                   # Dependências e scripts
```
