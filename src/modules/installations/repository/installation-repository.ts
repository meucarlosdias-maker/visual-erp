import type { Installation } from '../types';

const mockInstallations: Installation[] = [
  {
    id: 'inst-001', projectId: 'proj-001', clientId: 'cliente-001',
    number: 'INST-2026-0001', status: 'IN_PROGRESS',
    scheduledDate: new Date('2026-03-01'), startDate: new Date('2026-03-01'), endDate: null,
    address: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP', zipCode: '01310-100',
    latitude: null, longitude: null,
    contactName: 'Carlos Silva', contactPhone: '(11) 99999-0001',
    notes: 'Acesso pela portaria principal',
    teams: [
      { id: 'it-001', installationId: 'inst-001', teamId: 'team-instalacao', leaderId: null, estimatedHours: 8, actualHours: 6 },
    ],
    equipments: [
      { id: 'ie-001', installationId: 'inst-001', equipmentId: 'eq-caminhao', quantity: 1 },
    ],
    vehicles: [
      { id: 'iv-001', installationId: 'inst-001', vehicle: 'Fiorino', driver: 'José', plate: 'ABC-1234', notes: '' },
    ],
    createdAt: new Date('2026-02-20'), updatedAt: new Date('2026-03-01'),
    deletedAt: null, createdBy: '', updatedBy: null, deletedBy: null,
  },
  {
    id: 'inst-002', projectId: 'proj-002', clientId: null,
    number: 'INST-2026-0002', status: 'PLANNING',
    scheduledDate: null, startDate: null, endDate: null,
    address: '', city: '', state: '', zipCode: '',
    latitude: null, longitude: null,
    contactName: '', contactPhone: '',
    notes: '',
    teams: [], equipments: [], vehicles: [],
    createdAt: new Date('2026-03-05'), updatedAt: new Date('2026-03-05'),
    deletedAt: null, createdBy: '', updatedBy: null, deletedBy: null,
  },
];

export class InstallationRepository {
  async list(_companyId: string): Promise<Installation[]> {
    return mockInstallations
      .filter((i) => !i.deletedAt)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getById(id: string): Promise<Installation | null> {
    return mockInstallations.find((i) => i.id === id && !i.deletedAt) ?? null;
  }

  async getByProjectId(projectId: string): Promise<Installation | null> {
    return mockInstallations.find((i) => i.projectId === projectId && !i.deletedAt) ?? null;
  }

  async getNextNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockInstallations.filter((i) => i.number.startsWith(`INST-${year}`));
    const nums = existing.map((i) => {
      const parts = i.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `INST-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async create(data: Installation): Promise<Installation> {
    mockInstallations.push(data);
    return data;
  }

  async update(id: string, data: Partial<Installation>): Promise<Installation> {
    const idx = mockInstallations.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Instalação não encontrada');
    mockInstallations[idx] = { ...mockInstallations[idx], ...data, updatedAt: new Date() };
    return mockInstallations[idx];
  }

  async softDelete(id: string): Promise<void> {
    const idx = mockInstallations.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Instalação não encontrada');
    mockInstallations[idx] = { ...mockInstallations[idx], deletedAt: new Date(), deletedBy: '' };
  }

  async listByStatus(_companyId: string, status: string): Promise<Installation[]> {
    return mockInstallations.filter((i) => !i.deletedAt && i.status === status);
  }
}

export const installationRepository = new InstallationRepository();
