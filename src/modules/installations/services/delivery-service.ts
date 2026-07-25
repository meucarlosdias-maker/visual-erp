import { installationRepository } from '../repository/installation-repository';
import type { Installation } from '../types';

export class DeliveryService {
  async listPending(): Promise<Installation[]> {
    const all = await installationRepository.list('');
    return all.filter((i) => i.status === 'FINISHED' || i.status === 'ON_ROUTE' || i.status === 'IN_PROGRESS');
  }

  async listDelivered(): Promise<Installation[]> {
    const all = await installationRepository.list('');
    return all.filter((i) => i.status === 'DELIVERED');
  }

  async finishDelivery(installationId: string): Promise<Installation> {
    return installationRepository.update(installationId, {
      status: 'DELIVERED',
      endDate: new Date(),
    } as Partial<Installation>);
  }
}

export const deliveryService = new DeliveryService();
