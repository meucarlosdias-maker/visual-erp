# Guia de Implantação com Docker — Visual ERP

## Visão Geral

Este guia cobre a construção e execução do Visual ERP utilizando Docker e Docker Compose em ambientes de desenvolvimento e produção.

---

## Pré-requisitos

- Docker Engine >= 24.0
- Docker Compose >= 2.20
- Git

---

## Estrutura de Arquivos

```
.
├── Dockerfile                 # Build de produção multi-estágio
├── .dockerignore              # Arquivos ignorados no build
├── docker-compose.yml         # Stack completa (app + banco)
├── docker-compose.dev.yml     # Overrides para desenvolvimento
├── scripts/
│   ├── build.sh               # Script de build
│   └── start.sh               # Script de inicialização
└── docs/deployment/
    └── docker-guide.md        # Este guia
```

---

## Construção

```bash
# Construir a imagem de produção
docker compose build

# Construir sem usar cache
docker compose build --no-cache
```

---

## Execução

### Produção

```bash
# Iniciar todos os serviços em background
docker compose up -d

# Acompanhar os logs
docker compose logs -f

# Parar todos os serviços
docker compose down

# Parar e remover volumes (dados do banco serão perdidos)
docker compose down -v
```

### Desenvolvimento

```bash
# Iniciar com overrides de desenvolvimento
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Recarregar após alterações em dependências
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

---

## Variáveis de Ambiente

| Variável                  | Descrição                     | Obrigatório |
|---------------------------|-------------------------------|-------------|
| `NODE_ENV`                | Ambiente de execução          | Sim         |
| `PORT`                    | Porta da aplicação            | Sim         |
| `DATABASE_URL`            | URL de conexão com PostgreSQL | Sim         |
| `DIRECT_URL`              | URL direta para migrations    | Sim         |
| `NEXT_PUBLIC_SUPABASE_URL`| URL do Supabase               | Sim         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase  | Sim         |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase | Sim         |
| `NEXTAUTH_URL`            | URL do NextAuth               | Sim         |
| `NEXTAUTH_SECRET`         | Segredo do NextAuth           | Sim         |
| `DB_PASSWORD`             | Senha do PostgreSQL           | Sim         |

Configure estas variáveis no arquivo `.env.production` ou passe-as via `environment` no `docker-compose.yml`.

---

## Health Checks

A aplicação expõe um endpoint de health check em `/api/health`.

O Docker Compose está configurado para:

- **App**: verifica `/api/health` a cada 30s, com timeout de 10s e 40s de tolerância inicial.
- **Banco**: verifica `pg_isready` a cada 10s, com timeout de 5s e 10s de tolerância inicial.

O serviço `app` só inicia após o banco estar saudável (`condition: service_healthy`).

---

## Considerações para Produção

### Volumes

O volume `postgres-data` persiste os dados do banco. Em produção, considere:

- Usar um volume com driver específico (ex: `local`, `nfs`, `cloudstor`).
- Fazer backups regulares do volume.
- Não remover o volume ao atualizar a stack.

### Segredos

Nunca commite arquivos `.env*` com credenciais reais. Use:

- **Docker Secrets** para gerenciar senhas e chaves.
- **Variáveis de ambiente** injetadas pela plataforma de orquestração (Kubernetes, Swarm, etc.).
- **Cofres**: HashiCorp Vault, AWS Secrets Manager, etc.

### Escalabilidade

- O serviço `app` é stateless e pode ser escalado horizontalmente.
- Para múltiplas réplicas, use um proxy reverso (nginx, Traefik) e um mecanismo de sessão externo (Redis).
- O banco PostgreSQL deve ser gerenciado separadamente em produção (RDS, Cloud SQL, etc.).

### Atualizações

```bash
# Atualizar a aplicação
git pull
docker compose build
docker compose up -d

# Aplicar migrações de banco
docker compose exec app pnpm db:migrate
```

### Monitoramento

- Configure alertas para falhas de health check.
- Monitore uso de CPU, memória e disco dos containers.
- Centralize logs com Docker Driver ou ferramentas externas (Loki, ELK, Datadog).

---

## Comandos Úteis

```bash
# Acessar o container da aplicação
docker compose exec app /bin/sh

# Acessar o banco de dados
docker compose exec db psql -U postgres -d visual-erp-prod

# Ver logs do banco
docker compose logs db

# Verificar uso de recursos
docker stats

# Executar migrações Prisma
docker compose exec app pnpm db:migrate

# Gerar cliente Prisma
docker compose exec app pnpm db:generate
```

---

## Solução de Problemas

**Erro: "port 3000 already in use"**
→ Pare o serviço local ou altere a porta no `docker-compose.yml`.

**Erro: "connection refused db:5432"**
→ Aguarde o banco iniciar completamente e verifique o health check.

**Erro: "permission denied" ao executar scripts**
→ Execute `chmod +x scripts/*.sh` no host.

**Cache de build causando problemas**
→ Use `docker compose build --no-cache` para limpar o cache.
