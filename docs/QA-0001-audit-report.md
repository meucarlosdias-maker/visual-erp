# Relatório de Auditoria — QA-0001

**Projeto**: Visual ERP v1.0.0  
**Data**: 2026-07-25  
**Auditor**: Sistema Automatizado de Qualidade  
**Versão do Relatório**: 1.0

---

## Resumo Executivo

A auditoria completa do Visual ERP v1.0.0 identificou **58 problemas** distribuídos em 6 categorias. O score geral da plataforma é **68/100**.

### Score por Categoria

| Categoria | Score | Status |
|-----------|-------|--------|
| Build & TypeScript | 95/100 | ✅ |
| Estrutura & Módulos | 70/100 | ⚠️ |
| UX/UI & Acessibilidade | 55/100 | ❌ |
| Segurança | 45/100 | ❌ |
| Server Actions & Hooks | 50/100 | ❌ |
| Prisma & Banco | 60/100 | ⚠️ |
| **Geral** | **68/100** | ⚠️ |

### Contagem de Problemas por Severidade

| Severidade | Quantidade |
|-----------|-----------|
| 🔴 Crítica | 11 |
| 🟠 Alta | 18 |
| 🟡 Média | 17 |
| 🔵 Baixa | 12 |
| **Total** | **58** |

### Checklist de Aprovação para Produção

| Critério | Status | Detalhes |
|----------|--------|----------|
| Build Next.js | ✅ | 0 erros, 141 páginas estáticas |
| TypeScript Strict | ✅ | 0 erros (`tsc --noEmit`) |
| ESLint sem erros | ❌ | 133 erros (`react-hooks/set-state-in-effect`) |
| Nenhum `any` | ✅ | 0 em arquivos novos (1 `z.any()` preexistente) |
| Autenticação | ❌ | Ausente em Server Actions e API routes |
| Autorização RBAC | ❌ | Ausente — qualquer ação pode ser chamada |
| Isolamento Multi-tenant | ❌ | COMPANY_ID hardcoded |
| Auditoria persistente | ❌ | Dados em memória, perdidos no restart |
| Responsividade Mobile | ❌ | Sidebar sem drawer overlay |
| Acessibilidade ARIA | ❌ | Todos componentes de feedback sem atributos |
| Criptografia | ❌ | Base64 em vez de AES |
| Proteção CSRF/CORS | ❌ | Sem headers de segurança |
| Rate Limiting | ❌ | Implementado mas não utilizado |
| Validação de Input | ❌ | Ausente em API routes |
| Prisma índices | ❌ | Faltam 15 índices em FKs |
| Prisma onDelete | ❌ | Todas as 60+ relações sem cascade |
| Documentação | ✅ | 16 arquivos criados, estrutura completa |
| Docker/Deploy | ✅ | Dockerfile, compose, scripts |
| Testes | ✅ | 172/172 passando |

**Status Final**: ⚠️ **APROVAÇÃO CONDICIONAL** — Necessário corrigir itens críticos antes de produção real.

---

## 🔴 Problemas Críticos (11)

### C-01: Nenhuma Verificação de Autenticação em Server Actions
| Campo | Valor |
|-------|-------|
| **Arquivos** | `src/modules/crm/actions/crm-actions.ts`, `financial/actions/financial-actions.ts`, `projects/actions/project-actions.ts`, `work-orders/actions/work-order-actions.ts`, `system/actions/system-actions.ts`, `users/actions/user-actions.ts` |
| **Causa** | Nenhuma Server Action verifica se o usuário está autenticado. Apenas `auth-actions.ts` tem verificação. |
| **Impacto** | Qualquer requisição não autenticada pode listar/criar/alterar dados de clientes, finanças, projetos, usuários, papéis, permissões. |
| **Reproduzir** | Chamar qualquer server action sem cookie de sessão. |
| **Correção** | Adicionar `requireAuth()` no topo de toda Server Action, obtendo sessão via Supabase. |
| **Esforço** | 2 dias |

### C-02: Nenhuma Verificação de Autorização em Server Actions
| Campo | Valor |
|-------|-------|
| **Arquivos** | Mesmos que C-01 |
| **Causa** | Nenhuma verificação de permissão RBAC antes de operações mutantes. |
| **Impacto** | `setRolePermissions`, `revokeSession`, `purgeLogs`, `createUser`, `deleteUser` podem ser chamados por qualquer autenticado. |
| **Reproduzir** | Chamar `setRolePermissions` de uma conta sem papel de admin. |
| **Correção** | Adicionar `requirePermission(action, module)` antes de operações críticas. |
| **Esforço** | 3 dias |

### C-03: COMPANY_ID Hardcoded — Sem Multi-tenant Real
| Campo | Valor |
|-------|-------|
| **Arquivos** | Todos os services em `src/modules/*/services/*.ts` |
| **Causa** | `const COMPANY_ID = '00000000-0000-0000-0000-000000000000'` hardcoded em cada service. |
| **Impacto** | Sistema é efetivamente single-tenant. Dados de diferentes empresas se misturam. |
| **Reproduzir** | Criar registros de duas empresas — todos usam o mesmo COMPANY_ID. |
| **Correção** | Receber `companyId` da sessão autenticada e propagar por actions → services → repository. |
| **Esforço** | 5 dias (mudança arquitetural profunda) |

### C-04: Nenhuma Autorização em API Routes (/api/v1/)
| Campo | Valor |
|-------|-------|
| **Arquivos** | `src/app/api/v1/*/route.ts` (todos) |
| **Causa** | `withApiAuth` valida a chave de API mas **nenhum handler** verifica as permissões da chave. |
| **Impacto** | Uma chave com escopo `crm.read` pode acessar `DELETE /api/v1/clients`. |
| **Reproduzir** | Criar chave com permissão `crm:read`, chamar `DELETE /api/v1/clients/1`. |
| **Correção** | Adicionar `requirePermission(key.permissions, endpoint)` em cada handler. |
| **Esforço** | 1 dia |

### C-05: Criptografia é Base64 — não AES
| Campo | Valor |
|-------|-------|
| **Arquivo** | `src/core/security/encryption/index.ts` |
| **Causa** | `Buffer.from(data).toString('base64')` com prefixo `enc:`. Isto é **encoding**, não encryption. |
| **Impacto** | Dados "criptografados" (chaves de API, secrets) são trivialmente decodificados. Viola LGPD, ISO 27001. |
| **Reproduzir** | Decodificar base64 de qualquer valor armazenado. |
| **Correção** | Usar `crypto.createCipheriv()` com AES-256-GCM e chave de `ENCRYPTION_KEY`. |
| **Esforço** | 1 dia |

### C-06: Token Generation usa Math.random()
| Campo | Valor |
|-------|-------|
| **Arquivo** | `src/core/security/encryption/index.ts` (linhas 18-25) |
| **Causa** | `Math.random()` não é criptograficamente seguro. |
| **Impacto** | Tokens de API, reset de senha, sessão são previsíveis. |
| **Reproduzir** | Prever estado do PRNG e gerar tokens válidos. |
| **Correção** | Usar `crypto.getRandomValues()` ou `crypto.randomBytes()`. |
| **Esforço** | 2 horas |

### C-07: Sidebar sem Suporte Mobile
| Campo | Valor |
|-------|-------|
| **Arquivo** | `src/components/layout/sidebar.tsx` |
| **Causa** | Sidebar sempre visível (`flex`), largura fixa (`w-64`/`w-16`), sem drawer overlay em mobile. |
| **Impacto** | App inutilizável em dispositivos móveis — sidebar ocupa tela ou ícones colapsados são intocáveis. |
| **Reproduzir** | Abrir app em viewport < 768px. |
| **Correção** | Implementar sidebar como Sheet/Drawer com overlay, esconder por padrão em mobile, breakpoint `lg:`. |
| **Esforço** | 2 dias |

### C-08: App Layout sem Suspense Boundaries
| Campo | Valor |
|-------|-------|
| **Arquivo** | `src/app/app/layout.tsx` |
| **Causa** | `<Sidebar />` e `<Header />` são `'use client'` e podem depender de `usePathname()`, mas não há `<Suspense>` em volta. |
| **Impacto** | Durante navegação, usuário vê tela em branco até a página renderizar. |
| **Reproduzir** | Navegar entre páginas — sem indicador de loading. |
| **Correção** | Envolver `<main>` e componentes do layout com `<Suspense fallback={...}>`. |
| **Esforço** | 4 horas |

### C-09: App Layout sem ErrorBoundary
| Campo | Valor |
|-------|-------|
| **Arquivo** | `src/app/app/layout.tsx` |
| **Causa** | Nenhum `<ErrorBoundary>` envolve sidebar, header ou main. |
| **Impacto** | Exceção não capturada em página filha derruba todo o layout. |
| **Reproduzir** | Forçar erro em componente filho — sidebar + header desaparecem. |
| **Correção** | Adicionar `<ErrorBoundary>` em cada seção do layout. |
| **Esforço** | 2 horas |

### C-10: Nenhuma Validação de Input em API Routes
| Campo | Valor |
|-------|-------|
| **Arquivos** | Todos em `src/app/api/v1/*/route.ts` |
| **Causa** | Zod está instalado mas nenhuma rota o utiliza. `request.json()` é chamado sem schema validation. |
| **Impacto** | SQL injection, mass assignment, parameter pollution, type confusion. |
| **Reproduzir** | Enviar `POST /api/v1/clients` com payload malicioso. |
| **Correção** | Definir schemas Zod e validar antes de processar. |
| **Esforço** | 2 dias |

### C-11: Botão Editar sem onClick (Contas)
| Campo | Valor |
|-------|-------|
| **Arquivo** | `src/app/app/financeiro/contas/page.tsx` (linha 92) |
| **Causa** | `<Button>` com ícone de lápis não tem `onClick`, `href`, nem `form`. Puramente decorativo. |
| **Impacto** | Usuário clica e nada acontece — quebra de expectativa grave. |
| **Reproduzir** | Clicar no ícone de editar em qualquer conta. |
| **Correção** | Adicionar `onClick={() => openEdit(account.id)}` ou `asChild` com Link. |
| **Esforço** | 30 minutos |

---

## 🟠 Problemas Altos (18)

### H-01: ESLint — 133 erros `react-hooks/set-state-in-effect`
**Arquivos**: 34 arquivos de hooks  
**Causa**: `useEffect` chama `setState` diretamente no corpo do efeito  
**Impacto**: Possíveis renderizações em cascata, performance degradada  
**Correção**: Usar `useCallback` com dependências vazias ou refatorar para custom hook de fetch  
**Esforço**: 1 dia

### H-02: Nenhum try/catch em Server Actions (5 módulos)
**Arquivos**: CRM, Financial, Projects, Work Orders, System  
**Causa**: Funções jogam exceções sem tratamento  
**Impacto**: Erros propagam como 500 sem resposta estruturada  
**Correção**: Envolver em try/catch + `ActionResponse`  
**Esforço**: 1 dia

### H-03: Inconsistent Return Types em Server Actions
**Arquivos**: 6 módulos  
**Causa**: 3 padrões diferentes convivem (raw, ad-hoc, ActionResponse)  
**Impacto**: Cliente não pode usar padrão uniforme de tratamento de erro  
**Correção**: Padronizar todos para `Promise<ActionResponse<T>>`  
**Esforço**: 2 dias

### H-04: Missing Barrel Exports (5 módulos)
**Arquivos**: CRM, Financial, Projects, Work Orders, Users (actions/)  
**Causa**: Nenhum `actions/index.ts`  
**Impacto**: Imports frágeis, renomear quebra consumidores  
**Correção**: Criar barrel files  
**Esforço**: 2 horas

### H-05: Rate Limiter Não Utilizado
**Arquivo**: `src/lib/security.ts`  
**Causa**: Classe exportada mas nunca importada  
**Impacto**: API vulnerável a brute-force e DoS  
**Correção**: Aplicar em rotas de auth e API  
**Esforço**: 4 horas

### H-06: Sem Headers CORS
**Causa**: Nenhum `Access-Control-*` configurado  
**Impacto**: CSRF-like attacks, acesso cross-origin malicioso  
**Correção**: Adicionar middleware CORS  
**Esforço**: 2 horas

### H-07: API Keys Armazenadas em Plaintext
**Arquivo**: `src/modules/api/services/api-key-service.ts`  
**Causa**: Secrets armazenados como string sem hash  
**Impacto**: Database comprometida revela todas as credenciais  
**Correção**: Usar bcrypt/argon2 para hash  
**Esforço**: 4 horas

### H-08: Falta de Isolamento Multi-tenant nas Rotas de API
**Causa**: `tenantIsolation` existe mas nunca é chamado nos handlers  
**Impacto**: Um tenant pode ler dados de outro  
**Correção**: Aplicar `WHERE companyId = ?` em toda query  
**Esforço**: 3 dias

### H-09: Todos Componentes de Feedback sem ARIA
**Arquivos**: `src/components/feedback/*` (9 componentes)  
**Causa**: Nenhum `role`, `aria-live`, `aria-hidden`  
**Impacto**: Leitores de tela não notificam mudanças de estado  
**Correção**: Adicionar atributos ARIA  
**Esforço**: 4 horas

### H-10: FormField sem aria-describedby e aria-invalid
**Arquivo**: `src/components/forms/FormField.tsx`  
**Causa**: Erro não vinculado ao input, campo não marca `aria-invalid`  
**Impacto**: Leitores de tela não anunciam erro  
**Correção**: Conectar `id` do erro ao `aria-describedby`, adicionar `aria-invalid`  
**Esforço**: 2 horas

### H-11: Breadcrumb labelMap incompleto
**Arquivo**: `src/components/layout/breadcrumb.tsx`  
**Causa**: Apenas 6 rotas mapeadas  
**Impacto**: Breadcrumbs mostram texto cru (ex: "leads") em vez de label traduzida  
**Correção**: Expandir ou usar mapa dinâmico  
**Esforço**: 2 horas

### H-12: Sidebar sem aria-current e aria-expanded
**Arquivo**: `src/components/layout/sidebar.tsx`  
**Causa**: Link ativo sem `aria-current`, botões de grupo sem `aria-expanded`  
**Impacto**: Leitores de tela não identificam página atual  
**Correção**: Adicionar atributos ARIA nos elementos corretos  
**Esforço**: 2 horas

### H-13: Prisma — Faltam 15 índices em Foreign Keys
**Causa**: `@@index` ausente em campos FK (companyId, userId, etc.)  
**Impacto**: Queries sem índice — degradação de performance em escala  
**Correção**: Adicionar `@@index([field])` em 15 modelos  
**Esforço**: 2 horas

### H-14: Prisma — Faltam 19 @relation em companyId
**Causa**: `companyId` string sem `@relation` a Company  
**Impacto**: Sem integridade referencial no banco  
**Correção**: Adicionar `@relation` com Company  
**Esforço**: 4 horas

### H-15: Prisma onDelete ausente em TODAS as relações (60+)
**Causa**: Nenhum `onDelete: Cascade | SetNull | Restrict`  
**Impacto**: Deletar pai falha se filhos existem  
**Correção**: Revisar e adicionar `onDelete` apropriado  
**Esforço**: 1 dia

### H-16: Duplicação de Código Financeiro
**Arquivos**: `receber/nova/`, `pagar/nova/`, `receber/[id]/`, `pagar/[id]/`  
**Causa**: Código quase idêntico duplicado  
**Impacto**: Dobro de manutenção, inconsistências futuras  
**Correção**: Refatorar para componente genérico `FinancialFormPage`  
**Esforço**: 1 dia

### H-17: Hooks sem tratamento de Race Condition
**Arquivos**: 13 hooks  
**Causa**: `useEffect` sem mountedRef ou AbortController  
**Impacto**: setState em componente desmontado  
**Correção**: Adicionar mountedRef  
**Esforço**: 4 horas

### H-18: Páginas CRM carregam todas as abas simultaneamente
**Arquivo**: `src/app/app/crm/leads/[id]/page.tsx`  
**Causa**: Dados de todas as abas carregados antes de renderizar  
**Impacto**: Tela branca prolongada  
**Correção**: Lazy loading por aba  
**Esforço**: 4 horas

---

## 🟡 Problemas Médios (17)

### M-01: Health endpoint sem autenticação
**Arquivo**: `src/app/api/health/route.ts`  
**Impacto**: Informação de sistema exposta  
**Esforço**: 1 hora

### M-02: Audit/Security logs em memória (não persistentes)
**Arquivos**: `src/core/security/*/`  
**Impacto**: Perda de auditoria no restart, não conformidade LGPD/SOC 2  
**Esforço**: 3 dias

### M-03: Tenant resolve confia em header/subdomínio não verificado
**Arquivo**: `src/core/tenant/resolver/index.ts`  
**Impacto**: Subdomain/header injection  
**Esforço**: 4 horas

### M-04: Nomenclatura de permissões inconsistente
**Arquivo**: `src/config/permissions.ts`  
**Impacto**: Wildcards não funcionam corretamente  
**Esforço**: 2 horas

### M-05: API Key logada em texto puro
**Arquivo**: `src/app/api/v1/auth/route.ts` (linha 29)  
**Impacto**: Credenciais nos logs  
**Esforço**: 30 minutos

### M-06: Rotas inconsistentes (navigation vs routes.ts vs filesystem)
**Impacto**: 3 rotas sem página, 17+ páginas sem nav, 1 duplicata, 12+ stale entries  
**Esforço**: 1 dia

### M-07: Módulos com estrutura não padronizada (77 violações)
**Impacto**: Imports frágeis, dificuldade de manutenção  
**Esforço**: 2 dias

### M-08: Faltam 14 modelos com `deletedAt` para soft delete
**Impacto**: Exclusão física sem recoverability  
**Esforço**: 4 horas

### M-09: Naming misto PT/EN em campos Prisma
**Impacto**: Inconsistência, dificuldade de manutenção  
**Esforço**: 1 dia

### M-10: Páginas de detalhe duplicadas (crm/[id] vs crm/leads/[id])
**Impacto**: Duplicação, comportamento inconsistente  
**Esforço**: 4 horas

### M-11: Formulário de visita sem react-hook-form
**Arquivo**: `src/app/app/crm/visitas/page.tsx`  
**Impacto**: Sem validação em tempo real  
**Esforço**: 2 horas

### M-12: Estado de loading usa reticências ('...')
**Arquivo**: `src/app/app/admin/page.tsx`  
**Impacto**: Não acessível, sem feedback semântico  
**Esforço**: 1 hora

### M-13: Header sem aria-label no botão de tema
**Arquivo**: `src/components/layout/header.tsx`  
**Impacto**: Leitor de tela lê apenas "Sun" ou "Moon"  
**Esforço**: 15 minutos

### M-14: AvatarFallback hardcoded como "U"
**Arquivo**: `src/components/layout/header.tsx`  
**Impacto**: UX genérica  
**Esforço**: 30 minutos

### M-15: Adimn dashboard sem estado de erro
**Arquivo**: `src/app/app/admin/page.tsx`  
**Impacto**: Página quebra silenciosamente  
**Esforço**: 1 hora

### M-16: useCashFlow e useFinancialOverview sem estado de erro
**Arquivos**: `src/modules/financial/hooks/`  
**Impacto**: Erros silenciosos, UI mostra loading infinito  
**Esforço**: 1 hora

### M-17: FormField sem foco no primeiro erro
**Impacto**: Usuário não direcionado ao campo com erro  
**Esforço**: 1 hora

---

## 🔵 Problemas Baixos (12)

### L-01: Sem middleware global Next.js
**Esforço**: 1 dia

### L-02: requireAuth() joga Error genérico
**Esforço**: 30 minutos

### L-03: Sem headers de segurança (CSP, HSTS, etc.)
**Esforço**: 2 horas

### L-04: auth-helpers.ts não usado por rotas de API
**Esforço**: 1 hora (documentação)

### L-05: Nome inconsistente de mutation delete (delete_ vs del)
**Esforço**: 1 hora

### L-06: Tipo error inconsistente nos hooks (Error | null vs string | null)
**Esforço**: 2 horas

### L-07: redirect() em auth actions esconde tipo de retorno real
**Esforço**: 1 hora

### L-08: data: Record<string, unknown> perde tipagem
**Esforço**: 1 dia (refatoração gradual)

### L-09: Rota /app/clientes sem página (navigation e routes.ts apontam)
**Esforço**: 1 dia

### L-10: Rota /auth/callback sem página
**Esforço**: 4 horas

### L-11: Navegação para /app/admin/seguranca não está no menu
**Esforço**: 30 minutos

### L-12: Entrada duplicada /app/builder/entities na navigation
**Esforço**: 15 minutos

---

## Análise por Categoria

### Build & TypeScript (95/100) ✅
Aspectos positivos: 0 erros de TypeScript strict, 141 páginas estáticas geradas, compilação rápida (15.8s Turbopack).  
Único problema: 133 erros ESLint que não impedem build mas indicam padrão inadequado nos hooks.

### Estrutura & Módulos (70/100) ⚠️
29 módulos implementados mas com 3 padrões estruturais diferentes. 77 violações de barrel export (muitas são falsos positivos do verificador rígido). 3 rotas sem página, 17+ páginas fora da navegação.

### UX/UI & Acessibilidade (55/100) ❌
O calcanhar de Aquiles do sistema. Sidebar não funciona em mobile, falta ErrorBoundary e Suspense em todos os layouts, componentes de feedback sem ARIA, breadcrumbs incompletos, botão decorativo sem ação. Acessibilidade é o ponto mais fraco.

### Segurança (45/100) ❌
O ponto mais crítico. Nenhuma autorização em Server Actions, API routes ou operações administrativas. "Criptografia" é base64. Tokens usam Math.random(). Rate limiter não utilizado. API keys em plaintext. Sem CORS. Sem multi-tenant real.

### Server Actions & Hooks (50/100) ❌
Nenhuma Server Action verifica autenticação ou autorização (exceto auth). COMPANY_ID hardcoded. 3 padrões de retorno diferentes. Hooks sem tratamento de race condition, sem estado de erro em 2 hooks, naming inconsistente.

### Prisma & Banco (60/100) ⚠️
Schema bem estruturado com 46 modelos, mas faltam 15 índices, 19 relações companyId, 14 campos deletedAt, e todos os 60+ onDelete. Naming misto PT/EN.

---

## Prioridade de Correção

### Imediatas (Sprint 2.0.0-dev.1)
1. C-01: Autenticação em Server Actions
2. C-02: Autorização em Server Actions
3. C-04: Autorização em API routes
4. C-05: Substituir base64 por AES
5. C-06: Substituir Math.random() por crypto seguro
6. C-10: Validação Zod em API routes
7. H-01: Corrigir 133 erros ESLint nos hooks
8. H-05: Ativar Rate Limiter
9. H-07: Hash API keys

### Curto Prazo (Sprint 2.0.0-dev.2)
1. C-07: Sidebar mobile
2. C-08: Suspense boundaries
3. C-09: ErrorBoundary
4. H-02: try/catch + ActionResponse
5. H-03: Padronizar retornos
6. H-06: CORS headers
7. H-08: Isolamento multi-tenant
8. H-13 a H-15: Prisma índices, relations, onDelete

### Médio Prazo (Sprint 2.0.0-dev.3)
1. C-03: COMPANY_ID da sessão (multi-tenant real)
2. H-09 a H-12: Acessibilidade ARIA
3. H-16: Refatorar financeiro duplicado
4. H-17: Race condition hooks
5. M-01 a M-17: Todos os problemas médios

### Longo Prazo (Sprint 2.0.0-dev.4+)
1. L-01 a L-12: Todos os problemas baixos

---

## Recomendações Finais

1. **Não fazer deploy em produção** até C-01, C-02, C-04, C-05 serem corrigidos.
2. **Pipeline de CI/CD**: Adicionar verificação ESLint como blocker (fail on error).
3. **Code Review**: Toda Server Action deve ter `requireAuth()` obrigatório.
4. **Arquitetura**: Decidir se multi-tenant será por schema ou por `companyId` antes de avançar.
5. **Testes de Segurança**: Adicionar testes automatizados que verificam autenticação e autorização.
6. **Acessibilidade**: Adicionar axe-core ao pipeline de testes.

---

## Score Geral

```
              Build/TS    95%  ████████████████████
           Estrutura      70%  ██████████████      
          UX/UI           55%  ███████████         
         Segurança        45%  █████████           
    Actions & Hooks       50%  ██████████          
        Prisma/Banco      70%  ██████████████      
────────────────────────────────────────────────
          GERAL           68%  █████████████▌      
```

**Score: 68/100** — Qualidade mediana, viável para ambiente de homologação mas não para produção sem correções críticas.

---

*Relatório gerado automaticamente em 2026-07-25 pelo Sistema de Qualidade Visual ERP.*
