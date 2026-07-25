export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Visual ERP API',
    version: '1.0.0',
    description: 'API pública do Visual ERP para integração com sistemas externos',
  },
  servers: [
    { url: '/api/v1', description: 'API v1' },
  ],
  security: [
    { ApiKeyAuth: [] },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Chave de API gerada no painel de Integrações',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {},
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
            },
          },
          errors: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          document: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string' },
        },
      },
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          number: { type: 'string' },
          contactName: { type: 'string' },
          companyName: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          number: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Quote: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          number: { type: 'string' },
          clientId: { type: 'string', format: 'uuid' },
          status: { type: 'string' },
          total: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      WorkOrder: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          number: { type: 'string' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
    },
  },
  paths: {
    '/auth': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autenticar na API',
        description: 'Retorna as permissões da chave de API',
        security: [{ ApiKeyAuth: [] }],
        responses: {
          '200': { description: 'Autenticado com sucesso' },
          '401': { description: 'Não autorizado' },
        },
      },
    },
    '/clients': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de clientes' },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Criar cliente',
        responses: {
          '201': { description: 'Cliente criado' },
        },
      },
    },
    '/clients/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Obter cliente por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Cliente encontrado' }, '404': { description: 'Não encontrado' } },
      },
      put: {
        tags: ['Clientes'],
        summary: 'Atualizar cliente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Cliente atualizado' } },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Excluir cliente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Cliente excluído' } },
      },
    },
    '/users': {
      get: {
        tags: ['Usuários'],
        summary: 'Listar usuários',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Lista de usuários' } },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Usuários'],
        summary: 'Obter usuário por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Usuário encontrado' } },
      },
    },
    '/crm': {
      get: {
        tags: ['CRM'],
        summary: 'Listar leads',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de leads' } },
      },
    },
    '/crm/{id}': {
      get: {
        tags: ['CRM'],
        summary: 'Obter lead por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Lead encontrado' } },
      },
    },
    '/projects': {
      get: {
        tags: ['Projetos'],
        summary: 'Listar projetos',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de projetos' } },
      },
    },
    '/projects/{id}': {
      get: {
        tags: ['Projetos'],
        summary: 'Obter projeto por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Projeto encontrado' } },
      },
    },
    '/quotes': {
      get: {
        tags: ['Orçamentos'],
        summary: 'Listar orçamentos',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Lista de orçamentos' } },
      },
    },
    '/quotes/{id}': {
      get: {
        tags: ['Orçamentos'],
        summary: 'Obter orçamento por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Orçamento encontrado' } },
      },
    },
    '/work-orders': {
      get: {
        tags: ['Ordens de Serviço'],
        summary: 'Listar ordens de serviço',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Lista de OS' } },
      },
    },
    '/work-orders/{id}': {
      get: {
        tags: ['Ordens de Serviço'],
        summary: 'Obter OS por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OS encontrada' } },
      },
    },
    '/production': {
      get: {
        tags: ['Produção'],
        summary: 'Listar ordens de produção',
        responses: { '200': { description: 'Lista de ordens de produção' } },
      },
    },
    '/installations': {
      get: {
        tags: ['Instalações'],
        summary: 'Listar instalações',
        responses: { '200': { description: 'Lista de instalações' } },
      },
    },
    '/financial': {
      get: {
        tags: ['Financeiro'],
        summary: 'Listar registros financeiros',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['payable', 'receivable'] } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Lista de registros financeiros' } },
      },
    },
  },
};