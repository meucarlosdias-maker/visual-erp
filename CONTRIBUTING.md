# Contribuindo com o Visual ERP

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL (via Supabase local ou remoto)
- Editor: VS Code (recomendado)

## Setup

```bash
git clone <repo-url> visual-erp
cd visual-erp
npm install
cp .env.example .env.local
npm run db:generate
npm run db:push
npm run dev
```

## Padrões de Código

| Item | Padrão |
|------|--------|
| Commits | Semânticos: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` |
| Arquivos | `kebab-case` |
| Funções/Variáveis | `camelCase` |
| Componentes/Tipos | `PascalCase` |
| Exports | Named exports (evitar `default`) |
| Validação | Zod v4 em todos os inputs (`safeParse`) |
| Estilo | Tailwind CSS + `cn()` utility |
| Estado | `useState` + `useEffect` + `useCallback` |

## Estrutura de Módulos

```
src/modules/[nome]/
  actions/     — Server Actions
  components/  — React components
  hooks/       — Custom hooks (use[Nome])
  repository/  — Acesso a dados
  schemas/     — Zod schemas
  services/    — Lógica de negócio
  types/       — Re-export de tipos
  validators/  — Constantes e labels
  index.ts     — Barrel export
```

## Testes

```bash
# Unitários + Integração
npm run test

# Com cobertura
npm run test:coverage

# E2E (Playwright)
npm run test:e2e
```

Cobertura mínima: **75%** nas bibliotecas core.

## Qualidade

```bash
npm run lint       # ESLint — zero erros
npm run typecheck  # TypeScript — zero erros
npm run build      # Build — zero erros
npm run format     # Prettier
```

## Fluxo de PR

1. Crie um branch a partir de `main`: `git checkout -b feature/nome`
2. Faça suas alterações seguindo os padrões
3. Execute qualidade: `npm run lint && npm run typecheck`
4. Execute testes: `npm run test`
5. Commit: `git commit -m "feat: descrição do que foi feito"`
6. Push: `git push origin feature/nome`
7. Abra Pull Request no GitHub

## Documentação

Sempre atualize os documentos relevantes ao fazer mudanças:

- `CHANGELOG.md` — Adicione entry na seção `[Unreleased]`
- `README.md` — Se mudar scripts, módulos ou setup
- `docs/` — Manual do admin/usuário se mudar fluxos

## Segurança

- Nunca commite secrets, tokens ou `.env`
- Nunca use `console.log` em produção
- Sempre sanitize inputs de usuário
- Sempre valide com Zod antes de persistir

## Dúvidas?

Abra uma issue no GitHub ou consulte a documentação em `/docs/`.
