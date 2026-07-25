import { BaseService } from '@/lib/service-base';
import { calendarParticipantRepository, CalendarParticipantRepository } from '../repository/calendar-participant-repository';
import { calendarParticipantSchema } from '../schemas';
import type { CalendarParticipant } from '../types';

export class CalendarParticipantService extends BaseService<CalendarParticipant, CalendarParticipant, Partial<CalendarParticipant>, CalendarParticipantRepository> {
  protected entityName = 'CalendarParticipant';

  constructor() {
    super(calendarParticipantRepository);
  }

  async list(): Promise<CalendarParticipant[]> {
    return this.repository.findAll() as Promise<CalendarParticipant[]>;
  }

  async create(data: Record<string, unknown>): Promise<CalendarParticipant> {
    const parsed = calendarParticipantSchema.parse({
      id: crypto.randomUUID(),
      ...data,
    });
    return this.repository.create(parsed);
  }

  async update(id: string, data: Partial<CalendarParticipant>): Promise<CalendarParticipant> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<CalendarParticipant> {
    return this.repository.restore(id);
  }

  async duplicate(id: string): Promise<CalendarParticipant> {
    const original = await this.get(id);
    const { id: _id, ...data } = original;
    return this.create(data as unknown as Record<string, unknown>);
  }

  async listByEventId(eventId: string): Promise<CalendarParticipant[]> {
    return this.repository.listByEventId(eventId);
  }

  async listByUserId(userId: string): Promise<CalendarParticipant[]> {
    return this.repository.listByUserId(userId);
  }

  async deleteByEventId(eventId: string): Promise<void> {
    return this.repository.deleteByEventId(eventId);
  }
}

export const calendarParticipantService = new CalendarParticipantService();
