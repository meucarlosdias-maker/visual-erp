import { projectTaskRepository } from '../repository/project-task-repository';
import { projectTaskSchema } from '../schemas';
import { productionOrderService } from './production-order-service';
import { BaseService } from '@/lib/service-base';
import type { ProjectTask } from '../types';
import type { ProjectTaskRepository } from '../repository/project-task-repository';

export class ProjectTaskService extends BaseService<ProjectTask, Record<string, unknown>, Record<string, unknown>, ProjectTaskRepository> {
  constructor() {
    super(projectTaskRepository);
  }

  protected entityName = 'Tarefa';

  async listByProjectId(projectId: string): Promise<ProjectTask[]> {
    return projectTaskRepository.listByProjectId(projectId);
  }

  async get(id: string): Promise<ProjectTask> {
    const task = await projectTaskRepository.findById(id);
    if (!task) throw new Error('Tarefa não encontrada');
    return task;
  }

  async create(data: Record<string, unknown>): Promise<ProjectTask> {
    const parsed = projectTaskSchema.parse({
      ...data,
      id: crypto.randomUUID(),
    });
    const task = await projectTaskRepository.create(parsed);
    await productionOrderService.createFromTask(
      task.projectId,
      task.id,
      task.departmentId,
      task.title,
    );
    return task;
  }

  async update(id: string, data: Record<string, unknown>): Promise<ProjectTask> {
    const existing = await projectTaskRepository.findById(id);
    if (!existing) throw new Error('Tarefa não encontrada');

    const patch: Partial<ProjectTask> = {
      title: (data.title as string) ?? existing.title,
      description: (data.description as string) ?? existing.description,
      status: (data.status as ProjectTask['status']) ?? existing.status,
      estimatedHours: data.estimatedHours !== undefined ? Number(data.estimatedHours) : existing.estimatedHours,
      actualHours: data.actualHours !== undefined ? Number(data.actualHours) : existing.actualHours,
      assignedTeamId: data.assignedTeamId !== undefined ? (data.assignedTeamId as string | null) : existing.assignedTeamId,
    };

    if (data.status === 'IN_PROGRESS' && !existing.startedAt) {
      patch.startedAt = new Date();
    }
    if (data.status === 'FINISHED' || data.status === 'CANCELLED') {
      patch.finishedAt = new Date();
    }

    const updated = await projectTaskRepository.update(id, patch);

    if (data.status === 'FINISHED') {
      await this.autoForward(existing.projectId, existing.sequence);
    }

    return updated;
  }

  async updateStatus(id: string, status: string): Promise<ProjectTask> {
    return this.update(id, { status });
  }

  private async autoForward(projectId: string, currentSequence: number): Promise<void> {
    const nextTask = await projectTaskRepository.findNextTask(projectId, currentSequence);
    if (nextTask && nextTask.status === 'PENDING') {
      await projectTaskRepository.update(nextTask.id, { status: 'WAITING' as ProjectTask['status'] });
    }
  }

  async reorder(projectId: string, taskIds: string[]): Promise<ProjectTask[]> {
    return projectTaskRepository.reorder(projectId, taskIds);
  }

  async listByDepartment(projectId: string, departmentId: string): Promise<ProjectTask[]> {
    return projectTaskRepository.listByDepartment(projectId, departmentId);
  }

  async listByDepartmentAll(departmentId: string): Promise<ProjectTask[]> {
    return projectTaskRepository.listByDepartmentAll(departmentId);
  }

  async listByProjectIdAndStatus(projectId: string, status: string): Promise<ProjectTask[]> {
    return projectTaskRepository.listByProjectIdAndStatus(projectId, status);
  }
}

export const projectTaskService = new ProjectTaskService();
