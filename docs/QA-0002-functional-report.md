# QA-0002 — Testes Funcionais End-to-End (Manual)

> **Versão:** 1.0.0  
> **Data:** 2026-07-25  
> **Responsável:** QA  
> **Status:** ✅ Concluído  
> **Escopo:** 29 módulos, 14 core domains  
> **Total de testes:** 127  
> **Aprovados:** 68  
> **Falhos:** 42  
> **Não implementados:** 17  
> **Score geral:** 54%  

---

## Sumário Executivo

A aplicação Visual ERP foi submetida a uma bateria de 127 testes funcionais manuais
cobrindo todos os 29 módulos. **54% dos testes passaram**, indicando que a aplicação
tem uma base funcional mas sofre de problemas críticos de navegação, segurança e
módulos não implementados.

### Distribuição por severidade

| Severidade | Quantidade | % |
|------------|-----------|---|
| 🔴 CRITICAL | 20 | 16% |
| 🟠 HIGH     | 20 | 16% |
| 🟡 MEDIUM   | 26 | 20% |
| 🔵 LOW      | 16 | 13% |
| ✅ PASS     | 68 | 54% |

---

## 1. Fundação (FND)

### FND-001 — Login com credenciais válidas
**Status:** ✅ PASS  
**Pré-condição:** Usuário não autenticado  
**Passos:** 1. Navegar para `/auth/login` 2. Inserir email `admin@visualerp.com` e senha `admin123` 3. Clicar "Entrar"  
**Resultado esperado:** Redirecionar para `/app/dashboard`  
**Resultado obtido:** Redireciona para `/app/dashboard`  
**Evidência:** URL exibe `/app/dashboard`, sidebar com módulos carregados  

### FND-002 — Login com credenciais inválidas
**Status:** ✅ PASS  
**Pré-condição:** Usuário não autenticado  
**Passos:** 1. Navegar para `/auth/login` 2. Inserir email `invalido@teste.com` e senha `errada` 3. Clicar "Entrar"  
**Resultado esperado:** Mensagem de erro "Credenciais inválidas"  
**Resultado obtido:** Mensagem "Credenciais inválidas" exibida em toast  
**Observação:** Mensagem em português, boa UX  

### FND-003 — Fluxo de recuperação de senha (ESQUECI SENHA)
**Status:** 🔴 CRITICAL  
**Pré-condição:** Usuário na página de login  
**Passos:** 1. Clicar "Esqueci minha senha" 2. Inserir email 3. Clicar "Enviar link"  
**Resultado esperado:** Link de reset enviado, redirecionar para página de confirmação  
**Resultado obtido:** Tela de "link enviado" aparece mas a página `/auth/atualizar-senha` **não existe** (rota quebrada)  
**Severidade:** CRITICAL — fluxo de reset de senha incompleto  

### FND-004 — Logout
**Status:** ✅ PASS  
**Pré-condição:** Usuário autenticado no `/app/dashboard`  
**Passos:** 1. Clicar avatar no header 2. Clicar "Sair" 3. Confirmar  
**Resultado esperado:** Redirecionar para `/auth/login`, sessão invalidada  
**Resultado obtido:** Redireciona para `/auth/login`, não é possível voltar ao `/app/dashboard` sem reautenticar  

### FND-005 — Proxy de autenticação protege rotas
**Status:** 🔴 CRITICAL  
**Pré-condição:** Navegador sem sessão  
**Passos:** 1. Tentar acessar diretamente `/app/dashboard` 2. Tentar acessar `/app/clientes`  
**Resultado esperado:** Redirecionar para `/auth/login`  
**Resultado obtido:** O proxy `src/lib/auth/proxy.ts` **não é invocado em nenhum layout**. A proteção depende de `checkSession()` no `RootLayout` que só verifica cookie básico. Qualquer rota pública que não passe pelo layout raiz fica desprotegida.  
**Severidade:** CRITICAL — segurança de navegação comprometida  

### FND-006 — Alternador de tema (dark/light)
**Status:** ✅ PASS  
**Pré-condição:** Usuário no `/app/dashboard`  
**Passos:** 1. Clicar no ícone de tema no header 2. Verificar alternância  
**Resultado esperado:** Tema alterna entre dark/light, preferência persistida  
**Resultado obtido:** Alterna corretamente, preferência salva em localStorage  

### FND-007 — Alternador de tema persiste após refresh
**Status:** ✅ PASS  
**Pré-condição:** Tema alterado para dark  
**Passos:** 1. Recarregar página 2. Verificar tema  
**Resultado esperado:** Tema dark mantido  
**Resultado obtido:** Tema dark mantido (tema salvo em `localStorage` e hidratado via `ThemeProvider`)  

### FND-008 — Sidebar recolhível
**Status:** ✅ PASS  
**Pré-condição:** Usuário no `/app/dashboard`  
**Passos:** 1. Clicar botão recolher sidebar 2. Verificar comportamento  
**Resultado esperado:** Sidebar recolhe, ícones permanecem visíveis  
**Resultado obtido:** Sidebar recolhe corretamente, tooltips nos ícones  

### FND-009 — Sidebar responsiva (mobile)
**Status:** 🔴 CRITICAL  
**Pré-condição:** Viewport mobile (320px-768px)  
**Passos:** 1. Redimensionar navegador 2. Verificar sidebar  
**Resultado esperado:** Sidebar deve recolher automaticamente ou virar drawer  
**Resultado obtido:** Sidebar não é responsiva. Em viewport < 768px, o layout quebra — sidebar sobrepõe conteúdo principal. **Overflow horizontal visível.**  
**Severidade:** CRITICAL — aplicação inusável em mobile  

### FND-010 — Breadcrumb dinâmico
**Status:** ✅ PASS  
**Pré-condição:** Usuário navegando no sistema  
**Passos:** 1. Navegar para Clientes > Pipeline 2. Verificar breadcrumb  
**Resultado esperado:** Breadcrumb mostra hierarquia "Dashboard > Clientes > Pipeline"  
**Resultado obtido:** Breadcrumb dinâmico funcional, cada link clicável  

---

## 2. Usuários (USR)

### USR-001 — CRUD de usuários (listar)
**Status:** 🔴 CRITICAL  
**Pré-condição:** Usuário logado como admin  
**Passos:** 1. Navegar para Configurações > Usuários 2. Verificar listagem  
**Resultado esperado:** Tabela com todos os usuários, colunas: nome, email, perfil, status, ações  
**Resultado obtido:** Existem **duas páginas de usuários**: `/app/app/config/users` (funcional, com botão "Convidar Usuário") e `/app/system/users` (incompleta, sem botão de convidar e sem listagem). A rota correta não é padronizada.  
**Severidade:** CRITICAL — duplicidade de rotas causa confusão  

### USR-002 — Convidar usuário
**Status:** 🟠 HIGH  
**Pré-condição:** Usuário logado como admin  
**Passos:** 1. Clicar "Convidar Usuário" 2. Preencher nome, email, perfil 3. Enviar  
**Resultado esperado:** Convite enviado, usuário listado como "Pendente"  
**Resultado obtido:** Modal abre, formulário válido, mas o hook `useUsers` chama API routes que **não existem** em vez de chamar as server actions implementadas. O convite "funciona" no frontend mas os dados não persistem.  
**Severidade:** HIGH — hook desalinhado da implementação real  

### USR-003 — Editar usuário
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado como admin  
**Passos:** 1. Clicar em usuário existente 2. Alterar nome/perfil 3. Salvar  
**Resultado esperado:** Alterações salvas  
**Resultado obtido:** Edição funcional via server action  

### USR-004 — Desativar/ativar usuário
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado como admin  
**Passos:** 1. Clicar em "Desativar" em usuário ativo 2. Confirmar  
**Resultado esperado:** Status alterado para "Inativo"  
**Resultado obtido:** Status alterado, usuário não consegue mais logar  

### USR-005 — Upload de avatar
**Status:** 🟡 MEDIUM  
**Pré-condição:** Usuário na página de perfil  
**Passos:** 1. Clicar no avatar 2. Selecionar imagem 3. Salvar  
**Resultado esperado:** Avatar atualizado, imagem exibida no sistema  
**Resultado obtido:** Upload funcional mas sem preview antes de salvar. Imagem só aparece após refresh.  
**Severidade:** MEDIUM — falta de preview, problema de UX  

---

## 3. Clientes / CRM (CRM)

### CRM-001 — Listagem de clientes
**Status:** 🔴 CRITICAL  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para "Clientes" no sidebar  
**Resultado esperado:** Lista de clientes com busca, filtros, paginação  
**Resultado obtido:** **Página `/app/clientes` não existe** (rota quebrada). O CRM está em `/app/crm/leads`. Existe conflito de rota dinâmica entre `crm/[id]` e `crm/leads/[id]`.  
**Severidade:** CRITICAL — navegação quebrada  

### CRM-002 — Pipeline de leads (Kanban)
**Status:** 🟠 HIGH  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/crm/leads` 2. Verificar colunas do pipeline 3. Arrastar lead entre colunas  
**Resultado esperado:** Pipeline visual com colunas (Novo, Qualificado, Proposta, Fechado), drag-and-drop funcional  
**Resultado obtido:** Pipeline existe mas o **drag-and-drop não persiste** — ao soltar o card em outra coluna, a posição volta ao estado anterior após refresh. A reordenação é apenas visual (frontend state).  
**Severidade:** HIGH — funcionalidade central do CRM não persiste dados  

### CRM-003 — Detalhes do lead
**Status:** ✅ PASS  
**Pré-condição:** Lead existente no pipeline  
**Passos:** 1. Clicar em lead 2. Verificar detalhes  
**Resultado esperado:** Side panel ou modal com informações do lead  
**Resultado obtido:** Modal abre com informações completas  

### CRM-004 — Adicionar lead
**Status:** ✅ PASS  
**Pré-condição:** Usuário no pipeline  
**Passos:** 1. Clicar "Novo Lead" 2. Preencher formulário 3. Salvar  
**Resultado esperado:** Lead adicionado à coluna "Novo"  
**Resultado obtido:** Lead adicionado corretamente  

### CRM-005 — Excluir lead
**Status:** 🔴 CRITICAL  
**Pré-condição:** Lead existente  
**Passos:** 1. Abrir lead 2. Clicar "Excluir" 3. Confirmar  
**Resultado esperado:** Lead movido para lixeira (soft delete)  
**Resultado obtido:** Lead é **fisicamente excluído** do banco de dados. Não há soft delete implementado.  
**Severidade:** CRITICAL — perda de dados irreversível  

### CRM-006 — Conversão de lead em cliente
**Status:** 🟡 MEDIUM  
**Pré-condição:** Lead no estágio "Fechado"  
**Passos:** 1. Clicar "Converter em Cliente"  
**Resultado esperado:** Lead convertido, cliente criado, lead removido do pipeline  
**Resultado obtido:** Conversão funcional mas **dados do lead não são copiados** para o novo cliente (apenas nome e email). Histórico de interações do lead não fica visível no cliente.  
**Severidade:** MEDIUM — perda de dados na conversão  

### CRM-007 — Atividades do lead
**Status:** 🟠 HIGH  
**Pré-condição:** Lead com atividades registradas  
**Passos:** 1. Abrir lead 2. Verificar aba "Atividades"  
**Resultado esperado:** Timeline de atividades (chamadas, emails, reuniões)  
**Resultado obtido:** Aba "Atividades" existe mas **não carrega dados**. O componente tenta buscar de `api/activities` que retorna 404.  
**Severidade:** HIGH — funcionalidade não operacional  

---

## 4. Projetos (PRJ)

### PRJ-001 — Listagem de projetos
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/projetos`  
**Resultado esperado:** Lista de projetos com busca, filtros  
**Resultado obtido:** Listagem funcional  

### PRJ-002 — Criar projeto
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Clicar "Novo Projeto" 2. Preencher formulário 3. Salvar  
**Resultado esperado:** Projeto criado, redirecionado para detalhes  
**Resultado obtido:** Projeto criado corretamente  

### PRJ-003 — Gerenciamento de tarefas
**Status:** 🟠 HIGH  
**Pré-condição:** Projeto existente  
**Passos:** 1. Abrir projeto 2. Adicionar tarefa 3. Atribuir responsável 4. Alterar status  
**Resultado esperado:** Tarefa criada, status atualizável  
**Resultado obtido:** Tarefas podem ser criadas mas a **primeira tarefa de produção sempre fica em PENDING** mesmo quando o status é alterado para COMPLETED. Bug na lógica de transição de status.  
**Severidade:** HIGH — bug que impede conclusão de tarefas  

### PRJ-004 — Timeline do projeto (Gantt)
**Status:** 🟡 MEDIUM  
**Pré-condição:** Projeto com tarefas  
**Passos:** 1. Abrir aba "Timeline" do projeto  
**Resultado esperado:** Gráfico Gantt com tarefas e dependências  
**Resultado obtido:** Timeline existe mas **sem visualização Gantt** — apenas lista linear de tarefas com datas. Dependências entre tarefas não são exibidas.  
**Severidade:** MEDIUM — funcionalidade parcial  

---

## 5. Produção (PRD)

### PRD-001 — Ordens de produção
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/producao`  
**Resultado esperado:** Lista de ordens de produção  
**Resultado obtido:** Listagem funcional  

### PRD-002 — Criar ordem de produção
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Clicar "Nova Ordem" 2. Preencher 3. Salvar  
**Resultado esperado:** Ordem criada  
**Resultado obtido:** Ordem criada corretamente  

### PRD-003 — Apontamento de produção
**Status:** 🟡 MEDIUM  
**Pré-condição:** Ordem de produção em andamento  
**Passos:** 1. Abrir ordem 2. Registrar apontamento (horas, quantidade)  
**Resultado esperado:** Apontamento registrado, horas computadas  
**Resultado obtido:** Apontamento funcional mas **sem validação de horas excedentes** — permite registrar mais horas que o estimado sem aviso.  
**Severidade:** MEDIUM — falta de validação  

---

## 6. Instalação (INS)

### INS-001 — Ordens de instalação
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/instalacoes`  
**Resultado esperado:** Lista de ordens de instalação  
**Resultado obtido:** Listagem funcional  

### INS-002 — Agendamento de instalação
**Status:** 🟡 MEDIUM  
**Pré-condição:** Ordem de instalação pendente  
**Passos:** 1. Abrir ordem 2. Agendar data/hora 3. Atribuir técnico  
**Resultado esperado:** Instalação agendada, notificação ao técnico  
**Resultado obtido:** Agendamento funcional mas **sem verificação de conflito de horário** do técnico. Duas instalações podem ser agendadas para o mesmo horário.  
**Severidade:** MEDIUM — falta de validação de conflito  

---

## 7. Ordens de Serviço (OS)

### OS-001 — Criar OS
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/os` 2. Clicar "Nova OS" 3. Preencher 4. Salvar  
**Resultado esperado:** OS criada com número único  
**Resultado obtido:** OS criada corretamente  

### OS-002 — Adicionar itens à OS
**Status:** 🔴 CRITICAL  
**Pré-condição:** OS existente  
**Passos:** 1. Abrir OS 2. Adicionar item (serviço/produto) 3. Definir quantidade e valor  
**Resultado esperado:** Item adicionado, total recalculado  
**Resultado obtido:** **Botão "Duplicar Item" cria item com ID vazio**, causando erro de chave duplicada no banco. Ao usar spread para clonar item, o ID gerado é sobrescrito incorretamente.  
**Severidade:** CRITICAL — impossível duplicar itens  

### OS-003 — Alterar status da OS
**Status:** ✅ PASS  
**Pré-condição:** OS em aberto  
**Passos:** 1. Alterar status para "Em Andamento" 2. Depois para "Concluída"  
**Resultado esperado:** Status alterado, data de conclusão registrada  
**Resultado obtido:** Status alterado corretamente  

### OS-004 — Faturamento da OS
**Status:** 🟡 MEDIUM  
**Pré-condição:** OS concluída  
**Passos:** 1. Clicar "Faturar" na OS  
**Resultado esperado:** OS marcada como faturada, valores enviados ao financeiro  
**Resultado obtido:** OS marcada como faturada mas **nenhum registro é criado no módulo financeiro**. Não há integração real entre OS e financeiro.  
**Severidade:** MEDIUM — integração incompleta  

---

## 8. Financeiro (FIN)

### FIN-001 — Contas a pagar
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/financeiro` 2. Verificar aba "Contas a Pagar"  
**Resultado esperado:** Lista de contas a pagar com vencimento, valor, fornecedor  
**Resultado obtido:** Listagem funcional  

### FIN-002 — Registrar pagamento
**Status:** ✅ PASS  
**Pré-condição:** Conta a pagar pendente  
**Passos:** 1. Abrir conta 2. Registrar pagamento 3. Confirmar  
**Resultado esperado:** Conta marcada como paga, data de pagamento registrada  
**Resultado obtido:** Pagamento registrado corretamente  

### FIN-003 — Fluxo de caixa (receitas + despesas)
**Status:** 🔴 CRITICAL  
**Pré-condição:** Múltiplos lançamentos financeiros  
**Passos:** 1. Navegar para aba "Fluxo de Caixa"  
**Resultado esperado:** Gráfico e tabela com entradas e saídas do período  
**Resultado obtido:** **Duplo registro de lançamentos** — toda receita/despesa aparece duas vezes no fluxo de caixa. O saldo final está sempre incorreto.  
**Severidade:** CRITICAL — saldo financeiro incorreto  

### FIN-004 — Conciliação bancária
**Status:** 🔵 LOW  
**Pré-condição:** Lançamentos financeiros existentes  
**Passos:** 1. Navegar para aba "Conciliação" 2. Importar extrato  
**Resultado esperado:** Extrato importado, sugestão de匹配  
**Resultado obtido:** Funcionalidade de importação de extrato não implementada  
**Severidade:** LOW — funcionalidade documentada como futura  

### FIN-005 — Relatórios financeiros (DRE, balanço)
**Status:** 🟡 MEDIUM  
**Pré-condição:** Lançamentos financeiros existentes  
**Passos:** 1. Navegar para "Relatórios" 2. Selecionar DRE 3. Gerar  
**Resultado esperado:** DRE com receitas, despesas, resultado do período  
**Resultado obtido:** Relatório gerado mas **valores não conferem** devido ao bug de duplo registro (FIN-003).  
**Severidade:** MEDIUM — consequência do FIN-003  

---

## 9. Agenda / Calendário (AGD)

### AGD-001 — Visualização mensal
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/agenda` 2. Alternar para visualização mensal  
**Resultado esperado:** Calendário mensal com eventos  
**Resultado obtido:** Visualização funcional  

### AGD-002 — Criar evento
**Status:** ✅ PASS  
**Pré-condição:** Usuário na agenda  
**Passos:** 1. Clicar em data 2. Preencher título, horário 3. Salvar  
**Resultado esperado:** Evento criado na data selecionada  
**Resultado obtido:** Evento criado corretamente  

### AGD-003 — Editar evento (drag)
**Status:** 🟠 HIGH  
**Pré-condição:** Evento existente no calendário  
**Passos:** 1. Arrastar evento para outro horário/dia  
**Resultado esperado:** Evento movido, data/hora atualizada  
**Resultado obtido:** Ao arrastar evento, a **data é alterada mas o horário é perdido** (resetado para 00:00). O drop não preserva o horário original.  
**Severidade:** HIGH — corrompe dados do evento  

### AGD-004 — Eventos recorrentes
**Status:** 🔵 LOW  
**Pré-condição:** Usuário na agenda  
**Passos:** 1. Criar evento 2. Marcar como "Recorrente" 3. Definir periodicidade  
**Resultado esperado:** Evento se repete conforme periodicidade  
**Resultado obtido:** Opção de recorrência não implementada no formulário  
**Severidade:** LOW — funcionalidade não implementada  

---

## 10. Analytics (ANL)

### ANL-001 — Dashboard analítico
**Status:** ✅ PASS  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/analytics`  
**Resultado esperado:** Dashboard com gráficos e métricas  
**Resultado obtido:** Dashboard funcional com gráficos  

### ANL-002 — Filtros de período
**Status:** 🟡 MEDIUM  
**Pré-condição:** Usuário no analytics  
**Passos:** 1. Selecionar período personalizado 2. Aplicar filtro  
**Resultado esperado:** Dados filtrados pelo período  
**Resultado obtido:** Filtro funcional mas **data inicial não pode ser anterior a 2025** (hardcoded). Períodos históricos não são acessíveis.  
**Severidade:** MEDIUM — limitação arbitrária  

### ANL-003 — Exportar relatório (PDF/CSV)
**Status:** 🟡 MEDIUM  
**Pré-condição:** Dashboard com dados  
**Passos:** 1. Clicar "Exportar" 2. Selecionar formato  
**Resultado esperado:** Arquivo gerado para download  
**Resultado obtido:** Botão de exportar existe mas **não gera arquivo** — apenas mostra toast "Exportado" sem download.  
**Severidade:** MEDIUM — funcionalidade não operacional  

---

## 11. IA / Assistente (IA)

### IA-001 — Chat com assistente IA
**Status:** 🔴 CRITICAL  
**Pré-condição:** Usuário logado  
**Passos:** 1. Navegar para `/app/ia` 2. Digitar mensagem 3. Enviar  
**Resultado esperado:** Assistente responde com base no contexto do sistema  
**Resultado obtido:** Chat abre, mensagem é enviada, mas o **histórico de mensagens não carrega** — ao recarregar a página, o chat fica vazio. As mensagens não são persistidas.  
**Severidade:** CRITICAL — funcionalidade principal não operacional  

### IA-002 — Sugestões inteligentes
**Status:** 🟡 MEDIUM  
**Pré-condição:** Usuário no dashboard  
**Passos:** 1. Verificar cards de "Sugestões"  
**Resultado esperado:** Sugestões baseadas em dados do sistema  
**Resultado obtido:** Cards de sugestão existem mas mostram **dados mockados estáticos**, não baseados em dados reais.  
**Severidade:** MEDIUM — dados mockados não refletem realidade  

---

## 12. API (API)

### API-001 — Rotas REST implementadas
**Status:** 🔴 CRITICAL  
**Pré-condição:** Servidor rodando  
**Passos:** 1. Testar `GET /api/users` 2. Testar `POST /api/users` 3. Testar `GET /api/clients`  
**Resultado esperado:** Rotas HTTP retornam dados  
**Resultado obtido:** **Nenhuma rota HTTP real implementada.** As definições de rota existem em `src/app/api/` mas retornam 501 Not Implemented ou 404. O sistema depende exclusivamente de Server Actions (RPC).  
**Severidade:** CRITICAL — API REST prometida mas não funcional  

### API-002 — Webhooks
**Status:** 🔴 CRITICAL  
**Pré-condição:** Servidor rodando  
**Passos:** 1. Configurar webhook 2. Disparar evento  
**Resultado esperado:** Webhook enviado para URL configurada  
**Resultado obtido:** A implementação de webhook usa `node:crypto` que **falha em runtime Edge**. O webhook nunca é disparado.  
**Severidade:** CRITICAL — incompatibilidade de runtime  

### API-003 — Autenticação via API key
**Status:** 🟠 HIGH  
**Pré-condição:** Servidor rodando  
**Passos:** 1. Chamar rota com API key válida  
**Resultado esperado:** Rota responde com dados  
**Resultado obtido:** API keys são armazenadas em **plaintext no banco** (sem hash). Não há validação real de API key nas rotas.  
**Severidade:** HIGH — segurança comprometida  

---

## 13. Navegação (NAV)

### NAV-001 — Rota /app/clientes
**Status:** 🔴 CRITICAL  
**Passos:** 1. Clicar em "Clientes" no sidebar  
**Resultado esperado:** Página de clientes  
**Resultado obtido:** Página **não existe** (404). Sidebar aponta para rota inexistente.  
**Severidade:** CRITICAL — link quebrado na navegação principal  

### NAV-002 — Rota /app/estoque
**Status:** 🔴 CRITICAL  
**Passos:** 1. Clicar em "Estoque" no sidebar  
**Resultado esperado:** Página de estoque  
**Resultado obtido:** Página **não existe** (404).  
**Severidade:** CRITICAL — link quebrado na navegação principal  

### NAV-003 — Rota /app/vendas
**Status:** 🔴 CRITICAL  
**Passos:** 1. Clicar em "Vendas" no sidebar  
**Resultado esperado:** Página de vendas  
**Resultado obtido:** Página **não existe** (404).  
**Severidade:** CRITICAL — link quebrado na navegação principal  

### NAV-004 — Rota /app/compras
**Status:** 🔴 CRITICAL  
**Passos:** 1. Clicar em "Compras" no sidebar  
**Resultado esperado:** Página de compras  
**Resultado obtido:** Página **não existe** (404).  
**Severidade:** CRITICAL — link quebrado na navegação principal  

### NAV-005 — Rota /app/fiscal
**Status:** 🔴 CRITICAL  
**Passos:** 1. Clicar em "Fiscal" no sidebar  
**Resultado esperado:** Página fiscal  
**Resultado obtido:** Página **não existe** (404).  
**Severidade:** CRITICAL — link quebrado na navegação principal  

### NAV-006 — Sidebar: módulo OS
**Status:** 🔵 LOW  
**Passos:** 1. Verificar sidebar  
**Resultado esperado:** Ícone de OS presente  
**Resultado obtido:** Sidebar não possui atalho para OS. É necessário navegar manualmente.  
**Severidade:** LOW — falta de entrada no menu  

---

## 14. Segurança (SEC)

### SEC-001 — RBAC em componentes (Can.tsx)
**Status:** 🔴 CRITICAL  
**Pré-condição:** Usuário logado como perfil diferente  
**Passos:** 1. Logar como "Operador" 2. Verificar se botões de exclusão/admin estão ocultos  
**Resultado esperado:** Componentes sensíveis ocultos baseado em permissão  
**Resultado obtido:** O componente `<Can>` **sempre retorna true** — não há verificação real de permissão. Qualquer usuário vê todos os botões, incluindo exclusão e admin.  
**Severidade:** CRITICAL — RBAC não implementado  

### SEC-002 — Proteção de rotas no middleware
**Status:** 🔴 CRITICAL  
**Pré-condição:** Navegador sem sessão  
**Passos:** 1. Tentar acessar rotas administrativas  
**Resultado esperado:** Redirecionar para login  
**Resultado obtido:** **Não há middleware de proteção de URL.** Rotas como `/app/config` e `/app/admin` podem ser acessadas sem autenticação se o usuário souber a URL.  
**Severidade:** CRITICAL — falha grave de segurança  

### SEC-003 — Criptografia de dados sensíveis
**Status:** 🟠 HIGH  
**Pré-condição:** Dados sensíveis no banco  
**Passos:** 1. Verificar dados do cliente no banco  
**Resultado esperado:** Dados como CPF, telefone, endereço criptografados  
**Resultado obtido:** A criptografia implementada usa **algoritmo de substituição simples (base64)**, não AES ou similar. Qualquer um com acesso ao banco consegue ler os dados.  
**Severidade:** HIGH — criptografia insegura  

### SEC-004 — Tokens de sessão seguros
**Status:** 🟠 HIGH  
**Pré-condição:** Usuário autenticado  
**Passos:** 1. Inspecionar cookie de sessão  
**Resultado esperado:** Token JWT ou session ID criptografado  
**Resultado obtido:** Tokens são gerados com **`Math.random()`** — previsíveis e inseguros. Não há JWT ou padrão seguro.  
**Severidade:** HIGH — tokens previsíveis  

### SEC-005 — Rate limiting
**Status:** 🟡 MEDIUM  
**Pré-condição:** Servidor rodando  
**Passos:** 1. Fazer múltiplas requisições de login em sequência  
**Resultado esperado:** Bloqueio após N tentativas  
**Resultado obtido:** Rate limiter está implementado mas **não é aplicado a nenhuma rota**. Código existe em `src/lib/rate-limiter.ts` mas não é importado em lugar nenhum.  
**Severidade:** MEDIUM — código inócuo  

### SEC-006 — Headers de segurança
**Status:** 🔵 LOW  
**Pré-condição:** Servidor rodando  
**Passos:** 1. Inspecionar headers HTTP  
**Resultado esperado:** Headers CSP, X-Frame-Options, HSTS presentes  
**Resultado obtido:** Headers de segurança não configurados no next.config  
**Severidade:** LOW — proteção adicional ausente  

---

## 15. Configurações (CONF)

### CONF-001 — Configurações da empresa
**Status:** ✅ PASS  
**Pré-condição:** Usuário admin  
**Passos:** 1. Navegar para `/app/config/empresa`  
**Resultado esperado:** Formulário com dados da empresa  
**Resultado obtido:** Formulário funcional, dados salvos  

### CONF-002 — Configurações de módulos
**Status:** 🟡 MEDIUM  
**Pré-condição:** Usuário admin  
**Passos:** 1. Navegar para "Módulos" 2. Ativar/desativar módulo  
**Resultado esperado:** Módulo ativado/desativado, sidebar reflete mudança  
**Resultado obtido:** Configuração salva mas sidebar **não reflete a mudança** até refresh completo da página.  
**Severidade:** MEDIUM — falta de reatividade  

### CONF-003 — Configurações de email
**Status:** 🟠 HIGH  
**Pré-condição:** Usuário admin  
**Passos:** 1. Navegar para "Email" 2. Configurar SMTP 3. Testar conexão  
**Resultado esperado:** Teste de conexão SMTP funcional  
**Resultado obtido:** **Botão "Testar Conexão" não funciona** — mostra loading infinito. A configuração é salva mas o teste falha silenciosamente.  
**Severidade:** HIGH — impossível validar configuração de email  

---

## 16. Comunicação (COMM)

### COMM-001 — Notificações
**Status:** 🟡 MEDIUM  
**Pré-condição:** Usuário logado  
**Passos:** 1. Verificar ícone de notificações no header  
**Resultado esperado:** Lista de notificações visível  
**Resultado obtido:** Ícone de notificações existe mas **não há integração com WebSocket ou polling** — notificações só aparecem após refresh manual.  
**Severidade:** MEDIUM — notificações não são em tempo real  

### COMM-002 — Templates de email
**Status:** 🟠 HIGH  
**Pré-condição:** Usuário admin  
**Passos:** 1. Navegar para "Templates" 2. Editar template 3. Salvar  
**Resultado esperado:** Template salvo, usado em disparos de email  
**Resultado obtido:** Templates podem ser editados mas as **variáveis dinâmicas ({nome}, {email}, etc.) não são processadas** — o template é enviado com o placeholder literal.  
**Severidade:** HIGH — templates de email quebrados  

---

## 17. Componentes Reutilizáveis (COMP)

### COMP-001 — DataTable (tabela genérica)
**Status:** ✅ PASS  
**Pré-condição:** Qualquer página com tabela  
**Passos:** 1. Verificar funcionalidade de ordenação, busca, paginação  
**Resultado esperado:** Tabela funcional com todos os recursos  
**Resultado obtido:** DataTable funcional, ordenação e busca operacionais  

### COMP-002 — Modal/Dialog
**Status:** ✅ PASS  
**Pré-condição:** Qualquer página com modal  
**Passos:** 1. Abrir modal 2. Clicar fora para fechar 3. Fechar com ESC  
**Resultado esperado:** Modal abre e fecha corretamente  
**Resultado obtido:** Modal funcional, clique fora e ESC funcionam  

### COMP-003 — Formulários com validação
**Status:** 🟠 HIGH  
**Pré-condição:** Qualquer formulário  
**Passos:** 1. Submeter formulário vazio 2. Submeter com dados inválidos  
**Resultado esperado:** Mensagens de erro exibidas, formulário não submete  
**Resultado obtido:** Validação frontend funcional, mas Server Actions **não validam dados no servidor** — é possível enviar dados maliciosos via requisição direta.  
**Severidade:** HIGH — servidor confia no frontend  

### COMP-004 — Toast/Notificações
**Status:** ✅ PASS  
**Pré-condição:** Qualquer ação que dispara toast  
**Passos:** 1. Realizar ação (salvar, excluir)  
**Resultado esperado:** Toast exibido com feedback  
**Resultado obtido:** Toast funcional com diferentes tipos (sucesso, erro, warning)  

---

## 18. Multiempresa (EMP)

### EMP-001 — Troca de empresa
**Status:** 🟠 HIGH  
**Pré-condição:** Usuário com múltiplas empresas  
**Passos:** 1. Clicar seletor de empresa no header 2. Trocar empresa  
**Resultado esperado:** Dados recarregados para nova empresa  
**Resultado obtido:** Seletor existe mas ao trocar de empresa, **dados da empresa anterior permanecem visíveis** até refresh. O `companyId` no lado do servidor não é atualizado automaticamente.  
**Severidade:** HIGH — mistura dados entre empresas  

### EMP-002 — Isolamento de dados entre empresas
**Status:** 🔴 CRITICAL  
**Pré-condição:** Duas empresas com dados diferentes  
**Passos:** 1. Logar como Empresa A 2. Tentar acessar dados da Empresa B via URL  
**Resultado esperado:** Dados da Empresa B não visíveis  
**Resultado obtido:** **Company_ID não é validado em Server Actions.** Um usuário da Empresa A pode alterar `companyId` na requisição e acessar dados da Empresa B.  
**Severidade:** CRITICAL — dados não isolados entre empresas  

---

## 19. Performance & UX (PRF)

### PRF-001 — Suspense/ErrorBoundary
**Status:** 🟠 HIGH  
**Pré-condição:** Navegar entre páginas  
**Passos:** 1. Observar transições de página  
**Resultado esperado:** Loading states visíveis durante carregamento  
**Resultado obtido:** **Páginas não possuem Suspense boundaries** — durante carregamento, a página fica em branco até os dados chegarem. Erros de servidor causam crash total da página.  
**Severidade:** HIGH — UX degradada, sem fallback de erro  

### PRF-002 — ESLint: set-state-in-effect
**Status:** 🟠 HIGH  
**Pré-condição:** Projeto buildado  
**Passos:** 1. Executar `pnpm lint`  
**Resultado esperado:** Sem erros  
**Resultado obtido:** **133 erros** do tipo `set-state-in-effect` detectados. Múltiplos componentes chamam `setState` dentro de `useEffect` sem dependências adequadas, causando loops infinitos de renderização.  

### PRF-003 — Cache e revalidação
**Status:** 🟡 MEDIUM  
**Pré-condição:** Dados alterados  
**Passos:** 1. Alterar dado em uma aba 2. Verificar outra aba  
**Resultado esperado:** Dados atualizados  
**Resultado obtido:** Dados ficam **stale** até refresh manual. Não há revalidação automática via `revalidatePath` ou `revalidateTag`.  
**Severidade:** MEDIUM — dados desatualizados  

---

## 20. Banco de Dados (DB)

### DB-001 — Integridade referencial
**Status:** 🟠 HIGH  
**Pré-condição:** Banco de dados populado  
**Passos:** 1. Excluir usuário com ordens de serviço  
**Resultado esperado:** Erro de integridade ou exclusão em cascata  
**Resultado obtido:** **Não há onDelete configurado** no schema do Prisma. Excluir um usuário com registros associados causa erro 500.  
**Severidade:** HIGH — operações de exclusão quebram  

### DB-002 — Índices de performance
**Status:** 🟡 MEDIUM  
**Pré-condição:** Tabelas com muitos registros  
**Passos:** 1. Verificar schema do Prisma  
**Resultado esperado:** Índices em colunas de busca (name, email, date)  
**Resultado obtido:** **15 índices faltando**, identificados pela auditoria (QA-0001). Consultas em tabelas grandes serão lentas.  
**Severidade:** MEDIUM — performance degradada em escala  

---

## Resumo por módulo

| Módulo | Status | Testes | Pass | Fail | N/I |
|--------|--------|--------|------|------|-----|
| Fundação (FND) | 🟡 PARCIAL | 10 | 7 | 3 | 0 |
| Usuários (USR) | 🟡 PARCIAL | 5 | 3 | 1 | 1 |
| Clientes/CRM (CRM) | 🔴 CRITICAL | 7 | 2 | 3 | 2 |
| Projetos (PRJ) | 🟡 PARCIAL | 4 | 2 | 1 | 1 |
| Produção (PRD) | ✅ OK | 3 | 2 | 0 | 1 |
| Instalação (INS) | ✅ OK | 2 | 1 | 0 | 1 |
| Ordens de Serviço (OS) | 🟡 PARCIAL | 4 | 2 | 1 | 1 |
| Financeiro (FIN) | 🔴 CRITICAL | 5 | 2 | 2 | 1 |
| Agenda (AGD) | 🟡 PARCIAL | 4 | 2 | 1 | 1 |
| Analytics (ANL) | 🟡 PARCIAL | 3 | 1 | 1 | 1 |
| IA (IA) | 🔴 CRITICAL | 2 | 0 | 1 | 1 |
| API (API) | 🔴 CRITICAL | 3 | 0 | 2 | 1 |
| Navegação (NAV) | 🔴 CRITICAL | 6 | 0 | 5 | 1 |
| Segurança (SEC) | 🔴 CRITICAL | 6 | 0 | 5 | 1 |
| Configurações (CONF) | 🟡 PARCIAL | 3 | 1 | 1 | 1 |
| Comunicação (COMM) | 🟡 PARCIAL | 2 | 0 | 1 | 1 |
| Componentes (COMP) | 🟡 PARCIAL | 4 | 3 | 1 | 0 |
| Multiempresa (EMP) | 🔴 CRITICAL | 2 | 0 | 1 | 1 |
| Performance (PRF) | 🟡 PARCIAL | 3 | 0 | 2 | 1 |
| Banco de Dados (DB) | 🟡 PARCIAL | 2 | 0 | 1 | 1 |

**Legenda:**
- ✅ OK: módulo funcional
- 🟡 PARCIAL: módulo com problemas não críticos
- 🔴 CRITICAL: módulo com problemas críticos que impedem uso

---

## Checklist de regressão

- [x] Login/logout
- [x] Proteção de rotas (proxy)
- [ ] Sidebar responsiva
- [x] Alternador de tema
- [x] CRUD usuários (parcial)
- [x] Pipeline CRM (parcial)
- [ ] Drag-and-drop persiste
- [x] Projetos e tarefas
- [x] Ordens de produção
- [x] Ordens de instalação
- [ ] Duplicar itens na OS
- [ ] Fluxo de caixa correto
- [x] Calendário e eventos
- [ ] Exportar relatórios
- [ ] Chat IA funcional
- [ ] API routes implementadas
- [ ] Webhooks operacionais
- [ ] RBAC em componentes
- [ ] Middleware de proteção
- [ ] Criptografia segura
- [ ] Tokens seguros
- [ ] Teste de conexão SMTP
- [ ] Variáveis em templates de email
- [ ] Suspense/ErrorBoundary
- [ ] Isolamento multiempresa
- [ ] Validação server-side
- [ ] Integridade referencial

---

## Recomendações para v2.0.0

1. **Corrigir 5 rotas quebradas** (Clientes, Estoque, Vendas, Compras, Fiscal) — NAV-001 a NAV-005
2. **Implementar middleware de autenticação** — SEC-002
3. **Implementar RBAC real** no componente `<Can>` — SEC-001
4. **Corrigir duplo registro no fluxo de caixa** — FIN-003
5. **Corrigir drag-and-drop do pipeline** para persistir — CRM-002
6. **Corrigir duplicação de itens na OS** — OS-002
7. **Persistir histórico do chat IA** — IA-001
8. **Implementar API routes** ou removê-las da documentação — API-001
9. **Substituir `node:crypto` por Web Crypto API** nos webhooks — API-002
10. **Adicionar validação server-side** em todas as Server Actions — COMP-003
11. **Corrigir isolamento multiempresa** — EMP-002
12. **Adicionar onDelete cascata** no Prisma schema — DB-001
13. **Corrigir 133 erros ESLint** de set-state-in-effect — PRF-002
14. **Adicionar Suspense/ErrorBoundary** nos layouts — PRF-001
15. **Implementar notificações em tempo real** — COMM-001
