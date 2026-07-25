# ADR-002: Next.js App Router

## Status

**Aceito**

## Contexto

O Visual ERP precisa de um framework React moderno que suporte renderização híbrida (SSR + SSG + CSR), API routes integradas, e suporte a roteamento baseado em arquivos. As opções consideradas foram:

1. **Next.js com App Router** (versão 16)
2. **Next.js com Pages Router** (versão anterior)
3. **Remix**
4. **Vite + React Router**

## Decisão

Utilizar **Next.js 16 com App Router** (`src/app/`).

### Motivos

- **Roteamento baseado em arquivos** com layouts aninhados, loading states e error boundaries nativos
- **Server Components** por padrão, reduzindo JavaScript do lado do cliente
- **Server Actions** como camada de mutação nativa, eliminando necessidade de API routes para operações CRUD no frontend
- **API Routes** para REST API em `/api/v1/`
- **Suporte a React 19** com recursos como `use()` e Server Components
- **Rotas em português** suportadas nativamente (`/app/clientes`, `/app/orcamentos`)
- **Middleware** para proteção de rotas e redirecionamento
- **Layout persistente** entre navegações via `layout.tsx`

## Consequências

### Positivas

- Código mais enxuto com Server Components (menos JavaScript no cliente)
- Server Actions simplificam mutações sem necessidade de bibliotecas adicionais
- Layouts aninhados permitem estrutura de navegação consistente
- Colocação de API routes junto das páginas facilita o desenvolvimento full-stack

### Negativas

- Server Components têm limitações (não podem usar hooks, eventos, etc.)
- Necessidade de entender o modelo mental de Client vs Server Components
- App Router ainda tem diferenças significativas em relação ao Pages Router

## Alternativas Consideradas

- **Pages Router** foi rejeitado por ser legado e não receber novos recursos
- **Remix** foi rejeitado por menor ecossistema e integração com React 19
- **Vite + React Router** foi rejeitado por falta de SSR nativo e API routes integradas
