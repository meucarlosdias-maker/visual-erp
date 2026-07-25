# Versionamento - Visual ERP

## Estratégia

Seguimos [Semantic Versioning](https://semver.org/):

**MAJOR.MINOR.PATCH**

- **MAJOR** (v1, v2): Mudanças incompatíveis na API ou arquitetura
- **MINOR** (v1.0, v1.1): Novas funcionalidades compatíveis
- **PATCH** (v1.0.0, v1.0.1): Correções de bugs

## Versões

### Planejadas

| Versão | Tipo | Previsão | Descrição |
|--------|------|----------|-----------|
| v1.0.0-rc1 | Release Candidate | Atual | Primeira candidata a produção |
| v1.0.0 | Stable | Próxima | Versão estável inicial |
| v1.0.1 | Patch | Futura | Correções pós-lançamento |
| v1.1.0 | Minor | Futura | Novas funcionalidades |
| v2.0.0 | Major | Futura | Breaking changes |

### Histórico

| Versão | Data | Descrição |
|--------|------|-----------|
| v1.0.0-rc1 | 2026-07-22 | Release Candidate: testes, segurança, documentação |
| v0.1.0 | 2026-06 | MVP: módulos core implementados |

## Branches

```mermaid
gitGraph
    main
    branch v1.0.x
    branch feature/dashboard
    branch feature/admin
    commit id: "v0.1.0"
    checkout feature/admin
    commit id: "admin-module"
    checkout feature/dashboard
    commit id: "dashboard-module"
    checkout main
    merge feature/admin
    merge feature/dashboard
    commit id: "v1.0.0-rc1"
    checkout v1.0.x
    commit id: "hotfix"
    checkout main
    merge v1.0.x
    commit id: "v1.0.1"
```

### Convenção

| Branch | Nome | Propósito |
|--------|------|-----------|
| `main` | `main` | Versão estável |
| `v1.0.x` | `v1.0.x` | Hotfixes para v1.0 |
| `develop` | `develop` | Desenvolvimento diário |
| `feature/*` | `feature/nome` | Novas funcionalidades |
| `fix/*` | `fix/descricao` | Correções |
| `release/*` | `release/v1.0.0` | Preparação de release |

## Tags

```bash
# Criar tag
git tag -a v1.0.0-rc1 -m "Release Candidate 1"
git push origin v1.0.0-rc1

# Listar tags
git tag -l

# Remover tag (se necessário)
git tag -d v1.0.0-rc1
git push origin :refs/tags/v1.0.0-rc1
```

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para o histórico completo de versões.
