# Schema do Banco de Dados

## Modelos Principais

### Company

Entidade raiz do sistema, isolando dados por tenant.

```prisma
model Company {
  id          String    @id @default(uuid())
  razaoSocial String
  nomeFantasia String
  cnpj        String    @unique
  status      String    @default("active")
  planId      String?
  plan        Plan?     @relation(fields: [planId], references: [id])
  settings    Json?
  // + endereço, contato, banco, identidade visual, horários
  // + auditoria (createdAt, updatedAt, deletedAt, createdBy, updatedBy, deletedBy)
  // + relações: users, clients, projects, materials, teams, equipments, etc.
}
```

### User

Usuário vinculado a uma empresa, com role RBAC.

```prisma
model User {
  id        String   @id @default(uuid())
  companyId String
  company   Company  @relation(fields: [companyId], references: [id])
  nome      String
  sobrenome String
  email     String   @unique
  role      UserRole @default(TEAM_MEMBER)
  status    String   @default("active")
  // + auditoria
}
```

### Client

Cliente da empresa de comunicação visual.

```prisma
model Client {
  id        String   @id @default(uuid())
  name      String
  document  String?
  email     String?
  phone     String?
  companyId String
  company   Company  @relation(fields: [companyId], references: [id])
  // + auditoria
}
```

### Project

Projeto com ciclo de vida completo (produção, instalação, entrega).

```prisma
model Project {
  id        String        @id @default(uuid())
  companyId String
  company   Company       @relation(fields: [companyId], references: [id])
  clientId  String?
  number    String        @unique
  name      String
  status    ProjectStatus @default(WAITING)
  // + datas, prioridade, notas
  // + relações: tasks, productionOrders
}
```

### ProductionOrder

Ordem de produção vinculada a um projeto e departamento.

```prisma
model ProductionOrder {
  id           String   @id @default(uuid())
  companyId    String
  projectId    String
  departmentId String?
  number       String   @unique
  title        String
  status       String   @default("pending")
  assignedTeamId String?
  estimatedHours Float?
  actualHours    Float?
  // + auditoria
}
```

### Equipment

Equipamentos utilizados na produção e instalação.

```prisma
model Equipment {
  id              String            @id @default(uuid())
  categoryId      String
  category        EquipmentCategory @relation(fields: [categoryId], references: [id])
  costType        EquipmentCostType @default(HOUR)
  code            String            @unique
  name            String
  hourCost        Float             @default(0)
  dailyCost       Float             @default(0)
  kmCost          Float             @default(0)
  // + fabricante, serial, compra
}
```

### Material

Matérias-primas e insumos com controle de estoque.

```prisma
model Material {
  id           String         @id @default(uuid())
  categoryId   String
  category     MaterialCategory @relation
  code         String         @unique
  name         String
  unit         UnitOfMeasure  @default(UN)
  cost         Float          @default(0)
  salePrice    Float          @default(0)
  currentStock Int            @default(0)
  minimumStock Int            @default(0)
  // + dimensões, marca, fornecedor
}
```

### Financial

O schema atualmente não possui um modelo Financial dedicado. O financeiro é gerenciado via API routes em `src/app/api/v1/financial/`, utilizando dados de orçamentos e projetos. A estrutura pode ser estendida conforme necessidade.

### Calendar (Agenda)

```prisma
// Eventos são gerenciados via módulo calendar
// ou via Customer Visit no CRM
model Visit {
  id        String   @id @default(uuid())
  leadId    String
  date      DateTime
  status    String   @default("scheduled")
  // + relatório, fotos
}
```

### AuditLog

Registro de auditoria para rastreabilidade.

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  action     String
  entityType String
  entityId   String
  changes    Json?
  userId     String?
  companyId  String?
  // + índices
}
```

### Job

Sistema de fila de tarefas assíncronas.

```prisma
model Job {
  id          String   @id @default(uuid())
  companyId   String
  name        String
  type        String
  payload     Json?
  priority    String   @default("NORMAL")
  status      String   @default("pending")
  maxAttempts Int      @default(1)
  // + execuções
}
```

## Relacionamentos Principais

```
Company 1──N User
Company 1──N Client
Company 1──N Project
Company 1──N Team
Company 1──N MaterialCategory
Company 1──N Material
Company 1──N EquipmentCategory
Company 1──N Equipment
Company 1──N Quotation
Company 1──N ProductionOrder
Company 1──N Workflow
Company 1──N AiProvider
Company 1──N Plugin
Company 1──N KnowledgeCollection

Project  1──N ProjectTask
Project  1──N ProductionOrder
Project  N──1 Client (optional)

Quotation 1──N QuotationItem
Quotation N──1 Client (optional)

Team     1──N TeamMember
Team     1──N TeamProductivity

Workflow 1──N WorkflowStep
Workflow 1──N WorkflowExecution

Company 1──1 Subscription
Company 1──1 CompanySettings
Plan    1──N Company
Plan    1──N Subscription

CustomEntity 1──N CustomField
CustomEntity 1──N CustomLayout
CustomEntity 1──N CustomRecord
```

## Convenções

- **IDs**: UUID v4 em todos os modelos
- **Auditoria**: Todos os modelos principais possuem `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`, `deletedBy`
- **Soft delete**: `deletedAt` como flag de exclusão lógica
- **Índices**: `@@index([companyId, deletedAt])` em todas as tabelas tenant-scoped
- **Mapping**: `@@map("snake_case")` para nomes de tabelas em português
- **Enums**: Definidos no schema para tipos fixos (status, roles)
