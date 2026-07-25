'use client';

import { Modal } from './Modal';
import { AlertTriangle } from '@/constants/icons';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
  variant?: 'default' | 'destructive';
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading,
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      submitLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onSubmit={onConfirm}
      onCancel={onCancel}
      loading={loading}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-full p-2 ${
            variant === 'destructive'
              ? 'bg-destructive/10 text-destructive'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Modal>
  );
}
