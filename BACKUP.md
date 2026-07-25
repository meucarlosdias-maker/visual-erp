# Backup - Visual ERP

## Estratégia

### Retenção

| Tipo | Período | Quantidade |
|------|---------|------------|
| Backup diário | 7 dias | 7 backups |
| Backup semanal | 4 semanas | 4 backups |
| Backup mensal | 3 meses | 3 backups |

## Backup do Banco (PostgreSQL/Supabase)

### Backup Completo

```bash
# Via pg_dump (recomendado)
pg_dump \
  --host=HOST \
  --port=5432 \
  --username=postgres \
  --dbname=visual-erp \
  --format=custom \
  --file=backup-$(date +%Y%m%d_%H%M%S).dump \
  --verbose \
  --no-owner

# Via Supabase CLI
supabase db dump --db-url "$DATABASE_URL" > backup-$(date +%Y%m%d).sql
```

### Backup Incremental

O PostgreSQL não suporta backup incremental nativo.
Use WAL archiving para PITR (Point-in-Time Recovery):

```bash
# Configurar WAL archiving no postgresql.conf
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'
```

### Via Supabase Dashboard

1. Acessar Supabase Dashboard
2. Project → Database → Backups
3. Schedule: Daily (automático)
4. Retenção: 7 dias (gratuito) / 30 dias (pago)

## Backup de Storage

### Supabase Storage

```bash
# Backup via Supabase CLI
supabase storage download visual-erp-uploads ./backups/storage/

# Ou via API
curl -X GET "$SUPABASE_URL/storage/v1/bucket/visual-erp-uploads/files" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## Backup de Configurações

### Variáveis de Ambiente

```bash
# Exportar variáveis
printenv | grep -E '^(NEXT_PUBLIC_|SUPABASE_|DATABASE_|NEXTAUTH_)' > ./backups/env-$(date +%Y%m%d).txt
```

### Arquivos

```bash
# Projeto completo (sem node_modules)
tar -czf visual-erp-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .
```

## Procedimento Agendado

### Script de Backup Automático

```bash
#!/bin/bash
# backup.sh - Executar via cron diariamente

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/visual-erp"

mkdir -p "$BACKUP_DIR/{database,storage,config}"

# Database
pg_dump "$DATABASE_URL" --format=custom \
  --file="$BACKUP_DIR/database/backup-$DATE.dump"

# Storage (opcional - depende do volume)
# rsync -avz ./public/uploads/ "$BACKUP_DIR/storage/"

# Config
printenv | grep -E '^(NEXT_PUBLIC_|SUPABASE_|DATABASE_)' \
  > "$BACKUP_DIR/config/env-$DATE.txt"

# Limpar backups antigos (manter 7 dias)
find "$BACKUP_DIR/database" -name "*.dump" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

### Cron

```bash
# Executar diariamente às 03:00
0 3 * * * /scripts/backup.sh
```
