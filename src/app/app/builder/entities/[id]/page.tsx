'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Eye } from '@/constants/icons';
import { useBuilderEntity, useBuilderFields, useBuilderRecords, createField, updateField, deleteField, createRecord, deleteRecord, FieldTypeBadge } from '@/modules/builder';
import { DynamicField } from '@/modules/builder';
import { FormValidator, FormEngine, type FieldType, type FieldDefinition } from '@/core/builder';

const fieldTypeOptions: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto' }, { value: 'number', label: 'Número' },
  { value: 'currency', label: 'Moeda' }, { value: 'phone', label: 'Telefone' },
  { value: 'document', label: 'CPF/CNPJ' }, { value: 'email', label: 'Email' },
  { value: 'password', label: 'Senha' }, { value: 'textarea', label: 'Textarea' },
  { value: 'date', label: 'Data' }, { value: 'time', label: 'Hora' },
  { value: 'datetime', label: 'Data/Hora' }, { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'MultiSelect' }, { value: 'checkbox', label: 'Checkbox' },
  { value: 'switch', label: 'Switch' }, { value: 'file', label: 'Arquivo' },
  { value: 'image', label: 'Imagem' }, { value: 'signature', label: 'Assinatura' },
  { value: 'relation', label: 'Relacionamento' },
];

export default function EntityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { entity, loading: entityLoading } = useBuilderEntity(id);
  const { data: fields, loading: fieldsLoading, refetch: refetchFields } = useBuilderFields(id);
  const { data: records, loading: recordsLoading, refetch: refetchRecords } = useBuilderRecords(id);
  const [activeTab, setActiveTab] = useState('fields');
  const [editingField, setEditingField] = useState<FieldDefinition | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState<'create' | 'view'>('create');

  const handleCreateField = async (form: HTMLFormElement) => {
    const fd = new FormData(form);
    await createField(id, fd.get('name') as string, fd.get('label') as string, fd.get('type') as FieldType, fd.has('required'));
    await refetchFields();
    form.reset();
  };

  const handleEditField = async (form: HTMLFormElement) => {
    if (!editingField) return;
    const fd = new FormData(form);
    await updateField(editingField.id, { label: fd.get('label') as string, required: fd.has('required') });
    setEditingField(null);
    await refetchFields();
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!confirm('Excluir este campo?')) return;
    await deleteField(fieldId);
    await refetchFields();
  };

  const handleFormChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleSubmitRecord = async () => {
    const errors = FormValidator.validateForm(fields, formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    await createRecord(id, formData, 'user-1');
    setFormData({});
    await refetchRecords();
  };

  if (entityLoading || fieldsLoading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando...</div>;
  }

  if (!entity) {
    return <div className="text-center py-12 text-muted-foreground">Entidade não encontrada.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: entity.color }}>
            {entity.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{entity.name}</h1>
            <p className="text-sm text-muted-foreground">{entity.description ?? entity.slug}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="fields">Campos ({fields.length})</TabsTrigger>
          <TabsTrigger value="records">Registros ({records.length})</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Defina os campos desta entidade</p>
            <Dialog>
              <DialogTrigger render={<Button size="sm" />}>
                <Plus className="h-4 w-4 mr-1" /> Novo Campo
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo Campo</DialogTitle></DialogHeader>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateField(e.currentTarget); }}>
                  <div className="space-y-2">
                    <Label htmlFor="field-name">Nome interno</Label>
                    <Input id="field-name" name="name" placeholder="Ex: cliente" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field-label">Label</Label>
                    <Input id="field-label" name="label" placeholder="Ex: Cliente" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field-type">Tipo</Label>
                    <Select name="type" required>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {fieldTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="required" />
                    Campo obrigatório
                  </label>
                  <Button type="submit" className="w-full">Criar Campo</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum campo definido.</div>
          ) : (
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <Card key={field.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{field.label}</span>
                            <FieldTypeBadge type={field.type} />
                            {field.required && <Badge variant="default" className="text-[10px]">*</Badge>}
                          </div>
                          <code className="text-[10px] text-muted-foreground">{field.name}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditingField(field)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteField(field.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Registros cadastrados</p>
            <Button size="sm" onClick={handleSubmitRecord} disabled={fields.length === 0}>
              <Plus className="h-4 w-4 mr-1" /> Novo Registro
            </Button>
          </div>

          {fields.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Novo Registro</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {fields.map((field) => (
                  <DynamicField
                    key={field.id}
                    field={field}
                    value={formData[field.name] ?? field.defaultValue ?? ''}
                    error={formErrors[field.name] ?? null}
                    onChange={handleFormChange}
                  />
                ))}
                <div className="flex gap-2">
                  <Button onClick={handleSubmitRecord}>Salvar</Button>
                  <Button variant="outline" onClick={() => { setFormData({}); setFormErrors({}); }}>Limpar</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum registro encontrado.</div>
          ) : (
            <div className="space-y-2">
              {records.map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {fields.slice(0, 2).map((f) => (
                          <span key={f.id} className="mr-3">
                            <strong>{f.label}:</strong> {String(rec.data[f.name] ?? '-')}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">
                          {rec.createdAt.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon-sm" onClick={async () => { await deleteRecord(rec.id); refetchRecords(); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Visualização do formulário</p>
            <div className="flex gap-2">
              <Button size="sm" variant={previewMode === 'create' ? 'default' : 'outline'} onClick={() => setPreviewMode('create')}>
                <Pencil className="h-4 w-4 mr-1" /> Edição
              </Button>
              <Button size="sm" variant={previewMode === 'view' ? 'default' : 'outline'} onClick={() => setPreviewMode('view')}>
                <Eye className="h-4 w-4 mr-1" /> Visualização
              </Button>
            </div>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Adicione campos para visualizar o formulário.</div>
          ) : (
            <Card>
              <CardHeader><CardTitle className="text-sm">{entity.name}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {fields.map((field) => (
                  previewMode === 'view' ? (
                    <div key={field.id} className="space-y-1">
                      <Label className="text-xs">{field.label}</Label>
                      <p className="text-sm bg-muted p-2 rounded">{FormEngine.formatValue(formData[field.name], field.type) || '-'}</p>
                    </div>
                  ) : (
                    <DynamicField
                      key={field.id}
                      field={field}
                      value={formData[field.name] ?? field.defaultValue ?? ''}
                      error={null}
                      onChange={handleFormChange}
                    />
                  )
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingField} onOpenChange={(open) => { if (!open) setEditingField(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Campo</DialogTitle></DialogHeader>
          {editingField && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEditField(e.currentTarget); }}>
              <div className="space-y-2">
                <Label htmlFor="edit-label">Label</Label>
                <Input id="edit-label" name="label" defaultValue={editingField.label} required />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="required" defaultChecked={editingField.required} />
                Campo obrigatório
              </label>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
