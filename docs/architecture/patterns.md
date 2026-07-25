# Padrões de Design

## Repository Pattern

Abstrai o acesso a dados, permitindo trocar a implementação (mock vs real) sem impacto no resto da aplicação.

```ts
// Contrato genérico
interface RepositoryBase<T, TCreate, TUpdate> {
  findAll(params?: PaginationInput): Promise<T[] | PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  create(input: TCreate): Promise<T>;
  update(id: string, input: TUpdate): Promise<T>;
  delete(id: string): Promise<boolean>;
  restore(id: string): Promise<T>;
}

// Implementação concreta
class ClientRepository implements RepositoryBase<Client, CreateClientInput, UpdateClientInput> {
  private store: Client[] = [];

  async findAll(params?: PaginationInput) {
    let data = [...this.store];
    if (params?.search) {
      data = data.filter(c => c.name.toLowerCase().includes(params.search!.toLowerCase()));
    }
    return data;
  }
}

export const clientRepository = new ClientRepository();
```

## Service Layer

Centraliza regras de negócio, mantendo os repositórios focados apenas em persistência.

```ts
abstract class BaseService<T, TCreate, TUpdate, TRepo> {
  constructor(protected repository: TRepo) {}
  protected abstract entityName: string;

  async get(id: string): Promise<T> {
    const repo = this.repository as { findById: (id: string) => Promise<T | null> };
    const entity = await repo.findById(id);
    if (!entity) throw new NotFoundError(this.entityName, id);
    return entity;
  }
}

class ClientService extends BaseService<Client, CreateClientInput, UpdateClientInput, ClientRepository> {
  protected entityName = 'Cliente';

  async activate(id: string): Promise<Client> {
    const client = await this.get(id);
    if (client.active) throw new BusinessRuleError('Cliente já está ativo');
    return this.repository.update(id, { active: true } as any);
  }
}
```

## Server Actions

Funções executadas no servidor que podem ser chamadas diretamente de componentes React. Seguem o padrão `ActionResponse` para feedback consistente.

```ts
// Definição do padrão de resposta
interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

// Server action
'use server';
import { z } from 'zod';

const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  document: z.string().optional(),
});

export async function createClient(formData: FormData): Promise<ActionResponse> {
  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos', errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const client = await clientService.create(parsed.data);
    return { success: true, message: 'Cliente criado com sucesso', data: client };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}
```

## Custom Hooks

Wrappers sobre TanStack Query que encapsulam o data fetching e mutations, fornecendo uma API limpa para os componentes.

```ts
// Hook para listagem
export function useClients(params?: PaginationInput) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.list(params),
  });
}

// Hook para mutation
export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientInput) => clientService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
}
```

## Component Composition

Componentes compostos a partir de primitives do shadcn/ui, seguindo o padrão de composição do React.

```tsx
// Exemplo de composição de DataTable
<DataTable
  columns={columns}
  data={data}
  toolbar={<DataTableToolbar filters={filters} />}
  pagination={<DataTablePagination page={page} total={total} />}
/>
```

## Barrel Exports

Cada módulo expõe sua API pública através de um arquivo `index.ts` centralizador.

```ts
// src/modules/crm/index.ts
export { leadService } from './services/lead-service';
export { leadRepository } from './repository/lead-repository';
export { useLeads } from './hooks/use-leads';
export { LeadTable } from './components/LeadTable';
export { leadSchema } from './schemas';
export type { Lead } from './types';
```

## Error Handling Pattern

Hierarquia de erros consistente para toda a aplicação.

```ts
class AppError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {}
}

class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} ${id} não encontrado` : `${entity} não encontrado`, 404, 'NOT_FOUND');
  }
}

class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_RULE');
  }
}

class PermissionError extends AppError {
  constructor(message = 'Acesso não autorizado') {
    super(message, 403, 'PERMISSION_DENIED');
  }
}
```

## Resumo

| Padrão | Propósito | Localização |
|---|---|---|
| Repository | Abstração de persistência | `src/lib/repository-base.ts` |
| Service Layer | Regras de negócio | `src/lib/service-base.ts` |
| Server Actions | Mutação no servidor | `src/modules/*/actions/` |
| Custom Hooks | Data fetching | `src/modules/*/hooks/` |
| Component Composition | UI reutilizável | `src/components/` |
| Barrel Exports | Encapsulamento | `src/modules/*/index.ts` |
| Error Hierarchy | Tratamento de erros | `src/lib/errors.ts` |
