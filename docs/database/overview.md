# Banco de Dados

## Tecnologia

O Visual ERP utiliza **Prisma ORM 7.9.0** como camada de abstração de banco de dados, com suporte a múltiplos provedores:

| Ambiente | Provider | Observação |
|---|---|---|
| Desenvolvimento | SQLite (recomendado) | Simples, sem dependência externa |
| Desenvolvimento | PostgreSQL | Usando `@prisma/adapter-pg` |
| Staging | PostgreSQL | Ambiente de homologação |
| Produção | PostgreSQL | Ambiente produtivo |

## Configuração

O datasource é configurado para PostgreSQL na schema principal, com possibilidade de troca via variável de ambiente:

```prisma
datasource db {
  provider = "postgresql"
}
```

A conexão é gerenciada pelo adaptador PrismaPg:

```ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
```

## Estrutura do Schema

O schema está em `prisma/schema.prisma` com 46 modelos e 9 enums. O Prisma Client é gerado para `src/generated/prisma/`.

### Enums

| Enum | Valores |
|---|---|
| `UserRole` | SUPER_ADMIN, ADMIN, MANAGER, TEAM_MEMBER, VIEWER |
| `ProjectStatus` | WAITING, PLANNING, IN_PRODUCTION, WAITING_INSTALLATION, INSTALLING, FINISHED, DELIVERED, CANCELLED |
| `TaskStatus` | PENDING, WAITING, IN_PROGRESS, PAUSED, FINISHED, CANCELLED |
| `QuotationStatus` | DRAFT, PENDING, SENT, APPROVED, REJECTED, EXPIRED, CANCELLED |
| `DiscountType` | PERCENTAGE, VALUE |
| `ComponentType` | MATERIAL, SERVICE, LABOR, EQUIPMENT, OUTSOURCED, TRANSPORT, TAX, FINISHING, CUSTOM |
| `UnitOfMeasure` | UN, M2, M, CM, MM, KG, G, L, ML, ROLO, CHAPA, CAIXA, PACOTE, KIT |
| `EquipmentCostType` | HOUR, DAY, KM, UNIT, MONTH |
| `TeamRole` | LEADER, INSTALLER, ASSISTANT, WELDER, PAINTER, DESIGNER, PRINTER_OPERATOR, FINISHING, CUSTOM |
| `WorkflowTrigger` | CLIENT_CREATED, LEAD_CREATED, LEAD_CONVERTED, QUOTE_APPROVED, PROJECT_CREATED, WORKORDER_CREATED, PRODUCTION_FINISHED, INSTALLATION_FINISHED, FINANCIAL_RECEIVED, FINANCIAL_PAID, USER_CREATED |
| `WorkflowExecutionStatus` | PENDING, RUNNING, COMPLETED, FAILED, CANCELLED |

### Modelos (46)

| Grupo | Modelos |
|---|---|
| **Empresa** | Company, CompanySettings, Plan, Subscription, License |
| **Usuários** | User, PlatformUser |
| **Clientes** | Client |
| **Projetos** | Project, ProjectTask, Department |
| **Produção** | ProductionOrder |
| **Catálogo** | ServiceCategory, ServiceSubcategory, CatalogService, ServiceComponent |
| **Materiais** | MaterialCategory, Material |
| **Equipamentos** | EquipmentCategory, Equipment |
| **Equipes** | Team, TeamMember, TeamProductivity |
| **Orçamentos** | Quotation, QuotationItem |
| **API** | ApiKey, ApiLog |
| **Webhooks** | Webhook, WebhookLog |
| **Workflows** | Workflow, WorkflowStep, WorkflowExecution, WorkflowExecutionLog |
| **IA** | AiProvider, AiPrompt, AiConversation, AiMessage, AiExecution |
| **Conhecimento** | KnowledgeCollection, KnowledgeDocument, KnowledgeChunk, KnowledgeSearch |
| **Plugins** | Plugin, PluginSetting, PluginPermission, PluginExecution |
| **Comunicação** | Conversation, Message, MessageTemplate, Notification |
| **Auditoria** | AuditLog, AuditEvent, AccessLog, SecurityPolicy, DataRetentionPolicy |
| **Eventos** | EventLog |
| **Jobs** | Job, JobExecution, ScheduledJob |
| **Sistema** | SystemLog, HealthCheck, Deployment, Backup |
| **Dashboard** | Dashboard, DashboardWidget, MetricSnapshot, SavedReport |
| **Custom** | CustomEntity, CustomField, CustomLayout, CustomRecord |
| **Métricas** | PlatformMetric, PlatformAnnouncement |

## Mock Data Strategy

Em desenvolvimento, os repositórios operam com dados em memória através do **Mock Repository Pattern**. Cada módulo possui um repositório que implementa a interface `RepositoryBase` e armazena dados em arrays na memória.

```ts
class ClientRepository implements RepositoryBase<Client, CreateClientInput, UpdateClientInput> {
  private clients: Client[] = [];

  async create(input: CreateClientInput): Promise<Client> {
    const client = { id: crypto.randomUUID(), ...input, createdAt: new Date(), updatedAt: new Date() };
    this.clients.push(client);
    return client;
  }
}
```

Isso permite:
- Desenvolvimento sem dependência de banco de dados
- Testes unitários rápidos e isolados
- Reset fácil do estado entre testes
- Seed data programática via fixtures

### Scripts Disponíveis

```bash
pnpm db:generate   # Gera Prisma Client
pnpm db:push       # Push schema para o banco
pnpm db:migrate    # Cria migração
pnpm db:studio     # Abre Prisma Studio
```
