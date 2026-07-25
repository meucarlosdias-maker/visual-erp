# ADR-003: Mock Data Pattern

## Status

**Aceito**

## Contexto

Durante o desenvolvimento inicial do Visual ERP, a equipe precisa iterar rapidamente sobre funcionalidades sem depender de um banco de dados PostgreSQL configurado. As opções consideradas foram:

1. **Mock repositories in-memory** — implementação do Repository Pattern com dados em memória
2. **SQLite em desenvolvimento** — banco de dados real local
3. **Docker Compose com PostgreSQL** — dependência externa
4. **Prisma Studio para seed manual**

## Decisão

Implementar o **Mock Repository Pattern**: cada repositório concreto armazena dados em arrays na memória durante desenvolvimento, implementando a mesma interface `RepositoryBase` que os repositórios reais.

```ts
interface RepositoryBase<T, TCreate, TUpdate> {
  findAll(params?: PaginationInput): Promise<T[] | PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  create(input: TCreate): Promise<T>;
  update(id: string, input: TUpdate): Promise<T>;
  delete(id: string): Promise<boolean>;
  restore(id: string): Promise<T>;
}

class ClientRepository implements RepositoryBase<Client, CreateClientInput, UpdateClientInput> {
  private clients: Client[] = [];

  async findAll(params?: PaginationInput): Promise<Client[]> {
    let filtered = [...this.clients];
    if (params?.search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    return filtered;
  }

  async create(input: CreateClientInput): Promise<Client> {
    const client = { id: crypto.randomUUID(), ...input, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
    this.clients.push(client);
    return client;
  }
}
```

## Consequências

### Positivas

- Desenvolvimento sem dependência de banco de dados
- Testes unitários rápidos e isolados (sem necessidade de mock externo)
- Reset de estado trivial entre testes
- Seed data programática via fixtures
- Transição suave para repositórios reais (mesma interface)

### Negativas

- Dados não persistem entre reinicializações do servidor
- Funcionalidades específicas do banco (JOINs complexos, agregações) precisam ser implementadas manualmente
- Risco de comportamento diferente entre mock e banco real

## Alternativas Consideradas

- **SQLite** foi considerado mas rejeitado porque exigiria manutenção de schema e migrações, além de ser outro provider para manter no Prisma
- **Docker Compose com PostgreSQL** é usado para testes de integração, mas não é ideal para desenvolvimento rápido de features
- **Prisma Studio** não resolve a necessidade de dados mockados e programáticos
