import { CompanyRole, PlatformRole } from './enums';

export const CompanyRoleLabels: Record<CompanyRole, string> = {
  [CompanyRole.ADMIN]: 'Administrador',
  [CompanyRole.MANAGER]: 'Gerente',
  [CompanyRole.SALES]: 'Comercial',
  [CompanyRole.DESIGNER]: 'Designer',
  [CompanyRole.PRODUCTION]: 'Produção',
  [CompanyRole.INSTALLER]: 'Instalador',
  [CompanyRole.FINANCE]: 'Financeiro',
  [CompanyRole.VIEWER]: 'Visualizador',
};

export const CompanyRoleDescriptions: Record<CompanyRole, string> = {
  [CompanyRole.ADMIN]: 'Acesso administrativo completo na empresa',
  [CompanyRole.MANAGER]: 'Gerencia projetos, equipe e operações',
  [CompanyRole.SALES]: 'Acesso ao CRM, orçamentos e vendas',
  [CompanyRole.DESIGNER]: 'Acesso a projetos e materiais de produção',
  [CompanyRole.PRODUCTION]: 'Acesso à produção, OS e instalações',
  [CompanyRole.INSTALLER]: 'Acesso a ordens de serviço e instalações',
  [CompanyRole.FINANCE]: 'Acesso ao financeiro e relatórios',
  [CompanyRole.VIEWER]: 'Acesso apenas para leitura',
};

export const CompanyRoleHierarchy: Record<CompanyRole, number> = {
  [CompanyRole.ADMIN]: 80,
  [CompanyRole.MANAGER]: 70,
  [CompanyRole.SALES]: 60,
  [CompanyRole.DESIGNER]: 55,
  [CompanyRole.PRODUCTION]: 50,
  [CompanyRole.INSTALLER]: 40,
  [CompanyRole.FINANCE]: 45,
  [CompanyRole.VIEWER]: 20,
};

export const PlatformRoleLabels: Record<PlatformRole, string> = {
  [PlatformRole.SUPER_ADMIN]: 'Super Administrador',
  [PlatformRole.DEVELOPER]: 'Desenvolvedor',
  [PlatformRole.SUPPORT]: 'Suporte',
  [PlatformRole.FINANCE]: 'Financeiro',
  [PlatformRole.COMMERCIAL]: 'Comercial',
};

export const PlatformRoleDescriptions: Record<PlatformRole, string> = {
  [PlatformRole.SUPER_ADMIN]: 'Acesso total à plataforma',
  [PlatformRole.DEVELOPER]: 'Acesso técnico e de desenvolvimento',
  [PlatformRole.SUPPORT]: 'Suporte a empresas e usuários',
  [PlatformRole.FINANCE]: 'Gestão de planos, assinaturas e billing',
  [PlatformRole.COMMERCIAL]: 'Gestão de leads, trials e vendas da plataforma',
};

export const PlatformRoleHierarchy: Record<PlatformRole, number> = {
  [PlatformRole.SUPER_ADMIN]: 100,
  [PlatformRole.DEVELOPER]: 80,
  [PlatformRole.SUPPORT]: 60,
  [PlatformRole.FINANCE]: 70,
  [PlatformRole.COMMERCIAL]: 50,
};
