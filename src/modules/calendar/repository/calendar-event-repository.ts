import { BaseRepository } from '@/lib/repository-base';
import type { CalendarEvent } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);
const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);

const mockEvents: CalendarEvent[] = [
  {
    id: 'cal-001', companyId: COMPANY_ID,
    title: 'Visita Técnica - Tech Solutions',
    description: 'Levantamento de medidas para instalação de lona na fachada.',
    notes: 'Cliente solicitou orçamento preliminar.', type: 'VISIT', status: 'CONFIRMED',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
    allDay: false, location: 'Av. Paulista, 1000', color: '', icon: '',
    clientId: 'cliente-001', leadId: null, projectId: null, workOrderId: null,
    productionOrderId: null, installationId: null, financialId: null,
    assignedUserId: 'user-001', assignedTeamId: null,
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-002', companyId: COMPANY_ID,
    title: 'Reunião Comercial - Orçamento Loja Centro',
    description: 'Apresentação de proposta para aplicação de adesivo vinílico.',
    notes: '', type: 'MEETING', status: 'SCHEDULED',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
    allDay: false, location: 'Escritório', color: '', icon: '',
    clientId: 'cliente-002', leadId: 'lead-001', projectId: null, workOrderId: null,
    productionOrderId: null, installationId: null, financialId: null,
    assignedUserId: 'user-001', assignedTeamId: null,
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-003', companyId: COMPANY_ID,
    title: 'Instalação de Lona - Galpão Industrial',
    description: 'Instalação de lona oléfina no galpão da zona sul.',
    notes: 'Equipe deve levar EPIs.', type: 'INSTALLATION', status: 'CONFIRMED',
    startDate: new Date(today.getFullYear(), today.getMonth(), tomorrow.getDate(), 8, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), tomorrow.getDate(), 17, 0),
    allDay: false, location: 'Zona Sul, 500', color: '', icon: '',
    clientId: 'cliente-003', leadId: null, projectId: 'proj-001', workOrderId: 'wo-003',
    productionOrderId: null, installationId: 'inst-001', financialId: null,
    assignedUserId: 'user-002', assignedTeamId: 'team-001',
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-004', companyId: COMPANY_ID,
    title: 'Produção - Corte de Lonas',
    description: 'Produção programada para a OS-2026-0001.',
    notes: '', type: 'PRODUCTION', status: 'SCHEDULED',
    startDate: new Date(today.getFullYear(), today.getMonth(), tomorrow.getDate(), 7, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), tomorrow.getDate(), 12, 0),
    allDay: false, location: 'Fábrica', color: '', icon: '',
    clientId: null, leadId: null, projectId: null, workOrderId: 'wo-001',
    productionOrderId: 'op-001', installationId: null, financialId: null,
    assignedUserId: null, assignedTeamId: 'team-002',
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-005', companyId: COMPANY_ID,
    title: 'Pagamento Fornecedor - Lonas Ltda',
    description: 'Vencimento do boleto de materiais.',
    notes: 'Valor: R$ 5.300,00', type: 'PAYMENT', status: 'SCHEDULED',
    startDate: new Date(today.getFullYear(), today.getMonth(), dayAfter.getDate(), 0, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), dayAfter.getDate(), 23, 59),
    allDay: true, location: '', color: '', icon: '',
    clientId: null, leadId: null, projectId: null, workOrderId: null,
    productionOrderId: null, installationId: null, financialId: 'ap-001',
    assignedUserId: 'user-003', assignedTeamId: null,
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-006', companyId: COMPANY_ID,
    title: 'Entrega de Materiais',
    description: 'Entrega de lonas e perfis para obra no centro.',
    notes: '', type: 'DELIVERY', status: 'SCHEDULED',
    startDate: new Date(today.getFullYear(), today.getMonth(), nextWeek.getDate(), 8, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), nextWeek.getDate(), 12, 0),
    allDay: false, location: 'Rua Augusta, 200', color: '', icon: '',
    clientId: 'cliente-002', leadId: null, projectId: null, workOrderId: 'wo-004',
    productionOrderId: null, installationId: 'inst-002', financialId: null,
    assignedUserId: 'user-002', assignedTeamId: 'team-001',
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-007', companyId: COMPANY_ID,
    title: 'Recebimento Cliente - Tech Solutions',
    description: 'Previsão de recebimento da NF 1234.',
    notes: 'R$ 25.000,00 - NF 1234', type: 'RECEIPT', status: 'SCHEDULED',
    startDate: new Date(today.getFullYear(), today.getMonth(), dayAfter.getDate(), 0, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), dayAfter.getDate(), 23, 59),
    allDay: true, location: '', color: '', icon: '',
    clientId: 'cliente-001', leadId: null, projectId: null, workOrderId: 'wo-001',
    productionOrderId: null, installationId: null, financialId: 'ar-001',
    assignedUserId: 'user-003', assignedTeamId: null,
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'cal-008', companyId: COMPANY_ID,
    title: 'Aniversário Empresa',
    description: '',
    notes: '', type: 'REMINDER', status: 'SCHEDULED',
    startDate: new Date(2026, 6, 22, 0, 0),
    endDate: new Date(2026, 6, 22, 23, 59),
    allDay: true, location: '', color: '', icon: '',
    clientId: null, leadId: null, projectId: null, workOrderId: null,
    productionOrderId: null, installationId: null, financialId: null,
    assignedUserId: null, assignedTeamId: null,
    createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
];

export class CalendarEventRepository extends BaseRepository<CalendarEvent, CalendarEvent, Partial<CalendarEvent>> {
  async findAll(): Promise<CalendarEvent[]> {
    return mockEvents
      .filter((e) => !e.deletedAt)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async findById(id: string): Promise<CalendarEvent | null> {
    return mockEvents.find((e) => e.id === id && !e.deletedAt) ?? null;
  }

  async findMany(filter: Partial<CalendarEvent>): Promise<CalendarEvent[]> {
    return mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (e as Record<string, unknown>)[key] === value
      );
    });
  }

  async create(data: CalendarEvent): Promise<CalendarEvent> {
    mockEvents.push(data);
    return data;
  }

  async update(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Evento não encontrado');
    mockEvents[idx] = { ...mockEvents[idx], ...data, updatedAt: new Date() };
    return mockEvents[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx !== -1) {
      mockEvents.splice(idx, 1);
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<CalendarEvent> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Evento não encontrado');
    mockEvents[idx] = { ...mockEvents[idx], deletedAt: null, deletedBy: null };
    return mockEvents[idx];
  }

  async listByDateRange(_companyId: string, start: Date, end: Date): Promise<CalendarEvent[]> {
    return mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return e.startDate <= end && e.endDate >= start;
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async listByDate(_companyId: string, date: Date): Promise<CalendarEvent[]> {
    const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
    return mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return e.startDate <= dayEnd && e.endDate >= dayStart;
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async getTypeCounts(_companyId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const e of mockEvents) {
      if (!e.deletedAt) counts[e.type] = (counts[e.type] || 0) + 1;
    }
    return counts;
  }

  async getDashboardStats(_companyId: string) {
    const now = new Date();
    const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now); dayEnd.setHours(23, 59, 59, 999);

    const todayEvents = mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return e.startDate <= dayEnd && e.endDate >= dayStart;
    });

    const installations = mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return e.type === 'INSTALLATION' && e.status !== 'FINISHED' && e.status !== 'CANCELLED';
    });

    const visits = mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return e.type === 'VISIT' && e.status !== 'FINISHED' && e.status !== 'CANCELLED';
    });

    const productions = mockEvents.filter((e) => {
      if (e.deletedAt) return false;
      return e.type === 'PRODUCTION' && e.status !== 'FINISHED' && e.status !== 'CANCELLED';
    });

    return {
      todayCount: todayEvents.length,
      installationsCount: installations.length,
      visitsCount: visits.length,
      productionsCount: productions.length,
    };
  }
}

export const calendarEventRepository = new CalendarEventRepository();
