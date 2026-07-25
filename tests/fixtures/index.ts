export const mockUser = {
  id: 'user-001',
  name: 'João Silva',
  email: 'joao@example.com',
  roleId: 'role-001',
  companyId: 'company-001',
};

export const mockClient = {
  id: 'client-001',
  name: 'Empresa ABC Ltda',
  document: '11222333444455',
  email: 'contato@abc.com',
  phone: '(11) 99999-8888',
  companyId: 'company-001',
};

export const mockLead = {
  id: 'lead-001',
  name: 'Maria Souza',
  email: 'maria@example.com',
  phone: '(11) 97777-6666',
  companyId: 'company-001',
};

export const mockQuotation = {
  id: 'quotation-001',
  clientId: 'client-001',
  total: 15000.00,
  status: 'DRAFT',
  companyId: 'company-001',
};

export const mockProject = {
  id: 'project-001',
  name: 'Fachada Shopping Center',
  clientId: 'client-001',
  status: 'PLANNING',
  companyId: 'company-001',
};

export const mockWorkOrder = {
  id: 'work-order-001',
  projectId: 'project-001',
  status: 'OPEN',
  companyId: 'company-001',
};
