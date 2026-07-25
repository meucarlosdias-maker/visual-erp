# Manual do Administrador - Visual ERP

## 1. Instalação

### Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (via Supabase)
- Conta Vercel (deploy)
- Conta Supabase (auth + database)

### Passo a Passo

```bash
# 1. Clonar repositório
git clone <repo-url> visual-erp
cd visual-erp

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env.local
# Editar .env.local com credenciais do Supabase

# 4. Gerar Prisma Client
npm run db:generate

# 5. Executar migrations
npm run db:migrate

# 6. Iniciar desenvolvimento
npm run dev
```

## 2. Atualização

```bash
# 1. Pull das mudanças
git pull origin main

# 2. Instalar novas dependências
npm install

# 3. Rodar novas migrations
npm run db:migrate

# 4. Regenerar Prisma Client
npm run db:generate

# 5. Build
npm run build

# 6. Deploy (Vercel)
git push origin main
```

## 3. Gestão de Usuários

### Criação

1. Acessar `/app/configuracoes/usuarios`
2. Clicar em "Novo Usuário"
3. Preencher: nome, email, telefone, cargo
4. Selecionar papel (role): SUPER_ADMIN, ADMIN, MANAGER, TEAM_MEMBER, VIEWER
5. Salvar — convite será enviado por email

### Edição

1. Localizar usuário na listagem
2. Clicar no nome para editar
3. Alterar campos necessários
4. Salvar

### Exclusão

1. Clicar no ícone de excluir
2. Confirmar exclusão
3. O usuário é marcado como inativo (soft delete)

## 4. Gestão de Permissões

### Papéis Pré-definidos

| Papel | Descrição |
|-------|-----------|
| SUPER_ADMIN | Acesso total a todas as funcionalidades |
| ADMIN | Gerenciamento de usuários, clientes, projetos, financeiro |
| MANAGER | CRUD de clientes, visualização de projetos e relatórios |
| TEAM_MEMBER | Operações do dia a dia (OS, produção) |
| VIEWER | Apenas visualização de dados |

### Como Atribuir

1. Acessar `/app/admin/roles`
2. Cada papel possui permissões predefinidas
3. Para ajustes finos, acessar `/app/admin/permissoes`

## 5. Logs e Auditoria

### Logs do Sistema

Acessar `/app/admin/logs`
- Filtrar por nível (info, warn, error)
- Filtrar por módulo
- Buscar por texto

### Auditoria

Acessar `/app/admin/auditoria`
- Timeline visual de todas as operações
- Mostra valores "antes" e "depois"
- Filtrar por entidade e ação

### Sessões Ativas

Acessar `/app/admin/sessoes`
- Lista todas as sessões ativas
- Possibilidade de revogar sessões individuais

## 6. Segurança

### Configurações

Acessar `/app/admin/seguranca`
- Tempo de expiração de sessão
- Número máximo de tentativas de login
- Tempo de bloqueio após tentativas
- MFA (estrutura preparada)

## 7. Backup

Ver [BACKUP.md](BACKUP.md) para procedimentos detalhados.

## 8. Monitoramento

- **Health Check:** `GET /api/health`
- **Logs de Erro:** Vercel Dashboard → Logs
- **Database:** Supabase Dashboard → Database → Logs
