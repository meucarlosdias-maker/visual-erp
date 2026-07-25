import type { ServiceComponent } from '../types';

const mockComponents: ServiceComponent[] = [
  {
    id: 'comp-001', serviceId: 'svc-001',
    name: 'Template HTML/CSS', description: 'Template responsivo padrão',
    componentType: 'SERVICE', required: true, sequence: 1, active: true,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'comp-002', serviceId: 'svc-001',
    name: 'Registro de Domínio', description: 'Registro de domínio .com.br',
    componentType: 'SERVICE', required: true, sequence: 2, active: true,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class ComponentRepository {
  async listByService(serviceId: string): Promise<ServiceComponent[]> {
    return mockComponents
      .filter((c) => c.serviceId === serviceId && !c.deletedAt)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async getById(id: string): Promise<ServiceComponent | null> {
    return mockComponents.find((c) => c.id === id && !c.deletedAt) ?? null;
  }

  async create(data: ServiceComponent): Promise<ServiceComponent> {
    const item: ServiceComponent = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockComponents.push(item);
    return item;
  }

  async update(id: string, data: Partial<ServiceComponent>): Promise<ServiceComponent> {
    const idx = mockComponents.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Componente não encontrado');
    mockComponents[idx] = { ...mockComponents[idx], ...data, updatedAt: new Date() };
    return mockComponents[idx];
  }

  async softDelete(id: string): Promise<void> {
    const idx = mockComponents.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Componente não encontrado');
    mockComponents[idx] = { ...mockComponents[idx], deletedAt: new Date(), updatedAt: new Date() };
  }
}

export const componentRepository = new ComponentRepository();
