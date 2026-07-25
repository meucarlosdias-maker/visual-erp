import type { Project } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockProjects: Project[] = [
  {
    id: 'proj-001', companyId: COMPANY_ID, quotationId: 'orc-001-v1', clientId: 'cliente-001',
    number: 'PROJ-2026-0001', name: 'Instalação de Lona Oléfina — Empresa ABC',
    description: 'Projeto gerado a partir do orçamento aprovado',
    status: 'IN_PRODUCTION', priority: 'high',
    expectedStartDate: new Date('2026-02-01'), expectedEndDate: new Date('2026-03-15'),
    actualStartDate: new Date('2026-02-05'), actualEndDate: null,
    notes: '',
    tasks: [
      {
        id: 'task-001', projectId: 'proj-001', departmentId: 'dept-design',
        title: 'Criação de arte', description: 'Desenvolver arte para impressão',
        sequence: 1, status: 'FINISHED',
        estimatedHours: 8, actualHours: 6, assignedTeamId: null, dependsOnTaskId: null,
        startedAt: new Date('2026-02-05'), finishedAt: new Date('2026-02-06'),
        createdAt: new Date('2026-01-20'), updatedAt: new Date('2026-02-06'), deletedAt: null,
        createdBy: '', updatedBy: null, deletedBy: null,
      },
      {
        id: 'task-002', projectId: 'proj-001', departmentId: 'dept-impressao',
        title: 'Impressão digital', description: 'Imprimir lona oléfina',
        sequence: 2, status: 'IN_PROGRESS',
        estimatedHours: 4, actualHours: null, assignedTeamId: null, dependsOnTaskId: 'task-001',
        startedAt: new Date('2026-02-07'), finishedAt: null,
        createdAt: new Date('2026-01-20'), updatedAt: new Date('2026-02-07'), deletedAt: null,
        createdBy: '', updatedBy: null, deletedBy: null,
      },
      {
        id: 'task-003', projectId: 'proj-001', departmentId: 'dept-instalacao',
        title: 'Instalação em campo', description: 'Instalar lona na fachada',
        sequence: 3, status: 'PENDING',
        estimatedHours: 6, actualHours: null, assignedTeamId: null, dependsOnTaskId: 'task-002',
        startedAt: null, finishedAt: null,
        createdAt: new Date('2026-01-20'), updatedAt: new Date('2026-01-20'), deletedAt: null,
        createdBy: '', updatedBy: null, deletedBy: null,
      },
    ],
    createdAt: new Date('2026-01-20'), updatedAt: new Date('2026-02-07'),
    deletedAt: null, createdBy: '', updatedBy: null, deletedBy: null,
  },
  {
    id: 'proj-002', companyId: COMPANY_ID, quotationId: null, clientId: 'cliente-002',
    number: 'PROJ-2026-0002', name: 'Aplicação de Adesivo Vinílico — Loja Center',
    description: 'Projeto aprovado aguardando início',
    status: 'WAITING', priority: 'normal',
    expectedStartDate: new Date('2026-03-01'), expectedEndDate: new Date('2026-03-30'),
    actualStartDate: null, actualEndDate: null,
    notes: '',
    tasks: [],
    createdAt: new Date('2026-02-10'), updatedAt: new Date('2026-02-10'),
    deletedAt: null, createdBy: '', updatedBy: null, deletedBy: null,
  },
];

export class ProjectRepository extends BaseRepository<Project, Project, Partial<Project>> {
  async findAll(): Promise<Project[]> {
    return mockProjects
      .filter((p) => !p.deletedAt)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findById(id: string): Promise<Project | null> {
    return mockProjects.find((p) => p.id === id && !p.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Project>): Promise<Project[]> {
    return mockProjects.filter((p) =>
      !p.deletedAt && Object.entries(filter).every(([key, value]) => p[key as keyof Project] === value)
    );
  }

  async getNextNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockProjects
      .filter((p) => p.companyId === companyId && p.number.startsWith(`PROJ-${year}`));
    const nums = existing.map((p) => {
      const parts = p.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `PROJ-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async create(data: Project): Promise<Project> {
    mockProjects.push(data);
    return data;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const idx = mockProjects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Projeto não encontrado');
    mockProjects[idx] = { ...mockProjects[idx], ...data, updatedAt: new Date() };
    return mockProjects[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockProjects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Projeto não encontrado');
    mockProjects[idx] = { ...mockProjects[idx], deletedAt: new Date(), deletedBy: '' };
    return true;
  }

  async restore(id: string): Promise<Project> {
    const idx = mockProjects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Projeto não encontrado');
    mockProjects[idx] = { ...mockProjects[idx], deletedAt: null, deletedBy: null, updatedAt: new Date() };
    return mockProjects[idx];
  }

  async listByStatus(companyId: string, status: string): Promise<Project[]> {
    return mockProjects.filter(
      (p) => p.companyId === companyId && !p.deletedAt && p.status === status,
    );
  }

  async getByQuotationId(quotationId: string): Promise<Project | null> {
    return mockProjects.find((p) => p.quotationId === quotationId && !p.deletedAt) ?? null;
  }
}

export const projectRepository = new ProjectRepository();
