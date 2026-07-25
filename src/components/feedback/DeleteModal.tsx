'use client';

import { Modal } from './Modal';
import { Trash2 } from '@/constants/icons';

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
  entityName?: string;
}

export function DeleteModal({
  open,
  onOpenChange,
  title = 'Confirmar exclusão',
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading,
  entityName,
}: DeleteModalProps) {
  const defaultDescription = entityName
    ? `Tem certeza que deseja excluir ${entityName}? Esta ação não pode ser desfeita.`
    : 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="sm"
      submitLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onSubmit={onConfirm}
      onCancel={onCancel}
      loading={loading}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-destructive/10 p-2 text-destructive">
          <Trash2 className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground">
          {description ?? defaultDescription}
        </p>
      </div>
    </Modal>
  );
}
