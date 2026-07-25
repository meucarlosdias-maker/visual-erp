# API REST

## Visão Geral

O Visual ERP expõe uma API REST versionada em `/api/v1/`. A autenticação pode ser feita via API Keys (para integrações) ou via sessão Supabase (para o frontend). Todas as respostas seguem um formato padronizado com código de status HTTP apropriado.

## Endpoints Disponíveis

### Autenticação — `/api/v1/auth`

| Método | Descrição |
|---|---|
| POST | Login, registro e refresh de sessão |

### Clientes — `/api/v1/clients`

| Método | Descrição |
|---|---|
| GET | Listar clientes (com paginação, filtro e ordenação) |
| POST | Criar novo cliente |
| GET `/[id]` | Obter cliente por ID |
| PATCH `/[id]` | Atualizar cliente |
| DELETE `/[id]` | Excluir cliente (soft delete) |

### CRM — `/api/v1/crm`

Recursos para leads, atividades e visitas técnicas.

### Projetos — `/api/v1/projects`

Recursos para CRUD de projetos e suas tarefas.

### Produção — `/api/v1/production`

Ordens de produção vinculadas a projetos.

### Orçamentos — `/api/v1/quotes`

Orçamentos com itens, versionamento e aprovação.

### Financeiro — `/api/v1/financial`

Contas a pagar, receber e fluxo de caixa.

### Usuários — `/api/v1/users`

Gestão de usuários da empresa.

### Ordens de Serviço — `/api/v1/work-orders`

Ordens de serviço operacionais.

### Instalações — `/api/v1/installations`

Agenda e execução de instalações.

## Autenticação de API

Para integrações externas, utiliza-se API Key + Signature:

```ts
// Header: X-API-Key + X-Signature
const response = await fetch('/api/v1/clients', {
  headers: {
    'X-API-Key': 'chave_api',
    'X-Signature': 'hash_hmac',
  },
});
```

A validação é feita via `withApiAuth` middleware:

```ts
export function withApiAuth(handler: ApiHandler) {
  return async (request: NextRequest) => {
    const apiKey = request.headers.get('X-API-Key');
    const signature = request.headers.get('X-Signature');
    const key = await apiKeyService.validateKey(apiKey, signature);
    if (!key) {
      return NextResponse.json({ success: false, message: 'Nao autorizado' }, { status: 401 });
    }
    const response = await handler(request, { id: key.id, permissions: key.permissions });
    await apiLogService.create({ apiKeyId: key.id, endpoint, method, statusCode, responseTime, ip });
    return response;
  };
}
```

## Padrão de Respostas

### Sucesso

```json
{
  "success": true,
  "message": "Operacao realizada com sucesso",
  "data": { ... }
}
```

### Erro

```json
{
  "success": false,
  "message": "Recurso nao encontrado",
  "code": "NOT_FOUND"
}
```

### Erro de Validação

```json
{
  "success": false,
  "message": "Dados invalidos",
  "code": "VALIDATION_ERROR",
  "fieldErrors": {
    "name": "Nome eh obrigatorio"
  }
}
```

### Paginação

```json
{
  "success": true,
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## Códigos de Status

| Código | Significado |
|---|---|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Erro de validação |
| 401 | Não autorizado |
| 403 | Acesso negado (permissão) |
| 404 | Recurso não encontrado |
| 422 | Regra de negócio violada |
| 500 | Erro interno |

## Paginação, Filtro e Ordenação

```ts
interface PaginationInput {
  page?: number;       // Padrão: 1
  limit?: number;      // Padrão: 20, Máximo: 100
  search?: string;     // Busca textual
  sortBy?: string;     // Campo para ordenação
  sortOrder?: 'asc' | 'desc';  // Padrão: asc
}
```

### Convenções

- **Busca**: parâmetro `search` busca em campos de texto (nome, código, email)
- **Filtros**: parâmetros adicionais por campo (`status=active`, `categoryId=xxx`)
- **Ordenação**: `sortBy` com nome do campo, `sortOrder` opcional
- **Soft delete**: registros com `deletedAt` preenchido são excluídos das listagens padrão

## Erros Padronizados

```ts
class AppError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {}
}
class NotFoundError extends AppError    { /* 404 */ }
class ValidationError extends AppError  { /* 400 */ }
class PermissionError extends AppError  { /* 403 */ }
class BusinessRuleError extends AppError { /* 422 */ }
```

## Rate Limiting

A API possui rate limiting por chave de API:

```ts
const rateLimiter = new RateLimiter(10, 60000); // 10 requisições por minuto
```
