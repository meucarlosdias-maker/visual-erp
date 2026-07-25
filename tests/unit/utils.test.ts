import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('merges Tailwind classes correctly', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles string and object mix', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar');
  });
});
