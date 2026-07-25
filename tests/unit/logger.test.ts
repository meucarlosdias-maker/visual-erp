import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    logger.setLevel('debug');
  });

  it('logs info messages', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('test message');
    expect(spy).toHaveBeenCalled();
    const callArg = JSON.parse(spy.mock.calls[0][0]);
    expect(callArg.level).toBe('info');
    expect(callArg.message).toBe('test message');
  });

  it('logs error messages', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('error message');
    expect(spy).toHaveBeenCalled();
    const callArg = JSON.parse(spy.mock.calls[0][0]);
    expect(callArg.level).toBe('error');
  });

  it('logs warn messages', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('warn message');
    expect(spy).toHaveBeenCalled();
  });

  it('logs debug messages', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('debug message');
    expect(spy).toHaveBeenCalled();
  });

  it('includes requestId when set', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.setRequestId('req-123');
    logger.info('with request id');
    const callArg = JSON.parse(spy.mock.calls[0][0]);
    expect(callArg.requestId).toBe('req-123');
  });

  it('includes correlationId when set', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.setCorrelationId('corr-456');
    logger.info('with correlation id');
    const callArg = JSON.parse(spy.mock.calls[0][0]);
    expect(callArg.correlationId).toBe('corr-456');
  });

  it('includes extra data', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('with data', { key: 'value', num: 42 });
    const callArg = JSON.parse(spy.mock.calls[0][0]);
    expect(callArg.data).toEqual({ key: 'value', num: 42 });
  });

  it('respects log level filtering', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.setLevel('warn');
    logger.debug('should not appear');
    expect(spy).not.toHaveBeenCalled();
  });
});
