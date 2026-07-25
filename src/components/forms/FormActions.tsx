'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from '@/constants/icons';

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function FormActions({
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  onCancel,
  loading = false,
  disabled = false,
}: FormActionsProps) {
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();

  const isDisabled = disabled || isSubmitting || loading;

  return (
    <div className="flex items-center justify-end gap-2 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDisabled}
        >
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={isDisabled || !isDirty}>
        {isSubmitting || loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
