import { eventBus } from '../bus';
import type { InternalEvent, EventPayload } from '../types';

export async function publishEvent(
  event: InternalEvent,
  companyId: string,
  data: Record<string, unknown>,
  publisher: string,
): Promise<void> {
  const payload: EventPayload = {
    event,
    companyId,
    data,
    timestamp: new Date(),
    publisher,
  };
  await eventBus.emit(payload);
}
