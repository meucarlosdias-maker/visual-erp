import { BaseService } from '@/lib/service-base';
import { calendarEventRepository, CalendarEventRepository } from '../repository/calendar-event-repository';
import { calendarEventSchema } from '../schemas';
import type { CalendarEvent } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class CalendarEventService extends BaseService<CalendarEvent, CalendarEvent, Partial<CalendarEvent>, CalendarEventRepository> {
  protected entityName = 'CalendarEvent';

  constructor() {
    super(calendarEventRepository);
  }

  async list(): Promise<CalendarEvent[]> {
    return this.repository.findAll() as Promise<CalendarEvent[]>;
  }

  async create(data: Record<string, unknown>): Promise<CalendarEvent> {
    const parsed = calendarEventSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.repository.create(parsed);
  }

  async update(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.repository.update(id, { ...data, updatedAt: new Date() });
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<CalendarEvent> {
    return this.repository.restore(id);
  }

  async duplicate(id: string): Promise<CalendarEvent> {
    const original = await this.get(id);
    const { id: _id, createdAt, updatedAt, deletedAt, deletedBy: _deletedBy, ...data } = original;
    return this.create(data as unknown as Record<string, unknown>);
  }

  async listByDateRange(start: Date, end: Date): Promise<CalendarEvent[]> {
    return this.repository.listByDateRange(COMPANY_ID, start, end);
  }

  async listByDate(date: Date): Promise<CalendarEvent[]> {
    return this.repository.listByDate(COMPANY_ID, date);
  }

  async getTypeCounts(): Promise<Record<string, number>> {
    return this.repository.getTypeCounts(COMPANY_ID);
  }

  async getDashboardStats() {
    return this.repository.getDashboardStats(COMPANY_ID);
  }
}

export const calendarEventService = new CalendarEventService();
