# Padrões de Codificação

## TypeScript

### Strict Mode

O `tsconfig.json` possui `strict: true`, habilitando todas as verificações rigorosas do TypeScript.

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Proibido o Uso de `any`

```ts
// ❌ Incorreto
function process(data: any) { ... }

// ✅ Correto
function process<T>(data: T): T { ... }
function process(data: unknown) { ... }
```

### Tipagem Explícita em Público

```ts
// ✅ Interfaces exportadas
export interface CreateClientInput {
  name: string;
  document?: string;
}

// ✅ Tipos de retorno explícitos
async function listClients(): Promise<Client[]> { ... }
```

## Naming Conventions

| Elemento | Convenção | Exemplo |
|---|---|---|
| Componentes | PascalCase | `LeadTable.tsx`, `DataTable.tsx` |
| Funções | camelCase | `createClient()`, `handleSubmit()` |
| Arquivos | kebab-case | `lead-repository.ts`, `crm-actions.ts` |
| Diretórios | kebab-case | `work-orders/`, `data-table/` |
| Interfaces | PascalCase | `Client`, `CreateClientInput` |
| Types | PascalCase | `LeadStatus`, `Permission` |
| Enums | PascalCase | `UserRole`, `ProjectStatus` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |
| Variáveis | camelCase | `clientName`, `isActive` |
| Hooks | camelCase com `use` prefix | `useClients()`, `useDebounce()` |
| Server Actions | camelCase | `createClient()`, `deleteProject()` |

## Barrel Exports Pattern

Cada módulo possui um arquivo `index.ts` que exporta apenas o que é público:

```ts
// src/modules/crm/index.ts
export { leadService } from './services/lead-service';
export { leadRepository } from './repository/lead-repository';
export { useLeads } from './hooks/use-leads';
export { LeadTable } from './components/LeadTable';
export { leadSchema } from './schemas';
export type { Lead } from './types';
```

Os components internos e utilitários privados não são exportados.

## Zod Schemas para Validação

Toda validação de dados deve usar Zod, com schemas definidos no módulo:

```ts
import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
  document: z.string().regex(/^\d{11}$|^\d{14}$/, 'Documento invalido').optional(),
  email: z.string().email('Email invalido').optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
```

## Server Actions

Toda ação do servidor deve retornar `ActionResponse`:

```ts
'use server';

import { actionResponse } from '@/lib/action-response';

export async function createClient(data: FormData): Promise<ActionResponse> {
  const parsed = clientSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    return {
      success: false,
      message: 'Dados invalidos',
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  // ...
}
```

## Organização de Imports

```ts
// 1. React / Next
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Bibliotecas externas
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 3. Módulos internos (usando @/ alias)
import { clientService } from '@/modules/clients/services/client-service';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 4. Tipos
import type { Client } from '@/modules/clients/types';
```

## Componentes React

```tsx
// Componente funcional com tipagem
interface LeadTableProps {
  leads: Lead[];
  onSelect: (id: string) => void;
}

export function LeadTable({ leads, onSelect }: LeadTableProps) {
  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id} onClick={() => onSelect(lead.id)}>
          {lead.name}
        </div>
      ))}
    </div>
  );
}
```

## Estilização

Uso de Tailwind CSS 4 com `cn()` utility para merge de classes:

```tsx
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span className={cn('px-2 py-1 rounded', {
      'bg-blue-100 text-blue-800': variant === 'default',
      'bg-green-100 text-green-800': variant === 'success',
    }, className)} {...props} />
  );
}
```

## Commits

Seguir commits semânticos: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`.

## Padrão de Testes

```ts
// Teste unitário com Vitest
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './pricing';

describe('calculateTotal', () => {
  it('should calculate total with discount', () => {
    const result = calculateTotal(100, 10);
    expect(result).toBe(90);
  });
});
```
