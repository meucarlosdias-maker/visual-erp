import { installationRepository } from '../repository/installation-repository';
import type { Installation } from '../types';

export class SchedulingService {
  async listByDate(date: Date): Promise<Installation[]> {
    const all = await installationRepository.list('');
    const dateStr = date.toISOString().split('T')[0];
    return all.filter((i) => {
      if (!i.scheduledDate) return false;
      return i.scheduledDate.toISOString().split('T')[0] === dateStr;
    });
  }

  async listByDateRange(start: Date, end: Date): Promise<Installation[]> {
    const all = await installationRepository.list('');
    return all.filter((i) => {
      if (!i.scheduledDate) return false;
      return i.scheduledDate >= start && i.scheduledDate <= end;
    });
  }

  async reschedule(installationId: string, newDate: Date): Promise<Installation> {
    return installationRepository.update(installationId, { scheduledDate: newDate });
  }
}

export const schedulingService = new SchedulingService();
