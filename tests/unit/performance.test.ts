import { describe, it, expect } from 'vitest';
import { shouldLazyLoad, createPaginationParams, calculateTotalPages } from '@/lib/performance';

describe('shouldLazyLoad', () => {
  it('returns true for heavy components', () => {
    expect(shouldLazyLoad(100_000)).toBe(true);
  });

  it('returns false for light components', () => {
    expect(shouldLazyLoad(10_000)).toBe(false);
  });

  it('uses custom threshold', () => {
    expect(shouldLazyLoad(1_000, 500)).toBe(true);
    expect(shouldLazyLoad(100, 500)).toBe(false);
  });
});

describe('createPaginationParams', () => {
  it('returns correct skip/take for page 1', () => {
    expect(createPaginationParams(1)).toEqual({ skip: 0, take: 20 });
  });

  it('returns correct skip/take for page 3', () => {
    expect(createPaginationParams(3, 10)).toEqual({ skip: 20, take: 10 });
  });
});

describe('calculateTotalPages', () => {
  it('calculates total pages', () => {
    expect(calculateTotalPages(50, 20)).toBe(3);
    expect(calculateTotalPages(40, 20)).toBe(2);
    expect(calculateTotalPages(0, 20)).toBe(0);
  });
});
