import { calendarEventRepository } from '../repository/calendar-event-repository';
import type { CalendarEvent } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class SchedulingService {
  async checkConflicts(startDate: Date, endDate: Date, excludeEventId?: string): Promise<CalendarEvent[]> {
    const events = await calendarEventRepository.listByDateRange(COMPANY_ID, startDate, endDate);
    return events.filter((e) => excludeEventId ? e.id !== excludeEventId : true);
  }

  async getScheduleForDate(date: Date): Promise<CalendarEvent[]> {
    return calendarEventRepository.listByDate(COMPANY_ID, date);
  }

  async getScheduleForDateRange(start: Date, end: Date): Promise<CalendarEvent[]> {
    return calendarEventRepository.listByDateRange(COMPANY_ID, start, end);
  }
}

export const schedulingService = new SchedulingService();
