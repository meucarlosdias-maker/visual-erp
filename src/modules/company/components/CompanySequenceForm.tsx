'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from '@/constants/icons';
import { toast } from '@/components/feedback';
import { SEQUENCE_ENTITY_LABELS } from '../validators/company-settings-validators';
import type { CompanySequence } from '../types/company-settings';

interface CompanySequenceFormProps {
  sequences: CompanySequence[];
  onUpdate: (id: string, data: Partial<CompanySequence>) => Promise<boolean>;
}

export function CompanySequenceForm({ sequences, onUpdate }: CompanySequenceFormProps) {
  const [editing, setEditing] = useState<Record<string, Partial<CompanySequence>>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (seq: CompanySequence) => {
    const changes = editing[seq.id];
    if (!changes) return;
    setSaving(seq.id);
    const ok = await onUpdate(seq.id, changes);
    if (ok) {
      toast.success(`${SEQUENCE_ENTITY_LABELS[seq.entity] ?? seq.entity} atualizado`);
      setEditing((prev) => { const next = { ...prev }; delete next[seq.id]; return next; });
    } else toast.error('Erro ao salvar');
    setSaving(null);
  };

  const setField = (id: string, key: string, value: string | number) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const getVal = (seq: CompanySequence, key: keyof CompanySequence) => {
    return editing[seq.id]?.[key] ?? seq[key];
  };

  return (
    <div className="space-y-4">
      {sequences.map((seq) => (
        <Card key={seq.id}>
          <CardHeader>
            <CardTitle className="text-base">{SEQUENCE_ENTITY_LABELS[seq.entity] ?? seq.entity}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4 items-end">
              <div className="space-y-1.5">
                <Label>Prefixo</Label>
                <Input
                  value={getVal(seq, 'prefix') as string}
                  onChange={(e) => setField(seq.id, 'prefix', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Sufixo</Label>
                <Input
                  value={getVal(seq, 'suffix') as string}
                  onChange={(e) => setField(seq.id, 'suffix', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Zeros (padding)</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={getVal(seq, 'padding') as number}
                  onChange={(e) => setField(seq.id, 'padding', Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Último Número</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={getVal(seq, 'currentNumber') as number}
                    onChange={(e) => setField(seq.id, 'currentNumber', Number(e.target.value))}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSave(seq)}
                    disabled={saving === seq.id || !editing[seq.id]}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Próximo: {seq.prefix}{(seq.currentNumber + 1).toString().padStart(seq.padding, '0')}{seq.suffix ? '-' + seq.suffix : ''}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
