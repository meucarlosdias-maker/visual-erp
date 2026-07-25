# Guia de Migração — v1.0.0-rc1 → v1.0.0

## Para Quem Está no rc1

Se você estava na versão `1.0.0-rc1`, esta migração é simples:

### 1. Atualizar dependências

```bash
pnpm install
```

### 2. Atualizar variáveis de ambiente

Copie as novas variáveis do `.env.example`:

```bash
cp .env.example .env
```

Novas variáveis adicionadas no v1.0.0:

- `NEXT_PUBLIC_ENABLE_COMMUNICATION` — Habilita módulo de comunicação
- `NEXT_PUBLIC_ENABLE_BUILDER` — Habilita no-code builder
- `NEXT_PUBLIC_ENABLE_PLATFORM` — Habilita admin SaaS

### 3. Gerar Prisma Client

```bash
pnpm db:generate
```

### 4. Build

```bash
pnpm build
```

### 5. Verificar

```bash
pnpm verify
```

## Breaking Changes

Nenhuma breaking change da rc1 para v1.0.0.

## Novos Módulos

Os seguintes módulos foram adicionados e são automaticamente disponíveis:

- `src/modules/communication/` — Comunicação unificada
- `src/modules/builder/` — No-code builder
- `src/modules/jobs/` — Jobs e filas
- `src/modules/security/` — Auditoria e compliance
- `src/modules/platform/` — Super admin
- `src/modules/devops/` — Observabilidade

## Estrutura de Arquivos

A pasta `docs/` foi reorganizada em:

```
docs/
├── architecture/     # Arquitetura do sistema
├── api/              # Documentação da API
├── modules/          # Documentação dos módulos
├── deployment/       # Guias de deploy
├── database/         # Schema e modelos
├── security/         # Políticas de segurança
├── developer-guide/  # Guia do desenvolvedor
├── changelog/        # Release notes
└── adr/              # Architecture Decision Records
```

## Docker

Nova configuração Docker:

```bash
# Produção
docker compose build
docker compose up -d

# Desenvolvimento
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Scripts de Verificação

```bash
pnpm verify              # Verificação completa do projeto
pnpm verify:permissions  # Valida permissões
pnpm verify:routes       # Valida rotas
pnpm verify:modules      # Valida estrutura dos módulos
pnpm verify:env          # Valida variáveis de ambiente
```
