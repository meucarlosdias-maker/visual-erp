export interface TraceSpan {
  id: string;
  parentId: string | null;
  operation: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  metadata: Record<string, unknown>;
}

const spans: TraceSpan[] = [];
const activeSpans: Map<string, TraceSpan> = new Map();

export function startSpan(operation: string, parentId?: string, metadata?: Record<string, unknown>): string {
  const id = crypto.randomUUID();
  const span: TraceSpan = { id, parentId: parentId ?? null, operation, startTime: new Date(), endTime: null, duration: null, metadata: metadata ?? {} };
  activeSpans.set(id, span);
  return id;
}

export function endSpan(spanId: string): TraceSpan | undefined {
  const span = activeSpans.get(spanId);
  if (!span) return undefined;
  span.endTime = new Date();
  span.duration = span.endTime.getTime() - span.startTime.getTime();
  spans.push(span);
  activeSpans.delete(spanId);
  return span;
}

export function getTrace(spanId: string): TraceSpan[] {
  const result: TraceSpan[] = [];
  const findChildren = (parentId: string) => {
    for (const s of spans) {
      if (s.parentId === parentId) { result.push(s); findChildren(s.id); }
    }
  };
  const root = spans.find((s) => s.id === spanId) ?? activeSpans.get(spanId);
  if (root) { result.push(root); findChildren(root.id); }
  return result;
}

export function listTraces(limit = 50): TraceSpan[] {
  return [...spans].sort((a, b) => b.startTime.getTime() - a.startTime.getTime()).slice(0, limit);
}
