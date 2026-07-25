# Arquitetura de Módulos

Cada módulo de negócio no Visual ERP segue uma estrutura padronizada de 9 diretórios, garantindo consistência, testabilidade e separação de responsabilidades. Abaixo estão os 29 módulos atuais.

## Estrutura Padrão

```
src/modules/<module-name>/
├── types/            # Interfaces e tipos TypeScript
├── schemas/          # Schemas Zod para validação
├── validators/       # Constantes, labels, cores para status/enums
├── repository/       # Implementação do Repository Pattern
├── services/         # Camada de serviço com regras de negócio
├── actions/          # Server Actions do Next.js
├── hooks/            # React Hooks (TanStack Query wrappers)
├── components/       # Componentes React do módulo
└── index.ts          # Barrel export público
```

### Exemplo — Módulo CRM

```
src/modules/crm/
├── types/
│   └── index.ts              # Lead, LeadActivity, Visit, Measurement
├── schemas/
│   └── index.ts              # leadSchema, visitSchema, activitySchema
├── validators/
│   └── index.ts              # LEAD_STATUS_LABELS, VISIT_STATUS_COLORS
├── repository/
│   ├── lead-repository.ts
│   ├── lead-activity-repository.ts
│   ├── visit-repository.ts
│   └── visit-attachment-repository.ts
├── services/
│   ├── crm-service.ts
│   ├── lead-service.ts
│   ├── activity-service.ts
│   └── visit-service.ts
├── actions/
│   └── crm-actions.ts
├── hooks/
│   ├── use-leads.ts
│   ├── use-lead.ts
│   ├── use-lead-activities.ts
│   └── use-visits.ts
├── components/
│   ├── ActivityTimeline.tsx
│   ├── LeadBadge.tsx
│   ├── LeadDetail.tsx
│   ├── LeadTable.tsx
│   └── VisitCard.tsx
└── index.ts              # Barrel export
```

## Barrel Exports

O `index.ts` de cada módulo expõe apenas o que é público, seguindo o princípio de encapsulamento:

```ts
// src/modules/crm/index.ts
export { leadService } from './services/lead-service';
export { leadRepository } from './repository/lead-repository';
export { useLeads } from './hooks/use-leads';
export { LeadTable } from './components/LeadTable';
export { leadSchema } from './schemas';
export type { Lead } from './types';
```

Os módulos são consumidos pelas páginas em `src/app/` e por outros módulos através desses barrels.

## Mock Repository Pattern

Cada repositório possui uma implementação concreta que, em desenvolvimento, pode operar com dados em memória. Isso permite desenvolvimento rápido sem dependência do banco de dados.

### Contrato Base

```ts
// src/lib/repository-base.ts
export interface RepositoryBase<T, TCreate, TUpdate> {
  findAll(params?: PaginationInput): Promise<T[] | PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  findMany(filter: Partial<T>): Promise<T[]>;
  create(input: TCreate): Promise<T>;
  update(id: string, input: TUpdate): Promise<T>;
  delete(id: string): Promise<boolean>;
  restore(id: string): Promise<T>;
}
```

### Implementação Exemplo

```ts
// src/modules/crm/repository/lead-repository.ts
export class LeadRepository implements RepositoryBase<Lead, CreateLeadInput, UpdateLeadInput> {
  private leads: Lead[] = [];

  async findAll(params?: PaginationInput): Promise<Lead[]> {
    let filtered = [...this.leads];
    if (params?.search) {
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    return filtered;
  }

  async findById(id: string): Promise<Lead | null> {
    return this.leads.find(l => l.id === id) ?? null;
  }

  async create(input: CreateLeadInput): Promise<Lead> {
    const lead: Lead = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.push(lead);
    return lead;
  }
  // ... update, delete, restore
}

export const leadRepository = new LeadRepository();
```

## Server Actions Pattern

As actions do servidor encapsulam operações que podem ser chamadas diretamente de componentes React, utilizando o padrão `ActionResponse`:

```ts
// src/modules/crm/actions/crm-actions.ts
'use server';

import { leadService } from '../services/lead-service';
import { leadFormSchema } from '../schemas';
import type { ActionResponse } from '@/lib/action-response';

export async function createLead(formData: FormData): Promise<ActionResponse> {
  const parsed = leadFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos', errors: parsed.error.flatten().fieldErrors };
  }
  try {
    const lead = await leadService.create(parsed.data);
    return { success: true, message: 'Lead criado com sucesso', data: lead };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}
```

## Service Layer

Cada serviço estende `BaseService` e implementa regras de negócio específicas do módulo:

```ts
// src/modules/crm/services/lead-service.ts
export class LeadService extends BaseService<Lead, CreateLeadInput, UpdateLeadInput, LeadRepository> {
  protected entityName = 'Lead';

  constructor() {
    super(leadRepository);
  }

  async qualify(id: string, temperature: LeadTemperature): Promise<Lead> {
    const lead = await this.get(id);
    if (lead.status === 'converted') {
      throw new BusinessRuleError('Lead já convertido não pode ser requalificado');
    }
    return this.repository.update(id, { temperature } as any);
  }
}

export const leadService = new LeadService();
```

## Lista de Módulos

| Módulo | Descrição |
|---|---|
| ai | Inteligência Artificial (chat, prompts, providers) |
| analytics | Métricas e dashboards |
| api | Gerenciamento de API Keys |
| auth | Autenticação e autorização |
| builder | Construtor de entidades dinâmicas |
| calendar | Agenda e eventos |
| catalog | Catálogo de serviços |
| communication | Comunicação (conversas, templates) |
| company | Gestão da empresa |
| crm | CRM (leads, visitas, atividades) |
| dashboard | Dashboards e widgets |
| devops | Deployments, health checks |
| equipments | Equipamentos e categorias |
| financial | Financeiro (contas a pagar/receber) |
| installations | Instalações e entregas |
| jobs | Job queue e execuções |
| knowledge | Base de conhecimento |
| materials | Materiais e categorias |
| platform | Administração da plataforma SaaS |
| plugins | Sistema de plugins |
| projects | Projetos e tarefas |
| quotations | Orçamentos e itens |
| security | Políticas de segurança |
| system | Sistema (logs, health, backups) |
| teams | Equipes e produtividade |
| tenants | Multi-tenant |
| users | Usuários |
| work-orders | Ordens de serviço |
| workflows | Automação de workflows |
