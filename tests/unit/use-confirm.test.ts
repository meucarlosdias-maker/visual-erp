import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

describe('useConfirm', () => {
  it('returns confirm function and dialog component', () => {
    const { result } = renderHook(() => useConfirm());
    expect(typeof result.current.confirm).toBe('function');
    expect(result.current.ConfirmDialog).toBeDefined();
  });

  it('creates a confirm promise', async () => {
    const { result } = renderHook(() => useConfirm());

    let confirmed = false;
    act(() => {
      result.current.confirm().then((v) => { confirmed = v; });
    });

    expect(result.current.ConfirmDialog).toBeDefined();
  });
});

describe('useDeleteConfirm', () => {
  it('returns confirmDelete function and dialog component', () => {
    const { result } = renderHook(() => useDeleteConfirm());
    expect(typeof result.current.confirmDelete).toBe('function');
    expect(result.current.DeleteDialog).toBeDefined();
  });
});
