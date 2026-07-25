import type { CompanySettings, CompanyPreferences, CompanySequence } from '../types/company-settings';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

let mockSettings: CompanySettings = {
  id: COMPANY_ID,
  corporateName: 'Visual ERP Software Ltda',
  tradeName: 'Visual ERP',
  document: '11.222.333/0001-81',
  stateRegistration: '123.456.789.000',
  municipalRegistration: '9.876.543',
  phone: '(11) 3000-1234',
  whatsapp: '(11) 99999-8888',
  email: 'contato@visualerp.com.br',
  website: 'https://visualerp.com.br',
  logo: '', favicon: '',
  primaryColor: '#3b82f6', secondaryColor: '#1e40af',
  address: 'Av. Paulista', number: '1000', district: 'Bela Vista',
  city: 'São Paulo', state: 'SP', zipCode: '01310-100', country: 'Brasil',
  timezone: 'America/Sao_Paulo', currency: 'BRL', language: 'pt-BR',
  decimalPlaces: 2, measurementUnit: 'm²', defaultMargin: 30,
  workingHoursStart: '08:00', workingHoursEnd: '18:00',
  workingDays: [1, 2, 3, 4, 5],
  active: true,
  createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
  createdBy: null, updatedBy: null, deletedBy: null,
};

let mockPreferences: CompanyPreferences = {
  id: 'pref-001', companyId: COMPANY_ID,
  defaultQuotationValidity: 30, defaultPaymentTerm: '30 dias',
  defaultProjectPrefix: 'PROJ', defaultQuotationPrefix: 'ORC',
  defaultWorkOrderPrefix: 'OS', defaultInvoicePrefix: 'NF',
  defaultClientCodePrefix: 'CLI', defaultSupplierCodePrefix: 'FOR',
  defaultProductCodePrefix: 'PROD', defaultServiceCodePrefix: 'SERV',
  allowNegativeStock: false, automaticProjectCreation: false,
  automaticWorkOrderCreation: false, automaticProductionRelease: false,
  automaticFinancialGeneration: false,
  createdAt: new Date(), updatedAt: new Date(),
};

const mockSequences: CompanySequence[] = [
  { id: 'seq-001', companyId: COMPANY_ID, entity: 'project', currentNumber: 5, prefix: 'PROJ', suffix: '', padding: 4 },
  { id: 'seq-002', companyId: COMPANY_ID, entity: 'quotation', currentNumber: 12, prefix: 'ORC', suffix: '', padding: 4 },
  { id: 'seq-003', companyId: COMPANY_ID, entity: 'work_order', currentNumber: 3, prefix: 'OS', suffix: new Date().getFullYear().toString(), padding: 4 },
  { id: 'seq-004', companyId: COMPANY_ID, entity: 'invoice', currentNumber: 0, prefix: 'NF', suffix: '', padding: 5 },
  { id: 'seq-005', companyId: COMPANY_ID, entity: 'client', currentNumber: 8, prefix: 'CLI', suffix: '', padding: 4 },
  { id: 'seq-006', companyId: COMPANY_ID, entity: 'supplier', currentNumber: 3, prefix: 'FOR', suffix: '', padding: 4 },
  { id: 'seq-007', companyId: COMPANY_ID, entity: 'product', currentNumber: 15, prefix: 'PROD', suffix: '', padding: 4 },
  { id: 'seq-008', companyId: COMPANY_ID, entity: 'service', currentNumber: 10, prefix: 'SERV', suffix: '', padding: 4 },
];

export class CompanySettingsRepository {
  async get(): Promise<CompanySettings | null> {
    return mockSettings;
  }

  async update(data: CompanySettings): Promise<CompanySettings> {
    mockSettings = { ...data, updatedAt: new Date() };
    return mockSettings;
  }

  async getPreferences(): Promise<CompanyPreferences | null> {
    return mockPreferences;
  }

  async updatePreferences(data: CompanyPreferences): Promise<CompanyPreferences> {
    mockPreferences = { ...data, updatedAt: new Date() };
    return mockPreferences;
  }

  async listSequences(): Promise<CompanySequence[]> {
    return [...mockSequences];
  }

  async getSequenceByEntity(entity: string): Promise<CompanySequence | null> {
    return mockSequences.find((s) => s.entity === entity) ?? null;
  }

  async updateSequence(id: string, data: Partial<CompanySequence>): Promise<CompanySequence> {
    const idx = mockSequences.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Sequência não encontrada');
    mockSequences[idx] = { ...mockSequences[idx], ...data };
    return mockSequences[idx];
  }

  async getNextNumber(entity: string): Promise<string> {
    const seq = mockSequences.find((s) => s.entity === entity);
    if (!seq) throw new Error(`Sequência para ${entity} não configurada`);
    seq.currentNumber += 1;
    const num = seq.currentNumber.toString().padStart(seq.padding, '0');
    return `${seq.prefix}${num}${seq.suffix ? '-' + seq.suffix : ''}`;
  }
}

export const companySettingsRepository = new CompanySettingsRepository();
