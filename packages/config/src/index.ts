export const baseNextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const portalClientConfig = {
  appName: 'Portal do Cliente',
  description: 'Acompanhe seus projetos, orçamentos e financeiro',
};

export const portalEmployeeConfig = {
  appName: 'Portal do Colaborador',
  description: 'Gerencie suas atividades, agenda e produção',
};
