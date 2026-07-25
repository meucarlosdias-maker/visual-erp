import type { ProjectTask } from '../types';
import { BaseRepository } from '@/lib/repository-base';

let mockTasks: ProjectTask[] = [];

export class ProjectTaskRepository extends BaseRepository<ProjectTask, ProjectTask, Partial<ProjectTask>> {
  async findAll(): Promise<ProjectTask[]> {
    return mockTasks.filter((t) => !t.deletedAt);
  }

  async findById(id: string): Promise<ProjectTask | null> {
    return mockTasks.find((t) => t.id === id && !t.deletedAt) ?? null;
  }

  async findMany(filter: Partial<ProjectTask>): Promise<ProjectTask[]> {
    return mockTasks.filter((t) =>
      !t.deletedAt && Object.entries(filter).every(([key, value]) => t[key as keyof ProjectTask] === value)
    );
  }

  async listByProjectId(projectId: string): Promise<ProjectTask[]> {
    return mockTasks
      .filter((t) => t.projectId === projectId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async create(data: ProjectTask): Promise<ProjectTask> {
    mockTasks.push(data);
    return data;
  }

  async createMany(tasks: ProjectTask[]): Promise<ProjectTask[]> {
    mockTasks.push(...tasks);
    return tasks;
  }

  async update(id: string, data: Partial<ProjectTask>): Promise<ProjectTask> {
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tarefa não encontrada');
    mockTasks[idx] = { ...mockTasks[idx], ...data };
    return mockTasks[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tarefa não encontrada');
    mockTasks[idx] = { ...mockTasks[idx], deletedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<ProjectTask> {
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tarefa não encontrada');
    mockTasks[idx] = { ...mockTasks[idx], deletedAt: null, updatedAt: new Date() };
    return mockTasks[idx];
  }

  async deleteByProjectId(projectId: string): Promise<void> {
    mockTasks = mockTasks.filter((t) => t.projectId !== projectId);
  }

  async reorder(projectId: string, taskIds: string[]): Promise<ProjectTask[]> {
    const tasks = mockTasks.filter((t) => t.projectId === projectId);
    const updated = tasks.map((task) => {
      const idx = taskIds.indexOf(task.id);
      return { ...task, sequence: idx >= 0 ? idx : task.sequence };
    });
    for (const u of updated) {
      const idx = mockTasks.findIndex((t) => t.id === u.id);
      if (idx !== -1) mockTasks[idx] = u;
    }
    return updated.sort((a, b) => a.sequence - b.sequence);
  }

  async listByDepartment(projectId: string, departmentId: string): Promise<ProjectTask[]> {
    return mockTasks
      .filter((t) => t.projectId === projectId && t.departmentId === departmentId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async listByDepartmentAll(departmentId: string): Promise<ProjectTask[]> {
    return mockTasks
      .filter((t) => t.departmentId === departmentId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async listByProjectIdAndStatus(projectId: string, status: string): Promise<ProjectTask[]> {
    return mockTasks
      .filter((t) => t.projectId === projectId && t.status === status);
  }

  async findNextTask(projectId: string, currentSequence: number): Promise<ProjectTask | null> {
    const tasks = mockTasks
      .filter((t) => t.projectId === projectId)
      .sort((a, b) => a.sequence - b.sequence);
    return tasks.find((t) => t.sequence > currentSequence) ?? null;
  }
}

export const projectTaskRepository = new ProjectTaskRepository();
