import type { InternalEvent, EventPayload, EventHandler, EventBusConfig } from '../types';
import { EVENT_BUS_DEFAULTS } from '../types';

export class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private config: EventBusConfig;

  constructor(config?: EventBusConfig) {
    this.config = { ...EVENT_BUS_DEFAULTS, ...config };
  }

  on(event: InternalEvent, handler: EventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    if (handlers.size >= (this.config.maxListeners ?? 100)) {
      console.warn(`EventBus: max listeners (${this.config.maxListeners}) reached for event "${event}"`);
    }
    handlers.add(handler);
    return () => { handlers.delete(handler); };
  }

  off(event: InternalEvent, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  async emit(payload: EventPayload): Promise<void> {
    const handlers = this.listeners.get(payload.event);
    if (!handlers) return;
    const promises: Promise<void>[] = [];
    for (const handler of handlers) {
      try {
        const result = handler(payload);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (err) {
        if (this.config.captureErrors) {
          console.error(`EventBus: error in handler for "${payload.event}":`, err);
        }
      }
    }
    await Promise.allSettled(promises);
  }

  removeAll(event?: InternalEvent): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: InternalEvent): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

export const eventBus = new EventBus();
