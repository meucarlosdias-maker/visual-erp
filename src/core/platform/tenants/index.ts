import type { CompanyDefinition } from '../types';

const companies: CompanyDefinition[] = [
  { id: 'comp-001', name: 'Empresa ABC Ltda', slug: 'empresa-abc', document: '11.222.333/0001-44', email: 'admin@abc.com', phone: '(11) 99999-0001', status: 'active', planId: 'plan-002', usersCount: 15, projectsCount: 23, storageUsed: 2048, createdAt: new Date('2025-06-01'), updatedAt: new Date('2026-07-20') },
  { id: 'comp-002', name: 'Tech Solutions SA', slug: 'tech-solutions', document: '22.333.444/0001-55', email: 'contato@techsol.com', phone: '(21) 98888-0002', status: 'active', planId: 'plan-003', usersCount: 45, projectsCount: 67, storageUsed: 5120, createdAt: new Date('2025-03-15'), updatedAt: new Date('2026-07-19') },
  { id: 'comp-003', name: 'Comercial XYZ', slug: 'comercial-xyz', document: '33.444.555/0001-66', email: 'admin@xyz.com', phone: '(31) 97777-0003', status: 'trial', planId: 'plan-001', usersCount: 3, projectsCount: 5, storageUsed: 128, createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-20') },
  { id: 'comp-004', name: 'Construtora Nova Era', slug: 'nova-era', document: '44.555.666/0001-77', email: 'adm@novaera.com', phone: '(41) 96666-0004', status: 'blocked', planId: 'plan-001', usersCount: 8, projectsCount: 12, storageUsed: 512, createdAt: new Date('2025-11-01'), updatedAt: new Date('2026-07-15') },
  { id: 'comp-005', name: 'Serviços Gerais Ltda', slug: 'servicos-gerais', document: '55.666.777/0001-88', email: 'contato@servicosgerais.com', phone: '(51) 95555-0005', status: 'active', planId: 'plan-002', usersCount: 12, projectsCount: 20, storageUsed: 1024, createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-07-18') },
];

export function listCompanies(): CompanyDefinition[] { return [...companies]; }
export function getCompany(id: string): CompanyDefinition | undefined { return companies.find((c) => c.id === id); }
export function createCompany(input: Omit<CompanyDefinition, 'id' | 'createdAt' | 'updatedAt'>): CompanyDefinition {
  const company: CompanyDefinition = { ...input, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
  companies.push(company); return company;
}
export function updateCompany(id: string, updates: Partial<Omit<CompanyDefinition, 'id' | 'createdAt'>>): CompanyDefinition | undefined {
  const idx = companies.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  companies[idx] = { ...companies[idx], ...updates, updatedAt: new Date() };
  return companies[idx];
}
export function blockCompany(id: string): CompanyDefinition | undefined {
  return updateCompany(id, { status: 'blocked' });
}
export function unblockCompany(id: string): CompanyDefinition | undefined {
  return updateCompany(id, { status: 'active' });
}
export function getActiveCount(): number { return companies.filter((c) => c.status === 'active').length; }
export function getBlockedCount(): number { return companies.filter((c) => c.status === 'blocked' || c.status === 'suspended').length; }
