'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from '@/constants/icons';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: 'sm:max-w-sm',
  default: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100vh-2rem)]',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'default',
  submitLabel,
  cancelLabel = 'Cancelar',
  onSubmit,
  onCancel,
  loading,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        {(onSubmit || onCancel) && (
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel ?? (() => onOpenChange(false))}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            {onSubmit && (
              <Button type="button" onClick={onSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitLabel}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
