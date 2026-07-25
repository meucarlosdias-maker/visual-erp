import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/use-debounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 100));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 50),
      { initialProps: { value: 'first' } },
    );
    expect(result.current).toBe('first');

    rerender({ value: 'second' });
    expect(result.current).toBe('first');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(result.current).toBe('second');
  });

  it('cancels previous timer on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    rerender({ value: 'c' });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });
    expect(result.current).toBe('c');
  });
});
