import { productionOrderRepository } from '../repository/production-order-repository';
import { productionOrderSchema } from '../schemas/production-order-schema';
import { BaseService } from '@/lib/service-base';
import type { ProductionOrder } from '../types/production-order';
import type { ProductionOrderRepository } from '../repository/production-order-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class ProductionOrderService extends BaseService<ProductionOrder, Record<string, unknown>, Record<string, unknown>, ProductionOrderRepository> {
  constructor() {
    super(productionOrderRepository);
  }

  protected entityName = 'Ordem de Produção';

  async list(): Promise<ProductionOrder[]> {
    return productionOrderRepository.findAll();
  }

  async listByProjectId(projectId: string): Promise<ProductionOrder[]> {
    return productionOrderRepository.listByProjectId(projectId);
  }

  async createFromTask(
    projectId: string,
    projectTaskId: string,
    departmentId: string | null,
    title: string,
    priority?: string,
  ): Promise<ProductionOrder> {
    const number = await productionOrderRepository.getNextNumber(COMPANY_ID);
    const now = new Date();

    const order = productionOrderSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      projectId,
      projectTaskId,
      departmentId,
      number,
      title: `OP: ${title}`,
      description: '',
      status: 'pending',
      priority: priority ?? 'normal',
      assignedTeamId: null,
      estimatedHours: null,
      actualHours: null,
      startedAt: null,
      finishedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: '',
      updatedBy: null,
      deletedBy: null,
    });

    return productionOrderRepository.create(order);
  }

  async updateStatus(id: string, status: string): Promise<ProductionOrder> {
    const existing = await productionOrderRepository.findById(id);
    if (!existing) throw new Error('Ordem de produção não encontrada');

    const patch: Partial<ProductionOrder> = {
      status: status as ProductionOrder['status'],
    };

    if (status === 'in_progress' && !existing.startedAt) {
      patch.startedAt = new Date();
    }
    if (status === 'finished' || status === 'cancelled') {
      patch.finishedAt = new Date();
    }

    return productionOrderRepository.update(id, patch);
  }
}

export const productionOrderService = new ProductionOrderService();
