# Arquitetura do Visual ERP

## Estrutura de Módulos

Cada módulo segue a estrutura padronizada:

```
module/
  actions/       # Server Actions (Next.js)
  components/    # Componentes React
  hooks/         # React Hooks
  repository/    # Acesso a dados (Prisma)
  schemas/       # Schemas Zod
  services/      # Lógica de negócio
  types/         # Types/Interfaces TypeScript
  validators/    # Validações
  index.ts       # Barrel export
```

### Módulos existentes:
- auth, calendar, catalog, company, crm, dashboard
- equipments, financial, installations, materials
- projects, quotations, system, teams, users, work-orders

## Padrões de Código

### Repository Pattern
Todos os repositórios extendem `BaseRepository<T, TCreate, TUpdate>`:
- `findAll(params?)` - Listar com paginação
- `findById(id)` - Buscar por ID
- `findMany(filter)` - Buscar por filtro
- `create(input)` - Criar
- `update(id, input)` - Atualizar
- `delete(id)` - Soft delete (retorna boolean)
- `restore(id)` - Restaurar soft delete

### Service Layer
Todos os serviços extendem `BaseService<T, TCreate, TUpdate, TRepo>`:
- `list(params?)` - Listar
- `get(id)` - Obter por ID (lança NotFoundError se não existir)
- `create(input)` - Criar
- `update(id, input)` - Atualizar
- `delete(id)` - Excluir
- `restore(id)` - Restaurar
- `duplicate(id)` - Duplicar

### Server Actions
Retorno padronizado:
```typescript
{
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}
```

### Hooks
API padronizada: `{ data, loading, error, create, update, delete, restore, duplicate, refetch }`

## Hierarquia de Erros

```
AppError (statusCode, code)
├── ValidationError (400)
├── NotFoundError (404)
├── PermissionError (403)
├── BusinessRuleError (422)
└── InfrastructureError (500)
```

## Logger

Logger único em `@/lib/logger`:
- `logger.info()`, `logger.warn()`, `logger.error()`, `logger.debug()`

## RBAC e Permissões

- Centralizado em `src/config/permissions/`
- Componente `<Can permission="...">` para controle de acesso
- Roles e permissões gerenciadas pelo módulo system

## Banco de Dados

- PostgreSQL via Prisma ORM
- Soft delete padronizado (deletedAt, deletedBy)
- UUIDs como chaves primárias
- companyId como FK em todas as entidades multi-tenant
- Índices compostos em (companyId, deletedAt)

## Configurações Centralizadas

- `src/config/` - Rotas, navegação, menus, permissões, módulos
- `src/constants/` - Enums, status, cores, ícones, mensagens, formatos
- `src/domain/` - Entidades base (BaseEntity, Address, Contact)
- `src/types/` - Tipos genéricos (UUID, PaginationParams, ActionStatus)

## Performance

- React.memo em componentes de lista pesados
- useMemo/useCallback para evitar re-renders desnecessários
- Lazy loading com dynamic imports para rotas pesadas
- Server Components por padrão, Client Components only quando necessário