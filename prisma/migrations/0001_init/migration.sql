-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('UN', 'M2', 'M', 'CM', 'MM', 'KG', 'G', 'L', 'ML', 'ROLO', 'CHAPA', 'CAIXA', 'PACOTE', 'KIT');

-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('MATERIAL', 'SERVICE', 'LABOR', 'EQUIPMENT', 'OUTSOURCED', 'TRANSPORT', 'TAX', 'FINISHING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'INSTALLER', 'ASSISTANT', 'WELDER', 'PAINTER', 'DESIGNER', 'PRINTER_OPERATOR', 'FINISHING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "EquipmentCostType" AS ENUM ('HOUR', 'DAY', 'KM', 'UNIT', 'MONTH');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'PENDING', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'VALUE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TEAM_MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('WAITING', 'PLANNING', 'IN_PRODUCTION', 'WAITING_INSTALLATION', 'INSTALLING', 'FINISHED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'WAITING', 'IN_PROGRESS', 'PAUSED', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowTrigger" AS ENUM ('CLIENT_CREATED', 'LEAD_CREATED', 'LEAD_CONVERTED', 'QUOTE_APPROVED', 'PROJECT_CREATED', 'WORKORDER_CREATED', 'PRODUCTION_FINISHED', 'INSTALLATION_FINISHED', 'FINANCIAL_RECEIVED', 'FINANCIAL_PAID', 'USER_CREATED');

-- CreateEnum
CREATE TYPE "WorkflowExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "inscricaoMunicipal" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "site" TEXT,
    "whatsapp" TEXT,
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "corPrimaria" TEXT NOT NULL DEFAULT '#3b82f6',
    "corSecundaria" TEXT NOT NULL DEFAULT '#1e40af',
    "banco" TEXT,
    "agencia" TEXT,
    "conta" TEXT,
    "pix" TEXT,
    "favorecido" TEXT,
    "horarioInicio" TEXT NOT NULL DEFAULT '08:00',
    "horarioFim" TEXT NOT NULL DEFAULT '18:00',
    "trabalhaSabado" BOOLEAN NOT NULL DEFAULT true,
    "trabalhaDomingo" BOOLEAN NOT NULL DEFAULT false,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "idioma" TEXT NOT NULL DEFAULT 'pt-BR',
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "formatoData" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "status" TEXT NOT NULL DEFAULT 'active',
    "planId" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "notes" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "cargo" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TEAM_MEMBER',
    "roleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "ultimoLogin" TIMESTAMP(3),
    "emailVerificado" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "icon" TEXT NOT NULL DEFAULT 'Building2',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "quotationId" TEXT,
    "clientId" TEXT,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'WAITING',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "expectedStartDate" TIMESTAMP(3),
    "expectedEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tasks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "departmentId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "assignedTeamId" TEXT,
    "dependsOnTaskId" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "project_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_orders" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectTaskId" TEXT,
    "departmentId" TEXT,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "assignedTeamId" TEXT,
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "production_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_subcategories" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "service_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_services" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "averageProductionTime" DOUBLE PRECISION,
    "requiresVisit" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "requiresArt" BOOLEAN NOT NULL DEFAULT false,
    "hasPrinting" BOOLEAN NOT NULL DEFAULT false,
    "hasInstallation" BOOLEAN NOT NULL DEFAULT false,
    "hasPainting" BOOLEAN NOT NULL DEFAULT false,
    "hasTransport" BOOLEAN NOT NULL DEFAULT false,
    "defaultMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maximumMargin" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "markup" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "catalog_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_components" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "componentType" "ComponentType" NOT NULL DEFAULT 'MATERIAL',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "service_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "material_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "manufacturer" TEXT,
    "supplier" TEXT,
    "unit" "UnitOfMeasure" NOT NULL DEFAULT 'UN',
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lossPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumStock" INTEGER NOT NULL DEFAULT 0,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "thickness" DOUBLE PRECISION,
    "color" TEXT,
    "reference" TEXT,
    "barcode" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hourCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dailyCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "defaultMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "teamId" TEXT,
    "name" TEXT NOT NULL,
    "role" "TeamRole",
    "hourCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_productivity" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "unit" TEXT,
    "productionPerHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "installationPerHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_productivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_categories" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "equipment_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "costType" "EquipmentCostType" NOT NULL DEFAULT 'HOUR',
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "patrimonyNumber" TEXT,
    "supplier" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchaseValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "residualValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hourCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dailyCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kmCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fuelConsumption" DOUBLE PRECISION,
    "capacity" DOUBLE PRECISION,
    "unit" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT,
    "number" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "validUntil" TIMESTAMP(3),
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountType" "DiscountType",
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_items" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "serviceId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL DEFAULT 'UN',
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pricingSnapshot" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "quotation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "metadata" JSONB,
    "userId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "permissions" TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT[],
    "secret" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_logs" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_logs" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "trigger" "WorkflowTrigger" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_steps" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "workflow_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_executions" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "WorkflowExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "error" TEXT,

    CONSTRAINT "workflow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_execution_logs" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_execution_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_providers" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 2048,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "ai_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompts" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "prompt" TEXT NOT NULL,
    "systemPrompt" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "ai_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "module" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_executions" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tokensInput" INTEGER NOT NULL DEFAULT 0,
    "tokensOutput" INTEGER NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_collections" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "knowledge_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_documents" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'upload',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_chunks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embeddingId" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "query" TEXT NOT NULL,
    "results" INTEGER NOT NULL DEFAULT 0,
    "executionTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugins" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "author" TEXT,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'other',
    "manifest" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "plugins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_settings" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "plugin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_permissions" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "plugin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_executions" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "duration" INTEGER,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plugin_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "interval" TEXT NOT NULL DEFAULT 'monthly',
    "usersLimit" INTEGER NOT NULL DEFAULT 5,
    "storageLimit" INTEGER NOT NULL DEFAULT 1024,
    "activeProjectsLimit" INTEGER NOT NULL DEFAULT 10,
    "clientsLimit" INTEGER NOT NULL DEFAULT 50,
    "integrationsLimit" INTEGER NOT NULL DEFAULT 3,
    "aiLimit" BOOLEAN NOT NULL DEFAULT false,
    "pluginsLimit" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "logoDarkUrl" TEXT,
    "logoLightUrl" TEXT,
    "faviconUrl" TEXT,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layout" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_widgets" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "configuration" JSONB,
    "position" JSONB,
    "width" INTEGER NOT NULL DEFAULT 4,
    "height" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dashboard_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_reports" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "module" TEXT,
    "filters" JSONB,
    "columns" JSONB,
    "sortBy" TEXT,
    "sortOrder" TEXT NOT NULL DEFAULT 'asc',
    "chartType" TEXT,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,

    CONSTRAINT "saved_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_snapshots" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "label" TEXT,
    "category" TEXT,
    "unit" TEXT,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_entities" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_fields" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" TEXT,
    "options" JSONB,
    "placeholder" TEXT,
    "helpText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validations" JSONB,
    "relationEntityId" TEXT,
    "relationField" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_layouts" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "layout" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_records" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT,
    "assignedUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastMessageAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "sender" TEXT,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "channel" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'system',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "content" TEXT NOT NULL,
    "variables" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_executions" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "worker" TEXT NOT NULL,
    "duration" INTEGER,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "logs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_jobs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cron" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "lastExecution" TIMESTAMP(3),
    "nextExecution" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "scheduled_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_logs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB,
    "publisher" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "action" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_policies" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_logs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_retention_policies" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "retentionDays" INTEGER NOT NULL,
    "archiveAfter" INTEGER,
    "deleteAfter" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_retention_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresAt" TIMESTAMP(3),
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "maxStorage" INTEGER NOT NULL DEFAULT 1024,
    "features" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_metrics" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "referenceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "level" TEXT NOT NULL DEFAULT 'INFO',
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_checks" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'healthy',
    "responseTime" INTEGER,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployments" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "environment" TEXT NOT NULL DEFAULT 'production',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "commit" TEXT,
    "branch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backups" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'manual',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "size" INTEGER,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");

-- CreateIndex
CREATE INDEX "clients_companyId_idx" ON "clients"("companyId");

-- CreateIndex
CREATE INDEX "clients_deletedAt_idx" ON "clients"("deletedAt");

-- CreateIndex
CREATE INDEX "clients_companyId_deletedAt_idx" ON "clients"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "clients_name_idx" ON "clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "users_companyId_deletedAt_idx" ON "users"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "departments_companyId_idx" ON "departments"("companyId");

-- CreateIndex
CREATE INDEX "departments_deletedAt_idx" ON "departments"("deletedAt");

-- CreateIndex
CREATE INDEX "departments_companyId_deletedAt_idx" ON "departments"("companyId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "projects_number_key" ON "projects"("number");

-- CreateIndex
CREATE INDEX "projects_companyId_idx" ON "projects"("companyId");

-- CreateIndex
CREATE INDEX "projects_deletedAt_idx" ON "projects"("deletedAt");

-- CreateIndex
CREATE INDEX "projects_companyId_deletedAt_idx" ON "projects"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "projects_clientId_idx" ON "projects"("clientId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "project_tasks_projectId_idx" ON "project_tasks"("projectId");

-- CreateIndex
CREATE INDEX "project_tasks_departmentId_idx" ON "project_tasks"("departmentId");

-- CreateIndex
CREATE INDEX "project_tasks_status_idx" ON "project_tasks"("status");

-- CreateIndex
CREATE INDEX "project_tasks_deletedAt_idx" ON "project_tasks"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "production_orders_number_key" ON "production_orders"("number");

-- CreateIndex
CREATE INDEX "production_orders_companyId_idx" ON "production_orders"("companyId");

-- CreateIndex
CREATE INDEX "production_orders_deletedAt_idx" ON "production_orders"("deletedAt");

-- CreateIndex
CREATE INDEX "production_orders_companyId_deletedAt_idx" ON "production_orders"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "production_orders_projectId_idx" ON "production_orders"("projectId");

-- CreateIndex
CREATE INDEX "production_orders_departmentId_idx" ON "production_orders"("departmentId");

-- CreateIndex
CREATE INDEX "production_orders_status_idx" ON "production_orders"("status");

-- CreateIndex
CREATE INDEX "templates_companyId_idx" ON "templates"("companyId");

-- CreateIndex
CREATE INDEX "templates_deletedAt_idx" ON "templates"("deletedAt");

-- CreateIndex
CREATE INDEX "service_categories_companyId_idx" ON "service_categories"("companyId");

-- CreateIndex
CREATE INDEX "service_categories_deletedAt_idx" ON "service_categories"("deletedAt");

-- CreateIndex
CREATE INDEX "service_categories_companyId_deletedAt_idx" ON "service_categories"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "service_categories_active_idx" ON "service_categories"("active");

-- CreateIndex
CREATE INDEX "service_subcategories_categoryId_idx" ON "service_subcategories"("categoryId");

-- CreateIndex
CREATE INDEX "service_subcategories_companyId_idx" ON "service_subcategories"("companyId");

-- CreateIndex
CREATE INDEX "service_subcategories_deletedAt_idx" ON "service_subcategories"("deletedAt");

-- CreateIndex
CREATE INDEX "service_subcategories_companyId_deletedAt_idx" ON "service_subcategories"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "service_subcategories_active_idx" ON "service_subcategories"("active");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_services_code_key" ON "catalog_services"("code");

-- CreateIndex
CREATE INDEX "catalog_services_categoryId_idx" ON "catalog_services"("categoryId");

-- CreateIndex
CREATE INDEX "catalog_services_companyId_idx" ON "catalog_services"("companyId");

-- CreateIndex
CREATE INDEX "catalog_services_deletedAt_idx" ON "catalog_services"("deletedAt");

-- CreateIndex
CREATE INDEX "catalog_services_companyId_deletedAt_idx" ON "catalog_services"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "catalog_services_active_idx" ON "catalog_services"("active");

-- CreateIndex
CREATE INDEX "catalog_services_name_idx" ON "catalog_services"("name");

-- CreateIndex
CREATE INDEX "service_components_serviceId_idx" ON "service_components"("serviceId");

-- CreateIndex
CREATE INDEX "service_components_deletedAt_idx" ON "service_components"("deletedAt");

-- CreateIndex
CREATE INDEX "service_components_active_idx" ON "service_components"("active");

-- CreateIndex
CREATE INDEX "material_categories_companyId_idx" ON "material_categories"("companyId");

-- CreateIndex
CREATE INDEX "material_categories_deletedAt_idx" ON "material_categories"("deletedAt");

-- CreateIndex
CREATE INDEX "material_categories_companyId_deletedAt_idx" ON "material_categories"("companyId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "materials_code_key" ON "materials"("code");

-- CreateIndex
CREATE INDEX "materials_categoryId_idx" ON "materials"("categoryId");

-- CreateIndex
CREATE INDEX "materials_companyId_idx" ON "materials"("companyId");

-- CreateIndex
CREATE INDEX "materials_deletedAt_idx" ON "materials"("deletedAt");

-- CreateIndex
CREATE INDEX "materials_companyId_deletedAt_idx" ON "materials"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "materials_name_idx" ON "materials"("name");

-- CreateIndex
CREATE INDEX "materials_active_idx" ON "materials"("active");

-- CreateIndex
CREATE UNIQUE INDEX "teams_code_key" ON "teams"("code");

-- CreateIndex
CREATE INDEX "teams_companyId_idx" ON "teams"("companyId");

-- CreateIndex
CREATE INDEX "teams_deletedAt_idx" ON "teams"("deletedAt");

-- CreateIndex
CREATE INDEX "teams_companyId_deletedAt_idx" ON "teams"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "team_members_companyId_idx" ON "team_members"("companyId");

-- CreateIndex
CREATE INDEX "team_members_teamId_idx" ON "team_members"("teamId");

-- CreateIndex
CREATE INDEX "team_members_active_idx" ON "team_members"("active");

-- CreateIndex
CREATE INDEX "team_productivity_companyId_idx" ON "team_productivity"("companyId");

-- CreateIndex
CREATE INDEX "team_productivity_teamId_idx" ON "team_productivity"("teamId");

-- CreateIndex
CREATE INDEX "equipment_categories_companyId_idx" ON "equipment_categories"("companyId");

-- CreateIndex
CREATE INDEX "equipment_categories_deletedAt_idx" ON "equipment_categories"("deletedAt");

-- CreateIndex
CREATE INDEX "equipment_categories_companyId_deletedAt_idx" ON "equipment_categories"("companyId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "equipments_code_key" ON "equipments"("code");

-- CreateIndex
CREATE INDEX "equipments_companyId_idx" ON "equipments"("companyId");

-- CreateIndex
CREATE INDEX "equipments_categoryId_idx" ON "equipments"("categoryId");

-- CreateIndex
CREATE INDEX "equipments_deletedAt_idx" ON "equipments"("deletedAt");

-- CreateIndex
CREATE INDEX "equipments_companyId_deletedAt_idx" ON "equipments"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "equipments_active_idx" ON "equipments"("active");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_number_key" ON "quotations"("number");

-- CreateIndex
CREATE INDEX "quotations_companyId_idx" ON "quotations"("companyId");

-- CreateIndex
CREATE INDEX "quotations_clientId_idx" ON "quotations"("clientId");

-- CreateIndex
CREATE INDEX "quotations_deletedAt_idx" ON "quotations"("deletedAt");

-- CreateIndex
CREATE INDEX "quotations_companyId_deletedAt_idx" ON "quotations"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "quotations_status_idx" ON "quotations"("status");

-- CreateIndex
CREATE INDEX "quotations_createdAt_idx" ON "quotations"("createdAt");

-- CreateIndex
CREATE INDEX "quotation_items_quotationId_idx" ON "quotation_items"("quotationId");

-- CreateIndex
CREATE INDEX "quotation_items_deletedAt_idx" ON "quotation_items"("deletedAt");

-- CreateIndex
CREATE INDEX "audit_logs_companyId_idx" ON "audit_logs"("companyId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_deletedAt_idx" ON "audit_logs"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_companyId_idx" ON "api_keys"("companyId");

-- CreateIndex
CREATE INDEX "api_keys_key_idx" ON "api_keys"("key");

-- CreateIndex
CREATE INDEX "api_keys_active_idx" ON "api_keys"("active");

-- CreateIndex
CREATE INDEX "api_keys_companyId_active_idx" ON "api_keys"("companyId", "active");

-- CreateIndex
CREATE INDEX "webhooks_companyId_idx" ON "webhooks"("companyId");

-- CreateIndex
CREATE INDEX "webhooks_active_idx" ON "webhooks"("active");

-- CreateIndex
CREATE INDEX "webhooks_companyId_active_idx" ON "webhooks"("companyId", "active");

-- CreateIndex
CREATE INDEX "webhook_logs_webhookId_idx" ON "webhook_logs"("webhookId");

-- CreateIndex
CREATE INDEX "webhook_logs_event_idx" ON "webhook_logs"("event");

-- CreateIndex
CREATE INDEX "webhook_logs_executedAt_idx" ON "webhook_logs"("executedAt");

-- CreateIndex
CREATE INDEX "api_logs_apiKeyId_idx" ON "api_logs"("apiKeyId");

-- CreateIndex
CREATE INDEX "api_logs_endpoint_idx" ON "api_logs"("endpoint");

-- CreateIndex
CREATE INDEX "api_logs_createdAt_idx" ON "api_logs"("createdAt");

-- CreateIndex
CREATE INDEX "workflows_companyId_idx" ON "workflows"("companyId");

-- CreateIndex
CREATE INDEX "workflows_deletedAt_idx" ON "workflows"("deletedAt");

-- CreateIndex
CREATE INDEX "workflows_companyId_deletedAt_idx" ON "workflows"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "workflows_trigger_idx" ON "workflows"("trigger");

-- CreateIndex
CREATE INDEX "workflows_active_idx" ON "workflows"("active");

-- CreateIndex
CREATE INDEX "workflow_steps_workflowId_idx" ON "workflow_steps"("workflowId");

-- CreateIndex
CREATE INDEX "workflow_steps_deletedAt_idx" ON "workflow_steps"("deletedAt");

-- CreateIndex
CREATE INDEX "workflow_executions_workflowId_idx" ON "workflow_executions"("workflowId");

-- CreateIndex
CREATE INDEX "workflow_executions_status_idx" ON "workflow_executions"("status");

-- CreateIndex
CREATE INDEX "workflow_executions_startedAt_idx" ON "workflow_executions"("startedAt");

-- CreateIndex
CREATE INDEX "workflow_execution_logs_executionId_idx" ON "workflow_execution_logs"("executionId");

-- CreateIndex
CREATE INDEX "ai_providers_companyId_idx" ON "ai_providers"("companyId");

-- CreateIndex
CREATE INDEX "ai_providers_deletedAt_idx" ON "ai_providers"("deletedAt");

-- CreateIndex
CREATE INDEX "ai_providers_companyId_deletedAt_idx" ON "ai_providers"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_providers_active_idx" ON "ai_providers"("active");

-- CreateIndex
CREATE INDEX "ai_prompts_companyId_idx" ON "ai_prompts"("companyId");

-- CreateIndex
CREATE INDEX "ai_prompts_deletedAt_idx" ON "ai_prompts"("deletedAt");

-- CreateIndex
CREATE INDEX "ai_prompts_companyId_deletedAt_idx" ON "ai_prompts"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "ai_prompts_module_idx" ON "ai_prompts"("module");

-- CreateIndex
CREATE INDEX "ai_prompts_active_idx" ON "ai_prompts"("active");

-- CreateIndex
CREATE INDEX "ai_conversations_companyId_idx" ON "ai_conversations"("companyId");

-- CreateIndex
CREATE INDEX "ai_conversations_userId_idx" ON "ai_conversations"("userId");

-- CreateIndex
CREATE INDEX "ai_conversations_module_idx" ON "ai_conversations"("module");

-- CreateIndex
CREATE INDEX "ai_messages_conversationId_idx" ON "ai_messages"("conversationId");

-- CreateIndex
CREATE INDEX "ai_executions_conversationId_idx" ON "ai_executions"("conversationId");

-- CreateIndex
CREATE INDEX "knowledge_collections_companyId_idx" ON "knowledge_collections"("companyId");

-- CreateIndex
CREATE INDEX "knowledge_collections_deletedAt_idx" ON "knowledge_collections"("deletedAt");

-- CreateIndex
CREATE INDEX "knowledge_collections_companyId_deletedAt_idx" ON "knowledge_collections"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "knowledge_collections_active_idx" ON "knowledge_collections"("active");

-- CreateIndex
CREATE INDEX "knowledge_documents_collectionId_idx" ON "knowledge_documents"("collectionId");

-- CreateIndex
CREATE INDEX "knowledge_documents_deletedAt_idx" ON "knowledge_documents"("deletedAt");

-- CreateIndex
CREATE INDEX "knowledge_documents_collectionId_deletedAt_idx" ON "knowledge_documents"("collectionId", "deletedAt");

-- CreateIndex
CREATE INDEX "knowledge_documents_status_idx" ON "knowledge_documents"("status");

-- CreateIndex
CREATE INDEX "knowledge_chunks_documentId_idx" ON "knowledge_chunks"("documentId");

-- CreateIndex
CREATE INDEX "knowledge_chunks_documentId_chunkIndex_idx" ON "knowledge_chunks"("documentId", "chunkIndex");

-- CreateIndex
CREATE INDEX "knowledge_searches_userId_idx" ON "knowledge_searches"("userId");

-- CreateIndex
CREATE INDEX "knowledge_searches_createdAt_idx" ON "knowledge_searches"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "plugins_slug_key" ON "plugins"("slug");

-- CreateIndex
CREATE INDEX "plugins_companyId_idx" ON "plugins"("companyId");

-- CreateIndex
CREATE INDEX "plugins_slug_idx" ON "plugins"("slug");

-- CreateIndex
CREATE INDEX "plugins_deletedAt_idx" ON "plugins"("deletedAt");

-- CreateIndex
CREATE INDEX "plugins_companyId_deletedAt_idx" ON "plugins"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "plugins_enabled_idx" ON "plugins"("enabled");

-- CreateIndex
CREATE INDEX "plugins_category_idx" ON "plugins"("category");

-- CreateIndex
CREATE INDEX "plugin_settings_pluginId_idx" ON "plugin_settings"("pluginId");

-- CreateIndex
CREATE INDEX "plugin_settings_pluginId_key_idx" ON "plugin_settings"("pluginId", "key");

-- CreateIndex
CREATE INDEX "plugin_permissions_pluginId_idx" ON "plugin_permissions"("pluginId");

-- CreateIndex
CREATE INDEX "plugin_executions_pluginId_idx" ON "plugin_executions"("pluginId");

-- CreateIndex
CREATE INDEX "plugin_executions_event_idx" ON "plugin_executions"("event");

-- CreateIndex
CREATE INDEX "plugin_executions_status_idx" ON "plugin_executions"("status");

-- CreateIndex
CREATE INDEX "plugin_executions_createdAt_idx" ON "plugin_executions"("createdAt");

-- CreateIndex
CREATE INDEX "plans_active_idx" ON "plans"("active");

-- CreateIndex
CREATE INDEX "plans_sortOrder_idx" ON "plans"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_companyId_key" ON "subscriptions"("companyId");

-- CreateIndex
CREATE INDEX "subscriptions_companyId_idx" ON "subscriptions"("companyId");

-- CreateIndex
CREATE INDEX "subscriptions_planId_idx" ON "subscriptions"("planId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_expiresAt_idx" ON "subscriptions"("expiresAt");

-- CreateIndex
CREATE INDEX "company_settings_companyId_idx" ON "company_settings"("companyId");

-- CreateIndex
CREATE INDEX "dashboards_companyId_idx" ON "dashboards"("companyId");

-- CreateIndex
CREATE INDEX "dashboards_deletedAt_idx" ON "dashboards"("deletedAt");

-- CreateIndex
CREATE INDEX "dashboards_companyId_deletedAt_idx" ON "dashboards"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "dashboards_active_idx" ON "dashboards"("active");

-- CreateIndex
CREATE INDEX "dashboard_widgets_dashboardId_idx" ON "dashboard_widgets"("dashboardId");

-- CreateIndex
CREATE INDEX "saved_reports_companyId_idx" ON "saved_reports"("companyId");

-- CreateIndex
CREATE INDEX "saved_reports_deletedAt_idx" ON "saved_reports"("deletedAt");

-- CreateIndex
CREATE INDEX "saved_reports_companyId_deletedAt_idx" ON "saved_reports"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "saved_reports_module_idx" ON "saved_reports"("module");

-- CreateIndex
CREATE INDEX "metric_snapshots_companyId_idx" ON "metric_snapshots"("companyId");

-- CreateIndex
CREATE INDEX "metric_snapshots_metric_idx" ON "metric_snapshots"("metric");

-- CreateIndex
CREATE INDEX "metric_snapshots_referenceDate_idx" ON "metric_snapshots"("referenceDate");

-- CreateIndex
CREATE INDEX "metric_snapshots_companyId_metric_referenceDate_idx" ON "metric_snapshots"("companyId", "metric", "referenceDate");

-- CreateIndex
CREATE UNIQUE INDEX "custom_entities_slug_key" ON "custom_entities"("slug");

-- CreateIndex
CREATE INDEX "custom_entities_companyId_idx" ON "custom_entities"("companyId");

-- CreateIndex
CREATE INDEX "custom_entities_deletedAt_idx" ON "custom_entities"("deletedAt");

-- CreateIndex
CREATE INDEX "custom_entities_companyId_deletedAt_idx" ON "custom_entities"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "custom_entities_slug_idx" ON "custom_entities"("slug");

-- CreateIndex
CREATE INDEX "custom_entities_active_idx" ON "custom_entities"("active");

-- CreateIndex
CREATE INDEX "custom_fields_entityId_idx" ON "custom_fields"("entityId");

-- CreateIndex
CREATE INDEX "custom_fields_deletedAt_idx" ON "custom_fields"("deletedAt");

-- CreateIndex
CREATE INDEX "custom_fields_entityId_deletedAt_idx" ON "custom_fields"("entityId", "deletedAt");

-- CreateIndex
CREATE INDEX "custom_fields_entityId_order_idx" ON "custom_fields"("entityId", "order");

-- CreateIndex
CREATE INDEX "custom_layouts_entityId_idx" ON "custom_layouts"("entityId");

-- CreateIndex
CREATE INDEX "custom_layouts_deletedAt_idx" ON "custom_layouts"("deletedAt");

-- CreateIndex
CREATE INDEX "custom_layouts_entityId_deletedAt_idx" ON "custom_layouts"("entityId", "deletedAt");

-- CreateIndex
CREATE INDEX "custom_layouts_entityId_active_idx" ON "custom_layouts"("entityId", "active");

-- CreateIndex
CREATE INDEX "custom_records_entityId_idx" ON "custom_records"("entityId");

-- CreateIndex
CREATE INDEX "custom_records_deletedAt_idx" ON "custom_records"("deletedAt");

-- CreateIndex
CREATE INDEX "custom_records_entityId_deletedAt_idx" ON "custom_records"("entityId", "deletedAt");

-- CreateIndex
CREATE INDEX "custom_records_createdBy_idx" ON "custom_records"("createdBy");

-- CreateIndex
CREATE INDEX "conversations_companyId_idx" ON "conversations"("companyId");

-- CreateIndex
CREATE INDEX "conversations_deletedAt_idx" ON "conversations"("deletedAt");

-- CreateIndex
CREATE INDEX "conversations_companyId_deletedAt_idx" ON "conversations"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "conversations_status_idx" ON "conversations"("status");

-- CreateIndex
CREATE INDEX "conversations_assignedUserId_idx" ON "conversations"("assignedUserId");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_companyId_idx" ON "notifications"("companyId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "message_templates_companyId_idx" ON "message_templates"("companyId");

-- CreateIndex
CREATE INDEX "message_templates_deletedAt_idx" ON "message_templates"("deletedAt");

-- CreateIndex
CREATE INDEX "message_templates_companyId_deletedAt_idx" ON "message_templates"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "message_templates_category_idx" ON "message_templates"("category");

-- CreateIndex
CREATE INDEX "message_templates_active_idx" ON "message_templates"("active");

-- CreateIndex
CREATE INDEX "jobs_companyId_idx" ON "jobs"("companyId");

-- CreateIndex
CREATE INDEX "jobs_deletedAt_idx" ON "jobs"("deletedAt");

-- CreateIndex
CREATE INDEX "jobs_companyId_deletedAt_idx" ON "jobs"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_priority_idx" ON "jobs"("priority");

-- CreateIndex
CREATE INDEX "job_executions_jobId_idx" ON "job_executions"("jobId");

-- CreateIndex
CREATE INDEX "job_executions_status_idx" ON "job_executions"("status");

-- CreateIndex
CREATE INDEX "scheduled_jobs_companyId_idx" ON "scheduled_jobs"("companyId");

-- CreateIndex
CREATE INDEX "scheduled_jobs_deletedAt_idx" ON "scheduled_jobs"("deletedAt");

-- CreateIndex
CREATE INDEX "scheduled_jobs_companyId_deletedAt_idx" ON "scheduled_jobs"("companyId", "deletedAt");

-- CreateIndex
CREATE INDEX "scheduled_jobs_active_idx" ON "scheduled_jobs"("active");

-- CreateIndex
CREATE INDEX "event_logs_companyId_idx" ON "event_logs"("companyId");

-- CreateIndex
CREATE INDEX "event_logs_event_idx" ON "event_logs"("event");

-- CreateIndex
CREATE INDEX "event_logs_createdAt_idx" ON "event_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_events_companyId_idx" ON "audit_events"("companyId");

-- CreateIndex
CREATE INDEX "audit_events_userId_idx" ON "audit_events"("userId");

-- CreateIndex
CREATE INDEX "audit_events_entity_idx" ON "audit_events"("entity");

-- CreateIndex
CREATE INDEX "audit_events_action_idx" ON "audit_events"("action");

-- CreateIndex
CREATE INDEX "audit_events_createdAt_idx" ON "audit_events"("createdAt");

-- CreateIndex
CREATE INDEX "audit_events_companyId_createdAt_idx" ON "audit_events"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "security_policies_companyId_idx" ON "security_policies"("companyId");

-- CreateIndex
CREATE INDEX "security_policies_active_idx" ON "security_policies"("active");

-- CreateIndex
CREATE INDEX "access_logs_companyId_idx" ON "access_logs"("companyId");

-- CreateIndex
CREATE INDEX "access_logs_userId_idx" ON "access_logs"("userId");

-- CreateIndex
CREATE INDEX "access_logs_action_idx" ON "access_logs"("action");

-- CreateIndex
CREATE INDEX "access_logs_resource_idx" ON "access_logs"("resource");

-- CreateIndex
CREATE INDEX "access_logs_status_idx" ON "access_logs"("status");

-- CreateIndex
CREATE INDEX "access_logs_createdAt_idx" ON "access_logs"("createdAt");

-- CreateIndex
CREATE INDEX "data_retention_policies_companyId_idx" ON "data_retention_policies"("companyId");

-- CreateIndex
CREATE INDEX "data_retention_policies_entity_idx" ON "data_retention_policies"("entity");

-- CreateIndex
CREATE INDEX "data_retention_policies_active_idx" ON "data_retention_policies"("active");

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_email_key" ON "platform_users"("email");

-- CreateIndex
CREATE INDEX "platform_users_email_idx" ON "platform_users"("email");

-- CreateIndex
CREATE INDEX "platform_users_active_idx" ON "platform_users"("active");

-- CreateIndex
CREATE INDEX "platform_users_role_idx" ON "platform_users"("role");

-- CreateIndex
CREATE INDEX "licenses_companyId_idx" ON "licenses"("companyId");

-- CreateIndex
CREATE INDEX "licenses_status_idx" ON "licenses"("status");

-- CreateIndex
CREATE INDEX "licenses_planId_idx" ON "licenses"("planId");

-- CreateIndex
CREATE INDEX "platform_metrics_metric_idx" ON "platform_metrics"("metric");

-- CreateIndex
CREATE INDEX "platform_metrics_referenceDate_idx" ON "platform_metrics"("referenceDate");

-- CreateIndex
CREATE INDEX "platform_announcements_type_idx" ON "platform_announcements"("type");

-- CreateIndex
CREATE INDEX "platform_announcements_active_idx" ON "platform_announcements"("active");

-- CreateIndex
CREATE INDEX "platform_announcements_startsAt_idx" ON "platform_announcements"("startsAt");

-- CreateIndex
CREATE INDEX "system_logs_companyId_idx" ON "system_logs"("companyId");

-- CreateIndex
CREATE INDEX "system_logs_level_idx" ON "system_logs"("level");

-- CreateIndex
CREATE INDEX "system_logs_source_idx" ON "system_logs"("source");

-- CreateIndex
CREATE INDEX "system_logs_createdAt_idx" ON "system_logs"("createdAt");

-- CreateIndex
CREATE INDEX "health_checks_service_idx" ON "health_checks"("service");

-- CreateIndex
CREATE INDEX "health_checks_status_idx" ON "health_checks"("status");

-- CreateIndex
CREATE INDEX "health_checks_checkedAt_idx" ON "health_checks"("checkedAt");

-- CreateIndex
CREATE INDEX "deployments_environment_idx" ON "deployments"("environment");

-- CreateIndex
CREATE INDEX "deployments_status_idx" ON "deployments"("status");

-- CreateIndex
CREATE INDEX "deployments_createdAt_idx" ON "deployments"("createdAt");

-- CreateIndex
CREATE INDEX "backups_type_idx" ON "backups"("type");

-- CreateIndex
CREATE INDEX "backups_status_idx" ON "backups"("status");

-- CreateIndex
CREATE INDEX "backups_createdAt_idx" ON "backups"("createdAt");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_projectTaskId_fkey" FOREIGN KEY ("projectTaskId") REFERENCES "project_tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_subcategories" ADD CONSTRAINT "service_subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_subcategories" ADD CONSTRAINT "service_subcategories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_services" ADD CONSTRAINT "catalog_services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_services" ADD CONSTRAINT "catalog_services_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "service_subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_services" ADD CONSTRAINT "catalog_services_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_components" ADD CONSTRAINT "service_components_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "catalog_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "material_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_productivity" ADD CONSTRAINT "team_productivity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_productivity" ADD CONSTRAINT "team_productivity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_categories" ADD CONSTRAINT "equipment_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "equipment_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_execution_logs" ADD CONSTRAINT "workflow_execution_logs_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "workflow_executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_providers" ADD CONSTRAINT "ai_providers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_prompts" ADD CONSTRAINT "ai_prompts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_executions" ADD CONSTRAINT "ai_executions_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_collections" ADD CONSTRAINT "knowledge_collections_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "knowledge_collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "knowledge_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugins" ADD CONSTRAINT "plugins_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_settings" ADD CONSTRAINT "plugin_settings_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_permissions" ADD CONSTRAINT "plugin_permissions_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_executions" ADD CONSTRAINT "plugin_executions_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "custom_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_layouts" ADD CONSTRAINT "custom_layouts_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "custom_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_records" ADD CONSTRAINT "custom_records_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "custom_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_executions" ADD CONSTRAINT "job_executions_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
