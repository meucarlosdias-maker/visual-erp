import { BaseService } from '@/lib/service-base';
import { workflowRepository, type WorkflowRepository } from '../repository/workflow-repository';
import { NotFoundError } from '@/lib/errors';
import type { Workflow } from '../types';
import type { WorkflowInput, WorkflowUpdate } from '../schemas';

export class WorkflowService extends BaseService<Workflow, WorkflowInput, WorkflowUpdate, WorkflowRepository> {
  protected entityName = 'Workflow';

  constructor() {
    super(workflowRepository);
  }

  async list(): Promise<Workflow[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<Workflow> {
    const wf = await this.repository.findById(id);
    if (!wf) throw new NotFoundError('Workflow', id);
    return wf;
  }

  async create(input: WorkflowInput): Promise<Workflow> {
    return this.repository.create(input);
  }

  async update(id: string, input: WorkflowUpdate): Promise<Workflow> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<Workflow> {
    return this.repository.restore(id);
  }
}

export const workflowService = new WorkflowService();
