'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { PRIORITY_LABELS } from '../validators';
import type { Project } from '../types';

interface ProjectFormProps {
  project?: Project | null;
  readOnly?: boolean;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function ProjectForm({ project, readOnly, onSave, onCancel }: ProjectFormProps) {
  const [tab, setTab] = useState('informacoes');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [priority, setPriority] = useState(project?.priority ?? 'normal');
  const [expectedStartDate, setExpectedStartDate] = useState(
    project?.expectedStartDate ? project.expectedStartDate.toISOString().split('T')[0] : '',
  );
  const [expectedEndDate, setExpectedEndDate] = useState(
    project?.expectedEndDate ? project.expectedEndDate.toISOString().split('T')[0] : '',
  );
  const [notes, setNotes] = useState(project?.notes ?? '');

  const handleSubmit = useCallback(async () => {
    setSaving(true);
    await onSave({
      name,
      description,
      priority,
      expectedStartDate: expectedStartDate || null,
      expectedEndDate: expectedEndDate || null,
      notes,
    });
    setSaving(false);
  }, [name, description, priority, expectedStartDate, expectedEndDate, notes, onSave]);

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="informacoes">Informações Gerais</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-4 pt-4">
          {project && (
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente</span>
                <p className="font-medium">{project.clientId || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Orçamento</span>
                <p className="font-medium">{project.quotationId || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nº</span>
                <p className="font-medium">{project.number}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} readOnly={readOnly} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              {readOnly ? (
                <p className="text-sm font-medium pt-2">{PRIORITY_LABELS[priority] ?? priority}</p>
              ) : (
                <Select value={priority} onValueChange={(v) => setPriority(v || 'normal')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {project && (
                <p className="text-sm font-medium pt-2">{project.status}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expectedStartDate">Início Previsto</Label>
              <Input id="expectedStartDate" type="date" value={expectedStartDate} onChange={(e) => setExpectedStartDate(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedEndDate">Término Previsto</Label>
              <Input id="expectedEndDate" type="date" value={expectedEndDate} onChange={(e) => setExpectedEndDate(e.target.value)} disabled={readOnly} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} readOnly={readOnly} />
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} readOnly={readOnly} placeholder="Anotações do projeto..." />
          </div>
        </TabsContent>
      </Tabs>

      {!readOnly && (
        <div className="flex justify-end gap-2">
          <CancelButton onClick={onCancel} disabled={saving} />
          <SaveButton onClick={handleSubmit} loading={saving} />
        </div>
      )}
    </div>
  );
}
