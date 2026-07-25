import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Type, Hash, DollarSign, Phone, FileText, Mail, Lock, Calendar, Clock, ChevronDown, List, CheckSquare, ToggleLeft, File, Image, PenTool, Link } from '@/constants/icons';
import type { CustomEntityRecord, FieldDefinition, FieldType, RenderedField, LayoutComponentType } from '@/core/builder';

const fieldIcons: Record<FieldType, React.ComponentType<{ className?: string }>> = {
  text: Type, number: Hash, currency: DollarSign, phone: Phone,
  document: FileText, email: Mail, password: Lock, textarea: FileText,
  date: Calendar, time: Clock, datetime: Calendar,
  select: ChevronDown, multiselect: List, checkbox: CheckSquare,
  switch: ToggleLeft, file: File, image: Image, signature: PenTool, relation: Link,
};

const fieldLabels: Record<FieldType, string> = {
  text: 'Texto', number: 'Número', currency: 'Moeda', phone: 'Telefone',
  document: 'CPF/CNPJ', email: 'Email', password: 'Senha', textarea: 'Textarea',
  date: 'Data', time: 'Hora', datetime: 'Data/Hora', select: 'Select',
  multiselect: 'MultiSelect', checkbox: 'Checkbox', switch: 'Switch',
  file: 'Arquivo', image: 'Imagem', signature: 'Assinatura', relation: 'Relacionamento',
};

const componentLabels: Record<LayoutComponentType, string> = {
  tabs: 'Abas', section: 'Seção', grid: 'Grade', columns: 'Colunas', card: 'Card', accordion: 'Acordeão',
};

export function EntityCard({ entity, fieldCount, recordCount, onEdit, onDelete, onManageFields }: {
  entity: CustomEntityRecord;
  fieldCount: number;
  recordCount: number;
  onEdit: (e: CustomEntityRecord) => void;
  onDelete: (id: string) => void;
  onManageFields: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: entity.color }}>
              {entity.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-sm">{entity.name}</CardTitle>
              {entity.description && <p className="text-[10px] text-muted-foreground">{entity.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(entity)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(entity.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span><strong>{fieldCount}</strong> campos</span>
          <span><strong>{recordCount}</strong> registros</span>
          <Badge variant={entity.active ? 'default' : 'secondary'} className="text-[10px]">
            {entity.active ? 'Ativo' : 'Inativo'}
          </Badge>
          <code className="text-[10px] bg-muted px-1 rounded">{entity.slug}</code>
        </div>
        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => onManageFields(entity.id)}>
          <Plus className="h-3 w-3 mr-1" /> Gerenciar Campos
        </Button>
      </CardContent>
    </Card>
  );
}

export function FieldTypeBadge({ type }: { type: FieldType }) {
  const Icon = fieldIcons[type];
  return (
    <Badge variant="outline" className="gap-1 text-[10px] font-normal">
      <Icon className="h-3 w-3" />
      {fieldLabels[type]}
    </Badge>
  );
}

export function DynamicField({ field, value, error, onChange }: {
  field: FieldDefinition;
  value: unknown;
  error: string | null;
  onChange: (name: string, value: unknown) => void;
}) {
  const baseClass = "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className={`${baseClass} min-h-[80px] py-2`}
            placeholder={field.placeholder ?? ''}
            value={String(value ?? '')}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
      case 'select':
        return (
          <Select value={String(value ?? '')} onValueChange={(v) => onChange(field.name, v)}>
            <SelectTrigger><SelectValue placeholder={field.placeholder ?? 'Selecione...'} /></SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value === true || value === 'true'}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
        );
      case 'switch':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => onChange(field.name, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
          </label>
        );
      default:
        return (
          <Input
            type={field.type === 'number' || field.type === 'currency' ? 'number' : field.type === 'password' ? 'password' : field.type === 'email' ? 'email' : 'text'}
            placeholder={field.placeholder ?? ''}
            value={String(value ?? '')}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Label className="text-xs">{field.label}</Label>
        {field.required && <span className="text-destructive">*</span>}
      </div>
      {renderInput()}
      {field.helpText && <p className="text-[10px] text-muted-foreground">{field.helpText}</p>}
      {error && <p className="text-[10px] text-destructive">{error}</p>}
    </div>
  );
}

export function RenderedFieldGroup({ renderedFields, onChange, fields }: {
  renderedFields: RenderedField[];
  onChange: (name: string, value: unknown) => void;
  fields: FieldDefinition[];
}) {
  return (
    <div className="space-y-3">
      {renderedFields.map((rf) => {
        const fieldDef = fields.find((f) => f.id === rf.id) ?? fields.find((f) => f.name === rf.name);
        if (!fieldDef) return null;
        return <DynamicField key={rf.id} field={fieldDef} value={rf.value} error={rf.error} onChange={onChange} />;
      })}
    </div>
  );
}

export function LayoutComponentBadge({ type }: { type: LayoutComponentType }) {
  return (
    <Badge variant="secondary" className="text-[10px] font-mono">
      {componentLabels[type]}
    </Badge>
  );
}
