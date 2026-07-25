# ADR-004: Estrutura de Módulos

## Status

**Aceito**

## Contexto

O Visual ERP possui 29 módulos de negócio. Cada módulo encapsula um domínio específico (CRM, projetos, financeiro, etc.) e precisa de uma estrutura consistente que facilite a navegação, manutenção e testabilidade.

As opções consideradas foram:

1. **Estrutura padronizada com 9 diretórios** — types, schemas, validators, repository, services, actions, hooks, components, index.ts
2. **Estrutura plana** — todos os arquivos no mesmo diretório
3. **Estrutura por camada** — agrupar por camada (ex: `src/repository/crm/`, `src/services/crm/`)
4. **Feature-Sliced Design** — abordagem mais complexa

## Decisão

Adotar **estrutura padronizada de 9 diretórios por módulo**:

```
src/modules/crm/
├── types/          # Interfaces e tipos TypeScript
│   └── index.ts
├── schemas/        # Schemas Zod para validação
│   └── index.ts
├── validators/     # Constantes, labels, cores, mapeamentos
│   └── index.ts
├── repository/     # Implementação do Repository Pattern
│   ├── lead-repository.ts
│   └── activity-repository.ts
├── services/       # Regras de negócio (estendem BaseService)
│   ├── lead-service.ts
│   └── crm-service.ts
├── actions/        # Server Actions
│   └── crm-actions.ts
├── hooks/          # React Hooks (TanStack Query wrappers)
│   ├── use-leads.ts
│   └── use-lead.ts
├── components/     # Componentes React do módulo
│   ├── LeadTable.tsx
│   └── LeadBadge.tsx
└── index.ts        # Barrel export público
```

### Princípios

- Cada módulo é autocontido e pode ser desenvolvido independentemente
- O barrel export (`index.ts`) expõe apenas a API pública do módulo
- Tipos, schemas e validators são colapsados em `index.ts` para importação simplificada
- Repositórios são injetados nos serviços via construtor
- Actions consomem serviços, não repositórios diretamente
- Hooks encapsulam TanStack Query para data fetching e mutations

## Consequências

### Positivas

- Consistência entre todos os 29 módulos
- Facilidade para novos desenvolvedores entenderem a estrutura
- Separação clara de responsabilidades
- Testabilidade: cada camada pode ser testada isoladamente
- Navegação previsível: qualquer módulo segue o mesmo padrão

### Negativas

- Mais diretórios para navegar (9 por módulo)
- Custo cognitivo inicial para entender a separação entre schemas, validators e types
- Alguns módulos pequenos podem parecer excessivamente estruturados
- Risco de arquivos `index.ts` se tornarem muito grandes

## Alternativas Consideradas

- **Estrutura plana** foi rejeitada por falta de organização em projetos com muitos arquivos
- **Estrutura por camada** foi rejeitada por dificultar a localização de código relacionado a um módulo específico
- **Feature-Sliced Design** foi rejeitado por complexidade excessiva para o porte da equipe
