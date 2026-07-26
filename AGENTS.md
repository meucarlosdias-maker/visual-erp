<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Estado Atual do Projeto — Visual ERP v2.0.0 (em correção)

## Resumo
Última atividade: correção de ~40 bugs críticos/altos/médios identificados nas auditorias QA-0001 e QA-0002.
Pontos de partida: QA-0001 (58 issues, score 68/100), QA-0002 (127 testes, score 54%).
Prioridade: segurança > navegação > bugs funcionais > perf/UX.

## Correções Realizadas
- SEC-002: Middleware de autenticação via `src/proxy.ts` (Next.js 16 proxy convention)
- FND-003: Página `/auth/atualizar-senha` criada
- FND-005: Proxy integrado ao middleware
- CRM-005: Soft delete implementado (campo `deletedAt` + middleware Prisma)
- SEC-001: Componente `<Can>` corrigido para usar permissões reais via `getUserPermissions()`
- COMM-002: Variáveis dinâmicas em templates de email processadas corretamente
- PRF-002: 133 erros ESLint `set-state-in-effect` corrigidos
- USR-001: Rotas de usuário padronizadas, removida duplicata `/app/system/users`
- SEC-004: Tokens de sessão migrados de `Math.random()` para `crypto.randomUUID()`
- SEC-003: Criptografia migrada de base64 para AES-256-GCM via Web Crypto API
- PRF-001: Suspense boundaries e ErrorBoundary adicionados aos layouts
- CONF-003: Teste de conexão SMTP corrigido
- COMM-001: Notificações em tempo real via WebSocket (API route + Server-Sent Events)
- AGD-003: Drag-and-drop no calendário preserva horário
- CRM-002: Drag-and-drop do pipeline persiste no servidor
- OS-002: Duplicação de itens na OS corrigida (ID único gerado corretamente)
- FIN-003: Duplo registro no fluxo de caixa corrigido
- IA-001: Chat IA com persistência de histórico
- PUT-001 a PUT-005: 5 páginas de navegação criadas (Clientes, Estoque, Vendas, Compras, Fiscal)
- CON-001: Sidebar reflete mudanças de configuração reativamente
- EMP-001: Troca de empresa atualiza dados sem refresh
- EMP-002: Isolamento multiempresa via validação em Server Actions
- DB-001: Índices e integridade referencial no Prisma schema
- API-001: API routes implementadas com validação
- API-002: Webhooks migrados para Web Crypto API
- SEC-005: Rate limiter aplicado a rotas de autenticação
- SEC-006: Headers de segurança configurados no next.config
- DB-002: 15 índices adicionados ao Prisma schema
- FND-009: Sidebar responsiva para mobile implementada
- PRJ-003: Transição de status de tarefas corrigida
- CRM-001: Conflito de rotas dinâmicas corrigido
- COMP-003: Validação server-side em todas as Server Actions
- FND-006: Página /auth/atualizar-senha funcional
- INS-002: Verificação de conflito de horário em agendamentos
- PRD-003: Validação de horas excedentes em apontamentos
- FIN-004: Importação de extrato bancário implementada (estrutura inicial)
- API-003: API keys armazenadas com hash (bcrypt-like)
- CRM-007: Atividades do lead carregando corretamente
- MTN-001: Separação Platform/Company — Prisma schema, enums, roles, permissions, auth, middleware, layouts, sidebars, navegação
- BUILD-001: `export const dynamic = 'force-dynamic'` no layout `/app` para resolver erro de prerender no Turbopack/webpack

## Build & Test
- `npm run build` — build local (usa Turbopack por padrão)
- `npm test` — vitest (166 testes)
- `npx vercel list` — verificar status do deploy na Vercel
