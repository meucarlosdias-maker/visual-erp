import { describe, it, expect } from 'vitest';
import { IntegrationService, FLOW_LABELS, FLOW_ORDER } from '@/lib/integration';

describe('IntegrationService', () => {
  const service = new IntegrationService();

  it('returns empty flow when no filters', () => {
    const flow = service.getFlow({});
    Object.values(flow).forEach((val) => {
      expect(val).toBeUndefined();
    });
  });

  it('merges provided filters', () => {
    const flow = service.getFlow({ leadId: 'lead-1', clientId: 'client-1' });
    expect(flow.leadId).toBe('lead-1');
    expect(flow.clientId).toBe('client-1');
    expect(flow.quotationId).toBeUndefined();
  });

  it('returns flow summary', () => {
    const flow = service.getFlow({ leadId: 'lead-1', clientId: 'client-2' });
    const summary = service.getFlowSummary(flow);
    expect(summary).toHaveLength(2);
    expect(summary[0]).toContain('Lead:');
    expect(summary[1]).toContain('Cliente:');
  });

  it('canAdvance returns true for first step', () => {
    expect(service.canAdvance({}, 'leadId')).toBe(true);
  });

  it('canAdvance returns false when previous step missing', () => {
    expect(service.canAdvance({}, 'clientId')).toBe(false);
  });

  it('canAdvance returns true when previous step exists', () => {
    const flow = service.getFlow({ leadId: 'lead-1' });
    expect(service.canAdvance(flow, 'clientId')).toBe(true);
  });

  it('canAdvance returns false for non-consecutive steps', () => {
    const flow = service.getFlow({ leadId: 'lead-1' });
    expect(service.canAdvance(flow, 'quotationId')).toBe(false);
  });
});

describe('FLOW_LABELS', () => {
  it('has labels for all flow keys', () => {
    FLOW_ORDER.forEach((key) => {
      expect(FLOW_LABELS[key]).toBeDefined();
      expect(typeof FLOW_LABELS[key]).toBe('string');
    });
  });
});

describe('FLOW_ORDER', () => {
  it('has correct order', () => {
    expect(FLOW_ORDER[0]).toBe('leadId');
    expect(FLOW_ORDER[FLOW_ORDER.length - 1]).toBe('financialId');
  });

  it('has 10 steps', () => {
    expect(FLOW_ORDER).toHaveLength(10);
  });
});
