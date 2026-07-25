import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackPerformance, generateId, ErrorTracker } from '@/lib/observability';

describe('trackPerformance', () => {
  it('returns metric with correct shape', () => {
    const metric = trackPerformance('test-op', 150, true);
    expect(metric.operation).toBe('test-op');
    expect(metric.durationMs).toBe(150);
    expect(metric.success).toBe(true);
    expect(metric.timestamp).toBeDefined();
  });

  it('warns on slow operations', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    trackPerformance('slow-op', 1500, true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('generateId', () => {
  it('generates a uuid string', () => {
    const id = generateId();
    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('ErrorTracker', () => {
  let tracker: ErrorTracker;

  beforeEach(() => {
    tracker = new ErrorTracker();
    vi.restoreAllMocks();
  });

  it('tracks errors', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    tracker.track(new Error('test error'));
    const recent = tracker.getRecent();
    expect(recent).toHaveLength(1);
    expect(recent[0].error.message).toBe('test error');
    spy.mockRestore();
  });

  it('tracks errors with context', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    tracker.track(new Error('context error'), { userId: '123' });
    const recent = tracker.getRecent();
    expect(recent[0].context?.userId).toBe('123');
    spy.mockRestore();
  });

  it('returns limited recent errors', () => {
    for (let i = 0; i < 20; i++) {
      tracker.track(new Error(`error-${i}`));
    }
    expect(tracker.getRecent(5)).toHaveLength(5);
    expect(tracker.getRecent()).toHaveLength(10);
  });

  it('clears all errors', () => {
    tracker.track(new Error('to clear'));
    tracker.clear();
    expect(tracker.getRecent()).toHaveLength(0);
  });
});
