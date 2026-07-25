import type { Company } from '../types';

let mockCompany: Company = {
  id: '00000000-0000-0000-0000-000000000000',
  isActive: true,

  razaoSocial: 'Visual ERP Software Ltda',
  nomeFantasia: 'Visual ERP',
  cnpj: '11.222.333/0001-81',
  inscricaoEstadual: '123.456.789.000',
  inscricaoMunicipal: '9.876.543',

  telefone: '(11) 3000-1234',
  celular: '(11) 99999-8888',
  email: 'contato@visualerp.com.br',
  site: 'https://visualerp.com.br',
  whatsapp: '(11) 99999-8888',

  cep: '01310-100',
  logradouro: 'Av. Paulista',
  numero: '1000',
  complemento: 'Sala 501',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  estado: 'SP',
  pais: 'Brasil',

  logoUrl: '',
  faviconUrl: '',
  corPrimaria: '#3b82f6',
  corSecundaria: '#1e40af',

  banco: '001',
  agencia: '1234-5',
  conta: '67890-1',
  pix: 'contato@visualerp.com.br',
  favorecido: 'Visual ERP Software Ltda',

  horarioInicio: '08:00',
  horarioFim: '18:00',
  trabalhaSabado: true,
  trabalhaDomingo: false,

  moeda: 'BRL',
  idioma: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  formatoData: 'DD/MM/YYYY',

  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  deletedBy: null,
};

class CompanyRepository {
  async get(): Promise<Company | null> {
    return mockCompany;
  }

  async create(data: Company): Promise<Company> {
    mockCompany = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return mockCompany;
  }

  async update(data: Company): Promise<Company> {
    const exists = await this.get();
    if (!exists) return this.create(data);
    mockCompany = { ...data, updatedAt: new Date() };
    return mockCompany;
  }
}

export const companyRepository = new CompanyRepository();
