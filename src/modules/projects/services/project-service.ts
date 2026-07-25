import { projectRepository } from '../repository/project-repository';
import { projectCreateSchema } from '../schemas';
import { departmentRepository } from '../repository/department-repository';
import { projectTaskRepository } from '../repository/project-task-repository';
import { productionOrderService } from './production-order-service';
import { installationService } from '../../installations/services/installation-service';
import { BaseService } from '@/lib/service-base';
import type { Project, ProjectTask } from '../types';
import type { ProjectRepository } from '../repository/project-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class ProjectService extends BaseService<Project, Record<string, unknown>, Record<string, unknown>, ProjectRepository> {
  constructor() {
    super(projectRepository);
  }

  protected entityName = 'Projeto';

  async list(): Promise<Project[]> {
    const projects = await projectRepository.findAll();
    return projects.map((p) => {
      const tasks = p.tasks ?? [];
      return { ...p, tasks };
    });
  }

  async get(id: string): Promise<Project> {
    const project = await projectRepository.findById(id);
    if (!project) throw new Error('Projeto não encontrado');
    const tasks = await projectTaskRepository.listByProjectId(id);
    return { ...project, tasks };
  }

  async create(data: Record<string, unknown>): Promise<Project> {
    const parsed = projectCreateSchema.parse(data);
    const number = await projectRepository.getNextNumber(COMPANY_ID);
    const now = new Date();
    const projectId = crypto.randomUUID();

    const departments = await departmentRepository.findAll();
    const taskIds = departments.map(() => crypto.randomUUID());
    const tasks: ProjectTask[] = departments.map((dept, idx) => ({
      id: taskIds[idx],
      projectId,
      departmentId: dept.id,
      title: `${dept.name} — ${parsed.name}`,
      description: `Tarefa do departamento ${dept.name}`,
      sequence: idx,
      status: 'PENDING',
      estimatedHours: null,
      actualHours: null,
      assignedTeamId: null,
      dependsOnTaskId: idx > 0 ? taskIds[idx - 1] : null,
      startedAt: null,
      finishedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: '',
      updatedBy: null,
      deletedBy: null,
    }));

    const project: Project = {
      id: projectId,
      companyId: COMPANY_ID,
      quotationId: parsed.quotationId ?? null,
      clientId: parsed.clientId ?? null,
      number,
      name: parsed.name,
      description: parsed.description ?? '',
      status: 'WAITING',
      priority: parsed.priority ?? 'normal',
      expectedStartDate: parsed.expectedStartDate ? new Date(parsed.expectedStartDate) : null,
      expectedEndDate: parsed.expectedEndDate ? new Date(parsed.expectedEndDate) : null,
      actualStartDate: null,
      actualEndDate: null,
      notes: parsed.notes ?? '',
      tasks,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: '',
      updatedBy: null,
      deletedBy: null,
    };

    const created = await projectRepository.create(project);
    await projectTaskRepository.createMany(tasks);

    for (const task of tasks) {
      await productionOrderService.createFromTask(projectId, task.id, task.departmentId, task.title);
    }

    return created;
  }

  async createFromQuotation(quotationId: string, clientId: string | null, name: string): Promise<Project> {
    return this.create({
      quotationId,
      clientId,
      name: `Projeto: ${name}`,
      description: 'Projeto gerado automaticamente a partir da aprovação do orçamento',
      priority: 'normal',
    });
  }

  async update(id: string, data: Record<string, unknown>): Promise<Project> {
    const existing = await projectRepository.findById(id);
    if (!existing) throw new Error('Projeto não encontrado');

    const patch: Partial<Project> = {
      name: (data.name as string) ?? existing.name,
      description: (data.description as string) ?? existing.description,
      status: (data.status as Project['status']) ?? existing.status,
      priority: (data.priority as string) ?? existing.priority,
      expectedStartDate: data.expectedStartDate
        ? new Date(data.expectedStartDate as string)
        : data.expectedStartDate === null ? null : existing.expectedStartDate,
      expectedEndDate: data.expectedEndDate
        ? new Date(data.expectedEndDate as string)
        : data.expectedEndDate === null ? null : existing.expectedEndDate,
      notes: (data.notes as string) ?? existing.notes,
    };

    if (data.status === 'IN_PRODUCTION' && !existing.actualStartDate) {
      patch.actualStartDate = new Date();
    }
    if (data.status === 'FINISHED' || data.status === 'DELIVERED') {
      patch.actualEndDate = new Date();
    }

    const updated = await projectRepository.update(id, patch);

    if (data.status === 'FINISHED') {
      const existingInst = await installationService.getByProjectId(id);
      if (!existingInst) {
        await installationService.createFromProject(id, existing.clientId, existing.name);
      }
    }

    return updated;
  }

  async updateStatus(id: string, status: string): Promise<Project> {
    return this.update(id, { status });
  }

  async listByStatus(status: string): Promise<Project[]> {
    return projectRepository.listByStatus(COMPANY_ID, status);
  }

  async getByQuotationId(quotationId: string): Promise<Project | null> {
    return projectRepository.getByQuotationId(quotationId);
  }
}

export const projectService = new ProjectService();
