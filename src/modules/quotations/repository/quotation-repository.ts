import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { Quotation } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockQuotations: Quotation[] = [
  {
    id: 'orc-001-v1', companyId: COMPANY_ID, clientId: 'cliente-001',
    number: 'ORC-2026-0001', version: 1, status: 'APPROVED',
    title: 'Instalação de Lona Oléfina — Empresa ABC',
    description: 'Instalação completa de fachada com lona oléfina impressa',
    validUntil: new Date('2026-05-10'),
    subtotal: 2355.50, discount: 0, discountType: null, total: 2355.50,
    notes: 'Cliente solicitou prioridade na entrega', internalNotes: 'Verificar disponibilidade de material',
    items: [
      { id: 'orc-001-v1-item-1', quotationId: 'orc-001-v1', serviceId: 'svc-001', description: 'Instalação de Lona Oléfina', quantity: 1, unit: 'UN', unitPrice: 2355.50, totalPrice: 2355.50, pricingSnapshot: null, sortOrder: 0 },
    ],
    createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-01-12'),
    deletedAt: null, createdBy: '00000000-0000-0000-0000-000000000000', updatedBy: null, deletedBy: null,
  },
  {
    id: 'orc-002-v2', companyId: COMPANY_ID, clientId: 'cliente-002',
    number: 'ORC-2026-0002', version: 2, status: 'SENT',
    title: 'Aplicação de Adesivo Vinílico — Loja Center',
    description: 'Aplicação de adesivo vinílico em vitrine',
    validUntil: new Date('2026-04-01'),
    subtotal: 4250.00, discount: 425.00, discountType: 'PERCENTAGE', total: 3825.00,
    notes: '', internalNotes: 'Cliente solicitou revisão de preços',
    items: [
      { id: 'orc-002-v2-item-1', quotationId: 'orc-002-v2', serviceId: 'svc-002', description: 'Aplicação de Adesivo Vinílico', quantity: 1, unit: 'UN', unitPrice: 4250.00, totalPrice: 4250.00, pricingSnapshot: null, sortOrder: 0 },
    ],
    createdAt: new Date('2026-02-05'), updatedAt: new Date('2026-02-10'),
    deletedAt: null, createdBy: '00000000-0000-0000-0000-000000000000', updatedBy: null, deletedBy: null,
  },
  {
    id: 'orc-002-v1', companyId: COMPANY_ID, clientId: 'cliente-002',
    number: 'ORC-2026-0002', version: 1, status: 'APPROVED',
    title: 'Aplicação de Adesivo Vinílico — Loja Center (v1)',
    description: 'Versão original',
    validUntil: new Date('2026-03-01'),
    subtotal: 4000.00, discount: 0, discountType: null, total: 4000.00,
    notes: '', internalNotes: '',
    items: [
      { id: 'orc-002-v1-item-1', quotationId: 'orc-002-v1', serviceId: 'svc-002', description: 'Aplicação de Adesivo Vinílico', quantity: 1, unit: 'UN', unitPrice: 4000.00, totalPrice: 4000.00, pricingSnapshot: null, sortOrder: 0 },
    ],
    createdAt: new Date('2026-02-05'), updatedAt: new Date('2026-02-05'),
    deletedAt: null, createdBy: '00000000-0000-0000-0000-000000000000', updatedBy: null, deletedBy: null,
  },
  {
    id: 'orc-003-v1', companyId: COMPANY_ID, clientId: null,
    number: 'ORC-2026-0003', version: 1, status: 'DRAFT',
    title: 'Impressão Digital em ACM — Construtora Nova',
    description: 'Impressão digital em chapas de ACM para fachada',
    validUntil: null,
    subtotal: 6450.00, discount: 0, discountType: null, total: 6450.00,
    notes: '', internalNotes: '',
    items: [
      { id: 'orc-003-v1-item-1', quotationId: 'orc-003-v1', serviceId: 'svc-003', description: 'Impressão Digital em ACM', quantity: 1, unit: 'UN', unitPrice: 6450.00, totalPrice: 6450.00, pricingSnapshot: null, sortOrder: 0 },
    ],
    createdAt: new Date('2026-03-01'), updatedAt: new Date('2026-03-01'),
    deletedAt: null, createdBy: '00000000-0000-0000-0000-000000000000', updatedBy: null, deletedBy: null,
  },
  {
    id: 'orc-004-v1', companyId: COMPANY_ID, clientId: 'cliente-003',
    number: 'ORC-2026-0004', version: 1, status: 'CANCELLED',
    title: 'Instalação de Adesivo — Farmácia Bem-Estar',
    description: 'Instalação de adesivo em fachada de farmácia',
    validUntil: new Date('2026-04-15'),
    subtotal: 2000.00, discount: 200.00, discountType: 'VALUE', total: 1800.00,
    notes: 'Cliente desistiu', internalNotes: '',
    items: [
      { id: 'orc-004-v1-item-1', quotationId: 'orc-004-v1', serviceId: 'svc-003', description: 'Adesivo Vinílico', quantity: 14, unit: 'M2', unitPrice: 70.00, totalPrice: 980.00, pricingSnapshot: null, sortOrder: 0 },
      { id: 'orc-004-v1-item-2', quotationId: 'orc-004-v1', serviceId: null, description: 'Mão de obra instalação', quantity: 12, unit: 'HORAS', unitPrice: 50.00, totalPrice: 600.00, pricingSnapshot: null, sortOrder: 1 },
      { id: 'orc-004-v1-item-3', quotationId: 'orc-004-v1', serviceId: 'eq-001', description: 'Impressão digital', quantity: 14, unit: 'M2', unitPrice: 21.43, totalPrice: 300.00, pricingSnapshot: null, sortOrder: 2 },
      { id: 'orc-004-v1-item-4', quotationId: 'orc-004-v1', serviceId: null, description: 'Frete entrega', quantity: 1, unit: 'UN', unitPrice: 120.00, totalPrice: 120.00, pricingSnapshot: null, sortOrder: 3 },
    ],
    createdAt: new Date('2026-03-15'), updatedAt: new Date('2026-03-18'),
    deletedAt: null, createdBy: '00000000-0000-0000-0000-000000000000', updatedBy: null, deletedBy: null,
  },
];

export class QuotationRepository extends BaseRepository<Quotation, Quotation, Partial<Quotation>> {
  async findAll(_params?: PaginationInput): Promise<Quotation[]> {
    const grouped = new Map<string, Quotation>();
    for (const q of mockQuotations) {
      if (q.companyId !== COMPANY_ID || q.deletedAt) continue;
      const existing = grouped.get(q.number);
      if (!existing || q.version > existing.version) {
        grouped.set(q.number, q);
      }
    }
    return [...grouped.values()].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findById(id: string): Promise<Quotation | null> {
    return mockQuotations.find((q) => q.id === id && !q.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Quotation>): Promise<Quotation[]> {
    return mockQuotations.filter((q) =>
      !q.deletedAt &&
      Object.entries(filter).every(([key, value]) => (q as Record<string, unknown>)[key] === value)
    );
  }

  async create(data: Quotation): Promise<Quotation> {
    mockQuotations.push(data);
    return data;
  }

  async update(id: string, data: Partial<Quotation>): Promise<Quotation> {
    const idx = mockQuotations.findIndex((q) => q.id === id);
    if (idx === -1) throw new Error('Quotation not found');
    mockQuotations[idx] = { ...mockQuotations[idx], ...data, updatedAt: new Date() };
    return mockQuotations[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockQuotations.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    mockQuotations[idx] = { ...mockQuotations[idx], deletedAt: new Date(), deletedBy: '' };
    return true;
  }

  async restore(id: string): Promise<Quotation> {
    const idx = mockQuotations.findIndex((q) => q.id === id);
    if (idx === -1) throw new Error('Quotation not found');
    mockQuotations[idx] = { ...mockQuotations[idx], deletedAt: null, deletedBy: null };
    return mockQuotations[idx];
  }

  async listVersions(number: string): Promise<Quotation[]> {
    return mockQuotations
      .filter((q) => q.number === number && !q.deletedAt)
      .sort((a, b) => a.version - b.version);
  }

  async getLatestByNumber(number: string): Promise<Quotation | null> {
    const versions = mockQuotations.filter((q) => q.number === number && !q.deletedAt);
    return versions.length > 0
      ? versions.reduce((a, b) => (a.version > b.version ? a : b))
      : null;
  }

  async getNextNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockQuotations
      .filter((q) => q.companyId === companyId && q.number.startsWith(`ORC-${year}`));
    const nums = existing.map((q) => {
      const parts = q.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `ORC-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async createVersion(id: string, data: Partial<Quotation>): Promise<Quotation> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Original quotation not found');

    const now = new Date();
    const newId = `${existing.number}-v${existing.version + 1}-${crypto.randomUUID().slice(0, 8)}`;

    const quotation: Quotation = {
      ...existing,
      id: newId,
      version: existing.version + 1,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      ...data,
      items: (data.items ?? existing.items).map((item, idx) => ({
        ...item,
        id: crypto.randomUUID(),
        quotationId: newId,
        sortOrder: item.sortOrder ?? idx,
      })),
    };

    mockQuotations.push(quotation);
    return quotation;
  }
}

export const quotationRepository = new QuotationRepository();
