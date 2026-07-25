export const systemConfig = {
  appName: 'Visual ERP',
  appDescription: 'Plataforma SaaS para empresas de Comunicação Visual',
  version: '1.0.0',
  defaultLocale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedImageTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  defaults: {
    companyId: '00000000-0000-0000-0000-000000000000',
    userId: '00000000-0000-0000-0000-000000000001',
  },
} as const;
