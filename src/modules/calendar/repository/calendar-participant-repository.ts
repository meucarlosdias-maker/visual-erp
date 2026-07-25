import { BaseRepository } from '@/lib/repository-base';
import type { CalendarParticipant } from '../types';

const mockParticipants: CalendarParticipant[] = [
  { id: 'cp-001', eventId: 'cal-001', userId: 'user-001', required: true, confirmed: true },
  { id: 'cp-002', eventId: 'cal-001', userId: 'user-002', required: true, confirmed: false },
  { id: 'cp-003', eventId: 'cal-003', userId: 'user-002', required: true, confirmed: true },
  { id: 'cp-004', eventId: 'cal-003', userId: 'user-004', required: false, confirmed: true },
  { id: 'cp-005', eventId: 'cal-006', userId: 'user-002', required: true, confirmed: false },
];

export class CalendarParticipantRepository extends BaseRepository<CalendarParticipant, CalendarParticipant, Partial<CalendarParticipant>> {
  async findAll(): Promise<CalendarParticipant[]> {
    return [...mockParticipants];
  }

  async findById(id: string): Promise<CalendarParticipant | null> {
    return mockParticipants.find((p) => p.id === id) ?? null;
  }

  async findMany(filter: Partial<CalendarParticipant>): Promise<CalendarParticipant[]> {
    return mockParticipants.filter((p) =>
      Object.entries(filter).every(([key, value]) =>
        (p as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(data: CalendarParticipant): Promise<CalendarParticipant> {
    mockParticipants.push(data);
    return data;
  }

  async update(id: string, data: Partial<CalendarParticipant>): Promise<CalendarParticipant> {
    const idx = mockParticipants.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Participante não encontrado');
    mockParticipants[idx] = { ...mockParticipants[idx], ...data };
    return mockParticipants[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockParticipants.findIndex((p) => p.id === id);
    if (idx !== -1) {
      mockParticipants.splice(idx, 1);
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<CalendarParticipant> {
    const found = mockParticipants.find((p) => p.id === id);
    if (!found) throw new Error('Participante não encontrado');
    return found;
  }

  async listByEventId(eventId: string): Promise<CalendarParticipant[]> {
    return mockParticipants.filter((p) => p.eventId === eventId);
  }

  async listByUserId(userId: string): Promise<CalendarParticipant[]> {
    return mockParticipants.filter((p) => p.userId === userId);
  }

  async deleteByEventId(eventId: string): Promise<void> {
    const toRemove = mockParticipants.filter((p) => p.eventId === eventId);
    for (const p of toRemove) {
      const idx = mockParticipants.indexOf(p);
      if (idx !== -1) mockParticipants.splice(idx, 1);
    }
  }
}

export const calendarParticipantRepository = new CalendarParticipantRepository();
