import type { Lead } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockLeads: Lead[] = [
  {
    id: 'lead-001', companyId: COMPANY_ID, number: 'LEAD-2026-0001',
    origin: 'website', status: 'NEW', temperature: 'HOT',
    companyName: 'Tech Solutions Ltda', contactName: 'Carlos Silva',
    phone: '(11) 99999-0001', email: 'carlos@techsolutions.com.br',
    city: 'São Paulo', state: 'SP',
    notes: 'Cliente interessado em adesivo vinílico para fachada',
    assignedUserId: 'user-001',
    createdAt: new Date('2026-07-20'), updatedAt: new Date('2026-07-20'), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'lead-002', companyId: COMPANY_ID, number: 'LEAD-2026-0002',
    origin: 'referral', status: 'CONTACTED', temperature: 'WARM',
    companyName: 'Construtora Nova Era', contactName: 'Ana Oliveira',
    phone: '(21) 98888-0002', email: 'ana@novaera.com.br',
    city: 'Rio de Janeiro', state: 'RJ',
    notes: 'Indicação do cliente João. Precisa de lona para estacionamento',
    assignedUserId: 'user-001',
    createdAt: new Date('2026-07-18'), updatedAt: new Date('2026-07-19'), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'lead-003', companyId: COMPANY_ID, number: 'LEAD-2026-0003',
    origin: 'phone', status: 'QUALIFIED', temperature: 'HOT',
    companyName: 'Padaria Pão Quente', contactName: 'Pedro Santos',
    phone: '(31) 97777-0003', email: 'pedro@paoquente.com.br',
    city: 'Belo Horizonte', state: 'MG',
    notes: 'Precisa de instalação completa: piso vinílico e adesivo',
    assignedUserId: null,
    createdAt: new Date('2026-07-15'), updatedAt: new Date('2026-07-16'), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'lead-004', companyId: COMPANY_ID, number: 'LEAD-2026-0004',
    origin: 'website', status: 'WON', temperature: 'HOT',
    companyName: 'Loja do Centro', contactName: 'Maria Costa',
    phone: '(11) 96666-0004', email: 'maria@lojacentro.com.br',
    city: 'São Paulo', state: 'SP',
    notes: 'Fechou contrato de adesivo vinílico para loja inteira',
    assignedUserId: 'user-001',
    createdAt: new Date('2026-07-10'), updatedAt: new Date('2026-07-14'), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'lead-005', companyId: COMPANY_ID, number: 'LEAD-2026-0005',
    origin: 'walk-in', status: 'LOST', temperature: 'COLD',
    companyName: 'Restaurante Sabor', contactName: 'João Lima',
    phone: '(41) 95555-0005', email: 'joao@restaurantesabor.com.br',
    city: 'Curitiba', state: 'PR',
    notes: 'Optou por outro fornecedor',
    assignedUserId: null,
    createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-08'), deletedAt: null,
    createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
];

export class LeadRepository extends BaseRepository<Lead, Lead, Partial<Lead>> {
  async findAll(): Promise<Lead[]> {
    return mockLeads
      .filter((l) => !l.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Lead | null> {
    return mockLeads.find((l) => l.id === id && !l.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Lead>): Promise<Lead[]> {
    return mockLeads.filter((l) => {
      if (l.deletedAt) return false;
      return Object.entries(filter).every(([key, value]) =>
        (l as Record<string, unknown>)[key] === value
      );
    });
  }

  async getNextNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockLeads.filter((l) => l.number.startsWith(`LEAD-${year}`));
    const nums = existing.map((l) => {
      const parts = l.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `LEAD-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async create(data: Lead): Promise<Lead> {
    mockLeads.push(data);
    return data;
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    const idx = mockLeads.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Lead não encontrado');
    mockLeads[idx] = { ...mockLeads[idx], ...data, updatedAt: new Date() };
    return mockLeads[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockLeads.findIndex((l) => l.id === id);
    if (idx !== -1) {
      mockLeads[idx] = { ...mockLeads[idx], deletedAt: new Date(), deletedBy: 'system' };
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<Lead> {
    const idx = mockLeads.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Lead não encontrado');
    mockLeads[idx] = { ...mockLeads[idx], deletedAt: null, deletedBy: null };
    return mockLeads[idx];
  }

  async listByStatus(_companyId: string, status: string): Promise<Lead[]> {
    return mockLeads.filter((l) => !l.deletedAt && l.status === status);
  }

  async getTotalByStatus(_companyId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const l of mockLeads) {
      if (!l.deletedAt) {
        counts[l.status] = (counts[l.status] || 0) + 1;
      }
    }
    return counts;
  }
}

export const leadRepository = new LeadRepository();
