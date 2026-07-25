# ADR-001: Estrutura Monorepo com pnpm Workspaces

## Status

**Aceito**

## Contexto

O Visual ERP é uma plataforma SaaS que precisa atender a múltiplos frontends (portal do colaborador, portal do cliente, aplicativo mobile) e compartilhar código entre eles. As opções consideradas foram:

1. **Monorepo gerenciado por pnpm workspaces**
2. **Multi-repo** — repositórios independentes para cada aplicação
3. **Monorepo com Nx** — ferramenta mais pesada
4. **Monorepo com Turborepo** — gerenciamento de cache e tasks

## Decisão

Adotar **pnpm workspaces** como gerenciador de monorepo, com a seguinte estrutura:

```
visual-erp/
├── apps/           # Aplicações independentes
│   ├── mobile/
│   ├── portal-cliente/
│   └── portal-colaborador/
├── packages/       # Pacotes compartilhados
│   ├── api/
│   ├── auth/
│   ├── config/
│   ├── types/
│   ├── ui/
│   └── utils/
└── pnpm-workspace.yaml
```

## Consequências

### Positivas

- Compartilhamento de tipos, componentes UI e lógica de autenticação entre todas as aplicações
- Gerenciamento unificado de dependências com `pnpm-lock.yaml`
- Instalação mais rápida com o cache do pnpm
- Facilidade para criar testes cross-aplicação
- Uso do Turborepo para cache de build e paralelização de tasks

### Negativas

- Maior complexidade inicial de configuração
- Necessidade de cuidado com versionamento de pacotes internos
- Curva de aprendizado para desenvolvedores não familiarizados com monorepo

## Alternativas Consideradas

- **Multi-repo** foi rejeitado por duplicação de código e dificuldade de manter consistência entre projetos
- **Nx** foi rejeitado por overhead adicional desnecessário para o porte atual do projeto
