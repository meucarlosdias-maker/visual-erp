'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/feedback/toast';
import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInput } from '@/components/shared/SearchInput';
import { FileUpload } from '@/components/shared/FileUpload';
import { Can } from '@/components/shared/Can';
import {
  SaveButton,
  CancelButton,
  DeleteButton,
  DuplicateButton,
  ExportButton,
  ImportButton,
  BackButton,
  NextButton,
  FinishButton,
} from '@/components/shared/actions';
import {
  EmptyState,
  ErrorState,
  SuccessState,
  LoadingLocal,
  NotFound,
  NoPermission,
  InDevelopment,
  Skeleton,
  ErrorBoundary,
} from '@/components/feedback';
import { Modal } from '@/components/feedback/Modal';
import { Drawer } from '@/components/feedback/Drawer';
import { ConfirmModal } from '@/components/feedback/ConfirmModal';
import { DeleteModal } from '@/components/feedback/DeleteModal';
import {
  DataTable,
} from '@/components/tables/DataTable';
import {
  FilterText,
  FilterSelect,
  FilterMultiSelect,
  FilterDate,
  FilterRange,
  FilterBoolean,
  FilterTags,
} from '@/components/shared/filters';
import {
  TextField,
  NumberField,
  EmailField,
  PhoneField,
  DocumentField,
  MoneyField,
  DatePickerField,
  SelectField,
  MultiSelectField,
  CheckboxField,
  SwitchField,
  TextareaField,
  UploadField,
} from '@/components/forms/fields';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Search,
  Trash2,
  Loader2,
  Plus,
  Download,
  Filter,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
} from '@/constants/icons';
import { Messages } from '@/constants/messages';
import { Permissions } from '@/constants/permissions';
import { formatCurrency, formatDate, formatPhone, generateSlug, sleep } from '@/utils/helpers';
import { RoleLabels } from '@/constants/roles';
import { StatusLabels, StatusColors } from '@/constants/status';
import { Colors } from '@/constants/colors';
import { type ColumnDef } from '@tanstack/react-table';

const sections = [
  { id: 'feedback', label: 'Feedback' },
  { id: 'modals', label: 'Modais' },
  { id: 'toast', label: 'Toast' },
  { id: 'forms', label: 'Formulários' },
  { id: 'table', label: 'DataTable' },
  { id: 'actions', label: 'Ações' },
  { id: 'filters', label: 'Filtros' },
  { id: 'shared', label: 'Compartilhados' },
  { id: 'utils', label: 'Utilitários' },
  { id: 'constants', label: 'Constantes' },
] as const;

type SampleData = { id: string; name: string; email: string; status: string; value: number };
const sampleData: SampleData[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@exemplo.com', status: 'active', value: 15000 },
  { id: '2', name: 'Carlos Souza', email: 'carlos@exemplo.com', status: 'inactive', value: 8200 },
  { id: '3', name: 'Mariana Oliveira', email: 'mariana@exemplo.com', status: 'active', value: 23400 },
];

const columns: ColumnDef<SampleData>[] = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'E-mail' },
  { accessorKey: 'value', header: 'Valor', cell: ({ row }) => formatCurrency(row.getValue('value')) },
];

export default function SystemComponentsPage() {
  const [activeSection, setActiveSection] = useState('feedback');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toastLoading, setToastLoading] = useState(false);

  const form = useForm({ defaultValues: { name: '', email: '', phone: '', document: '', select: '' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Catálogo de Componentes</h1>
        <p className="text-sm text-muted-foreground">
          Sistema Visual ERP — Sprint 2 · Foundation UI
        </p>
      </div>

      <nav className="flex flex-wrap gap-1 border-b pb-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === s.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {activeSection === 'feedback' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Estados de Feedback</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <EmptyState />
            <ErrorState onRetry={() => {}} />
            <SuccessState />
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-6">
              <LoadingLocal size={32} />
              <LoadingLocal size={16} message="Salvando..." />
            </div>
            <NotFound />
            <NoPermission />
            <InDevelopment />
            <Card className="p-4">
              <CardHeader className="p-0 pb-2"><CardTitle className="text-sm">ErrorBoundary</CardTitle></CardHeader>
              <CardContent className="p-0">
                <ErrorBoundary>
                  <p className="text-sm text-muted-foreground">Erro capturado sem derrubar a página.</p>
                </ErrorBoundary>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-2"><CardTitle className="text-sm">Skeleton</CardTitle></CardHeader>
              <CardContent className="p-0 space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" height={80} />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-sm font-medium text-muted-foreground">Exemplo de uso</h3>
          <div className="space-y-2">
            <SearchInput onChange={() => {}} placeholder="Buscar com debounce..." />
          </div>
        </div>
      )}

      {activeSection === 'modals' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Modais & Drawers</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>Abrir Drawer</Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Confirmar</Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Excluir</Button>
          </div>

          <Modal open={modalOpen} onOpenChange={setModalOpen} title="Modal Padrão" submitLabel="Salvar" cancelLabel="Cancelar" onSubmit={() => setModalOpen(false)} onCancel={() => setModalOpen(false)}>
            <p className="text-sm text-muted-foreground">Conteúdo do modal com {`submitLabel`} e {`cancelLabel`}.</p>
          </Modal>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Drawer de Detalhes">
            <p className="text-sm text-muted-foreground">Drawer lateral com formulário ou detalhes.</p>
          </Drawer>

          <ConfirmModal
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Confirmar Ação"
            description="Deseja realmente executar esta ação?"
            confirmLabel="Sim, confirmar"
            variant="default"
            onConfirm={() => { setConfirmOpen(false); toast.success('Ação confirmada!'); }}
            onCancel={() => setConfirmOpen(false)}
          />

          <DeleteModal
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Excluir Registro"
            description="Esta ação não pode ser desfeita."
            confirmLabel="Sim, excluir"
            entityName="Cliente"
            onConfirm={() => { setDeleteOpen(false); toast.success('Registro excluído!'); }}
            onCancel={() => setDeleteOpen(false)}
          />
        </div>
      )}

      {activeSection === 'toast' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Toast / Notificações</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => toast.success(Messages.SAVE_SUCCESS)}>Sucesso</Button>
            <Button variant="secondary" onClick={() => toast.info('Informação relevante.')}>Info</Button>
            <Button variant="outline" onClick={() => toast.warning('Atenção aos dados.')}>Aviso</Button>
            <Button variant="destructive" onClick={() => toast.error(Messages.SAVE_ERROR)}>Erro</Button>
            <Button
              onClick={async () => {
                setToastLoading(true);
                toast.info('Processando...');
                await sleep(1500);
                toast.success('Concluído!');
                setToastLoading(false);
              }}
              disabled={toastLoading}
            >
              {toastLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ação Assíncrona
            </Button>
          </div>
        </div>
      )}

      {activeSection === 'forms' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Campos de Formulário</h2>
          <p className="text-sm text-muted-foreground">
            Todos os campos utilizam react-hook-form + FormField. Exemplo com {`useForm`}:
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TextField control={form.control} name="name" label="Nome" required />
            <EmailField control={form.control} name="email" label="E-mail" required />
            <PhoneField control={form.control} name="phone" label="Telefone" />
            <DocumentField control={form.control} name="document" label="CPF/CNPJ" />
            <NumberField control={form.control} name="name" label="Quantidade" />
            <MoneyField control={form.control} name="name" label="Valor" />
            <DatePickerField control={form.control} name="name" label="Data" />
            <SelectField control={form.control} name="select" label="Status" options={[
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ]} />
            <CheckboxField control={form.control} name="name" label="Ativo" />
            <SwitchField control={form.control} name="name" label="Notificar" />
            <TextareaField control={form.control} name="name" label="Observação" />
            <UploadField control={form.control} name="name" label="Anexo" />
            <MultiSelectField control={form.control} name="name" label="Categorias" options={[
              { value: 'a', label: 'Categoria A' },
              { value: 'b', label: 'Categoria B' },
              { value: 'c', label: 'Categoria C' },
            ]} />
          </div>

          <div className="flex gap-2">
            <SaveButton loading={false} />
            <CancelButton onClick={() => form.reset()} />
          </div>
        </div>
      )}

      {activeSection === 'table' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">DataTable</h2>
          <DataTable
            columns={columns}
            data={sampleData}
            searchPlaceholder="Buscar na tabela..."
            toolbar={<Button size="sm"><Plus className="mr-1 h-4 w-4" /> Novo</Button>}
            batchActions={<Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4" /> Excluir selecionados</Button>}
            filters={
              <FilterSelect
                options={[{ value: 'active', label: 'Ativo' }, { value: 'inactive', label: 'Inativo' }]}
                value=""
                onChange={() => {}}
              />
            }
            empty={<EmptyState />}
          />

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Estado vazio</h3>
            <DataTable
              columns={columns}
              data={[]}
              empty={<EmptyState />}
            />
          </div>
        </div>
      )}

      {activeSection === 'actions' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Botões de Ação Padronizados</h2>
          <div className="flex flex-wrap gap-2">
            <SaveButton loading={false} />
            <SaveButton loading={true} />
            <CancelButton onClick={() => {}} />
            <DeleteButton onClick={() => {}} loading={false} />
            <DeleteButton onClick={() => {}} loading={true} />
            <DuplicateButton onClick={() => {}} />
            <ExportButton onClick={() => {}} />
            <ImportButton onClick={() => {}} />
            <BackButton />
            <NextButton onClick={() => {}} />
            <FinishButton onClick={() => {}} loading={false} />
            <FinishButton onClick={() => {}} loading={true} />
          </div>
          <p className="text-xs text-muted-foreground">
            Props comuns: {`onClick`}, {`loading`}, {`disabled`}, {`label`}, {`icon`}
          </p>
        </div>
      )}

      {activeSection === 'filters' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Filtros Reutilizáveis</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FilterText value="" onChange={() => {}} placeholder="Digite para buscar..." />
            <FilterSelect options={[{ value: 'active', label: 'Ativo' }, { value: 'inactive', label: 'Inativo' }]} value="" onChange={() => {}} />
            <FilterMultiSelect options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]} value={[]} onChange={() => {}} />
            <FilterDate value="" onChange={() => {}} />
            <FilterRange value={['', '']} onChange={() => {}} />
            <FilterBoolean value="" onChange={() => {}} />
          </div>
          <FilterTags tags={[{ value: 'active', label: 'Ativo' }, { value: 'cat-a', label: 'Categoria A' }]} onRemove={() => {}} onClear={() => {}} />
        </div>
      )}

      {activeSection === 'shared' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Componentes Compartilhados</h2>

          <Card className="p-4">
            <CardHeader className="p-0 pb-2"><CardTitle className="text-sm">SearchInput</CardTitle></CardHeader>
            <CardContent className="p-0">
              <SearchInput placeholder="Pressione Ctrl+K para focar..." onChange={() => {}} />
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 pb-2"><CardTitle className="text-sm">FileUpload (drag & drop)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <FileUpload />
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 pb-2"><CardTitle className="text-sm">Can (controle de permissão)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <p className="mb-2 text-sm text-muted-foreground">Renderiza {`children`} se o usuário tem permissão:</p>
              <Can permission={Permissions.CLIENT_VIEW}>
                <Badge variant="outline" className="gap-1"><Check className="h-3 w-3" /> Visualizar Clientes</Badge>
              </Can>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 pb-2"><CardTitle className="text-sm">CrudPage Template</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="rounded-lg border bg-muted/30 p-3">
                <CrudPage
                  title="Exemplo CRUD"
                  description="Template reutilizável com breadcrumb, toolbar, tabela e resumo"
                  actionNew={{ onClick: () => toast.info('Ação de novo registro') }}
                  onExport={() => toast.success('Exportado!')}
                  onFilter={() => toast.info('Abrindo filtros...')}
                  summary={`${sampleData.length} registros encontrados`}
                >
                  <DataTable columns={columns} data={sampleData} />
                </CrudPage>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'utils' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Utilitários (helpers)</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">formatCurrency</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">{formatCurrency(1500.5)}</CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">formatDate</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">{formatDate(new Date())}</CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">formatPhone</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">{formatPhone('11987654321')}</CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">formatCPF</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">529.982.247-25</CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">formatCNPJ</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">11.222.333/0001-81</CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">generateSlug</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">{generateSlug('Visual ERP Projeção')}</CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">sleep / debounce</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">await sleep(1000)</code> — pausa de 1s
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">downloadFile</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">downloadFile(url, nome)</code>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeSection === 'constants' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Constantes Centralizadas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">Messages</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm space-y-1">
                <p className="text-xs">{Messages.CONFIRM_DELETE_TITLE}</p>
                <p className="text-xs text-muted-foreground">{Messages.CONFIRM_DELETE_DESC}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">StatusLabels</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm space-y-1">
                {Object.entries(StatusLabels).map(([k, v]) => (
                  <Badge key={k} className={StatusColors[k]}>{v}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">RoleLabels</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm space-y-1">
                {Object.entries(RoleLabels).map(([k, v]) => (
                  <p key={k} className="text-xs">{k}: {v}</p>
                ))}
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">Colors</CardTitle></CardHeader>
              <CardContent className="p-0 flex flex-wrap gap-1">
                {Object.entries(Colors).slice(0, 8).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1 text-xs">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: v }} />
                    <span className="text-muted-foreground">{k}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="p-4 col-span-2">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">Ícones Centralizados (icons.ts)</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">
                <p className="text-xs text-muted-foreground">
                  57 ícones re-exportados do lucide-react. Nenhum componente importa diretamente.
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-muted-foreground">
                  <Search className="h-4 w-4" /><span className="text-xs">Search</span>
                  <Trash2 className="h-4 w-4" /><span className="text-xs">Trash2</span>
                  <Loader2 className="h-4 w-4" /><span className="text-xs">Loader2</span>
                  <Plus className="h-4 w-4" /><span className="text-xs">Plus</span>
                  <Download className="h-4 w-4" /><span className="text-xs">Download</span>
                  <Filter className="h-4 w-4" /><span className="text-xs">Filter</span>
                  <Check className="h-4 w-4" /><span className="text-xs">Check</span>
                  <X className="h-4 w-4" /><span className="text-xs">X</span>
                  <AlertTriangle className="h-4 w-4" /><span className="text-xs">AlertTriangle</span>
                  <ArrowRight className="h-4 w-4" /><span className="text-xs">ArrowRight</span>
                </div>
              </CardContent>
            </Card>
            <Card className="p-4 col-span-2">
              <CardHeader className="p-0 pb-1"><CardTitle className="text-xs font-medium">Rotas Centralizadas (routes.ts)</CardTitle></CardHeader>
              <CardContent className="p-0 text-sm">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">Routes.CLIENTES_DETALHE(&apos;123&apos;)</code> → <span className="text-xs text-muted-foreground">/app/clientes/123</span>
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">Routes.PROJETOS_EDITAR(&apos;456&apos;)</code> → <span className="text-xs text-muted-foreground">/app/projetos/456/editar</span>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
