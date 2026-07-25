# Restore - Visual ERP

## Restore do Banco

### Via pg_restore (formato custom)

```bash
# Listar conteúdo do backup
pg_restore --list backup-20260722_030000.dump

# Restaurar completo
pg_restore \
  --host=HOST \
  --port=5432 \
  --username=postgres \
  --dbname=visual-erp \
  --clean \
  --if-exists \
  --no-owner \
  --verbose \
  backup-20260722_030000.dump
```

### Via SQL dump

```bash
# Restaurar dump SQL
psql "$DATABASE_URL" < backup-20260722.sql
```

### Via Supabase Dashboard

1. Acessar Supabase Dashboard
2. Project → Database → Backups
3. Selecionar backup desejado
4. Click "Restore"
5. Confirmar (⚠️ dados atuais serão substituídos)

## Restore de Storage

```bash
# Via Supabase CLI
supabase storage upload visual-erp-uploads ./backups/storage/ --recursive
```

## Restore de Configurações

```bash
# Recarregar variáveis de ambiente
set -a; source ./backups/config/env-20260722.txt; set +a
```

## Procedimento de Rollback

### Reverter Migration

```bash
# Reverter última migration
npx prisma migrate down

# Reverter para migration específica
npx prisma migrate reset --force
```

### Rollback de Código

```bash
# Voltar para versão anterior
git revert HEAD
git push origin main

# Rebuild + redeploy (automático via Vercel)
```

## Checklist de Restore

- [ ] Backup verificado (checksum válido)
- [ ] Database restaurada com sucesso
- [ ] Storage restaurado
- [ ] Variáveis de ambiente recarregadas
- [ ] Prisma generate executado
- [ ] Health Check funcional (`GET /api/health`)
- [ ] Login funcional
- [ ] Dados visíveis no dashboard
- [ ] Notificar usuários sobre restauração

## RTO e RPO

| Métrica | Alvo |
|---------|------|
| RTO (Recovery Time) | < 4 horas |
| RPO (Recovery Point) | < 24 horas |
