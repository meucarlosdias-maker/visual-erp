# Regras de Negócio

## Ciclo de Vida da Ordem de Serviço (Work Order)

A ordem de serviço (OS) percorre um ciclo de vida definido por status que refletem o progresso operacional:

```
PENDENTE -> EM_ANDAMENTO -> EM_PRODUCAO -> PRONTO -> INSTALADO -> ENTREGUE -> FATURADO
                                                                         -> CANCELADO
```

### Regras

1. Uma OS só pode ser criada se houver um projeto associado
2. A OS só pode transitar para `EM_PRODUCAO` se todos os materiais estiverem disponíveis em estoque
3. A OS não pode ser cancelada se estiver em status `INSTALADO` ou `ENTREGUE`
4. Ao marcar como `ENTREGUE`, o sistema deve disparar um evento para criação automática da fatura
5. O cancellationo requer justificativa obrigatória e aprovação de um gerente
6. OS com prioridade `alta` ou `crítica` notificam automaticamente o gerente do departamento

## Qualificação de Leads (CRM)

O processo de qualificação de leads segue a metodologia de temperatura:

```
LEAD -> CONTATADO -> QUALIFICADO -> PROPOSTA_ENVIADA -> NEGOCIACAO -> CONVERTIDO
                                                                   -> PERDIDO
```

### Temperatura

| Temperatura | Critério | Ação |
|---|---|---|
| Frio | Sem contato ou baixo interesse | Nutrir com conteúdo |
| Morno | Demonstraram interesse, sem urgência | Agendar visita técnica |
| Quente | Pronto para comprar, com urgência | Priorizar proposta |

### Regras

1. Lead só pode ser convertido em cliente se tiver temperatura `quente` e pelo menos uma visita técnica realizada
2. Leads `perdidos` devem ter motivo registrado (motivo + concorrente, se aplicável)
3. Leads sem interação por mais de 30 dias são automaticamente rebaixados para `frio`
4. Ao converter um lead, o sistema cria automaticamente um cliente e um projeto em status `PLANNING`

## Motor de Precificação (Pricing Engine)

O cálculo de preço de um orçamento considera múltiplos componentes:

```
Preco Total = Soma(Materiais) + Soma(Servicos) + Soma(Mao-de-Obra) + 
              Soma(Equipamentos) + Soma(Terceirizados) + Soma(Transporte) +
              Margem + Impostos
```

### Calculadoras Especializadas

O motor de precificação (`src/core/engines/pricing/`) possui calculadoras para cada tipo de componente:

- **material-calculator** — Calcula custo de materiais com perda percentual
- **labor-calculator** — Calcula custo de mão-de-obra por equipe e horas estimadas
- **equipment-calculator** — Calcula custo de equipamentos (hora, dia, km)
- **transport-calculator** — Calcula frete e logística
- **outsourced-calculator** — Calcula serviços terceirizados
- **tax-calculator** — Calcula impostos sobre o total
- **margin-calculator** — Calcula margem de contribuição
- **total-calculator** — Agrega todos os cálculos

### Regras

1. Cada item de orçamento pode ser de um `ComponentType` diferente
2. O preço unitário de materiais considera o custo + margem configurada no catálogo
3. A margem mínima por item é definida no serviço do catálogo (`minimumMargin`)
4. Descontos podem ser percentuais ou por valor, aplicados sobre o subtotal
5. O orçamento deve ter margem mínima global de 15% para aprovação automática
6. Versões de orçamento são incrementadas automaticamente a cada alteração após envio

## Fluxo de Produção

O processo produtivo é gerenciado por ordens de produção vinculadas a projetos e departamentos:

```
PROJETO -> TAREFAS (sequenciais/paralelas) -> ORDENS_PRODUCAO -> DEPARTAMENTOS
```

### Regras

1. Uma ordem de produção só pode ser iniciada se a tarefa anterior estiver concluída (se houver dependência)
2. A ordem de produção registra horas estimadas vs horas reais para controle de produtividade
3. Ao finalizar todas as ordens de produção de um projeto, o status do projeto avança automaticamente para `WAITING_INSTALLATION`
4. Departamentos são configuráveis por empresa e cada ordem de produção é alocada a um departamento
5. Equipes são associadas a ordens de produção para rastreamento de produtividade

## Agendamento de Instalação

As instalações seguem uma agenda que coordena equipes, datas e entregas.

### Regras

1. Uma instalação só pode ser agendada se o projeto estiver em status `WAITING_INSTALLATION` ou `INSTALLING`
2. Conflitos de agenda: uma equipe não pode ter duas instalações agendadas no mesmo horário
3. O sistema deve verificar disponibilidade de equipe e equipamentos antes de confirmar o agendamento
4. Instalações podem ser reagendadas, mas o histórico de alterações é registrado
5. A entrega dos materiais para instalação deve ocorrer até 24h antes da data agendada
6. Ao finalizar a instalação, o projeto transita para `FINISHED`

## Regras de Catálogo

Os serviços do catálogo possuem regras específicas do ramo de comunicação visual:

1. Serviços podem exigir aprovação de arte (`requiresApproval`)
2. Serviços podem exigir visita técnica (`requiresVisit`)
3. Serviços com `hasPrinting` ou `hasPainting` ativam workflows específicos de produção
4. Componentes de serviço definem a estrutura de custos (materiais, mão-de-obra, equipamentos)
5. Versões de serviço (`version: "1.0.0"`) permitem rastrear alterações no catálogo
6. Subcategorias organizam serviços por tipo (ex: Plotter, Recorte, Instalação)

## Controle de Acesso

### RBAC

1. `SUPER_ADMIN` tem acesso irrestrito a todos os recursos e empresas
2. `ADMIN` gerencia uma empresa específica com permissões administrativas
3. `MANAGER` pode criar e editar clientes e projetos da sua empresa
4. `TEAM_MEMBER` pode visualizar e atualizar projetos atribuídos
5. `VIEWER` tem acesso somente leitura

### Multi-Tenant

1. Toda consulta a dados é isolada por `companyId`
2. Usuários de uma empresa não podem acessar dados de outra empresa
3. O tenant é resolvido automaticamente a partir do contexto da requisição
4. Registros deletados (soft delete com `deletedAt`) são excluídos das consultas padrão
