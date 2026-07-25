'use client';

import { useState, useCallback } from 'react';
import { ConfirmModal } from '@/components/feedback/ConfirmModal';
import { DeleteModal } from '@/components/feedback/DeleteModal';

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: 'default' | 'destructive';
}

interface DeleteOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  entityName?: string;
}

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    resolve: ((value: boolean) => void) | null;
    options: ConfirmOptions;
  }>({
    open: false,
    resolve: null,
    options: {},
  });

  const confirm = useCallback(
    (options: ConfirmOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({ open: true, resolve, options });
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const ConfirmDialog = (
    <ConfirmModal
      open={state.open}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
      title={state.options.title ?? 'Confirmar ação'}
      description={
        state.options.description ?? 'Tem certeza que deseja continuar?'
      }
      confirmLabel={state.options.confirmLabel ?? 'Confirmar'}
      variant={state.options.variant ?? 'default'}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmDialog };
}

export function useDeleteConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    resolve: ((value: boolean) => void) | null;
    options: DeleteOptions;
  }>({
    open: false,
    resolve: null,
    options: {},
  });

  const confirmDelete = useCallback(
    (options: DeleteOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({ open: true, resolve, options });
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const DeleteDialog = (
    <DeleteModal
      open={state.open}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
      title={state.options.title}
      description={state.options.description}
      confirmLabel={state.options.confirmLabel}
      entityName={state.options.entityName}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirmDelete, DeleteDialog };
}
