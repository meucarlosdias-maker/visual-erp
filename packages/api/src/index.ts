import type { LoginRequest, LoginResponse, ProjectDTO, QuotationDTO, FinancialEntryDTO, WorkOrderDTO, AgendaEventDTO, InstallationDTO, ProductionOrderDTO, ProfileUpdateRequest, PaginatedResponse, FileUploadResponse, UserDTO } from '@visual-erp/types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiClientConfig {
  baseUrl: string;
  getAccessToken: () => string | null;
  onUnauthorized?: () => void;
}

export class ApiClient {
  private baseUrl: string;
  private getAccessToken: () => string | null;
  private onUnauthorized?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getAccessToken = config.getAccessToken;
    this.onUnauthorized = config.onUnauthorized;
  }

  private async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const token = this.getAccessToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      this.onUnauthorized?.();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async requestFormData<T>(method: HttpMethod, path: string, formData: FormData): Promise<T> {
    const token = this.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: formData,
    });

    if (response.status === 401) {
      this.onUnauthorized?.();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message ?? `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(path: string): Promise<T> { return this.request<T>('GET', path); }
  post<T>(path: string, body?: unknown): Promise<T> { return this.request<T>('POST', path, body); }
  put<T>(path: string, body?: unknown): Promise<T> { return this.request<T>('PUT', path, body); }
  patch<T>(path: string, body?: unknown): Promise<T> { return this.request<T>('PATCH', path, body); }
  delete<T>(path: string): Promise<T> { return this.request<T>('DELETE', path); }
  upload<T>(path: string, formData: FormData): Promise<T> { return this.requestFormData<T>('POST', path, formData); }

  // Auth
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/v1/auth', data);
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/v1/auth/refresh', { refreshToken });
  }

  async getProfile(): Promise<UserDTO> {
    return this.get<UserDTO>('/api/v1/auth/me');
  }

  // Projects
  async listProjects(page = 1, pageSize = 20): Promise<PaginatedResponse<ProjectDTO>> {
    return this.get<PaginatedResponse<ProjectDTO>>(`/api/v1/projects?page=${page}&pageSize=${pageSize}`);
  }

  async getProject(id: string): Promise<ProjectDTO> {
    return this.get<ProjectDTO>(`/api/v1/projects/${id}`);
  }

  // Quotations
  async listQuotations(page = 1, pageSize = 20): Promise<PaginatedResponse<QuotationDTO>> {
    return this.get<PaginatedResponse<QuotationDTO>>(`/api/v1/quotes?page=${page}&pageSize=${pageSize}`);
  }

  async getQuotation(id: string): Promise<QuotationDTO> {
    return this.get<QuotationDTO>(`/api/v1/quotes/${id}`);
  }

  // Financial
  async listFinancialEntries(type?: string, page = 1, pageSize = 20): Promise<PaginatedResponse<FinancialEntryDTO>> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (type) params.set('type', type);
    return this.get<PaginatedResponse<FinancialEntryDTO>>(`/api/v1/financial?${params}`);
  }

  // Work Orders
  async listWorkOrders(page = 1, pageSize = 20): Promise<PaginatedResponse<WorkOrderDTO>> {
    return this.get<PaginatedResponse<WorkOrderDTO>>(`/api/v1/work-orders?page=${page}&pageSize=${pageSize}`);
  }

  async getWorkOrder(id: string): Promise<WorkOrderDTO> {
    return this.get<WorkOrderDTO>(`/api/v1/work-orders/${id}`);
  }

  // Agenda
  async listAgendaEvents(startDate?: string, endDate?: string): Promise<AgendaEventDTO[]> {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const query = params.toString();
    return this.get<AgendaEventDTO[]>(`/api/v1/crm/agenda${query ? `?${query}` : ''}`);
  }

  // Installations
  async listInstallations(page = 1, pageSize = 20): Promise<PaginatedResponse<InstallationDTO>> {
    return this.get<PaginatedResponse<InstallationDTO>>(`/api/v1/installations?page=${page}&pageSize=${pageSize}`);
  }

  // Production
  async listProductionOrders(page = 1, pageSize = 20): Promise<PaginatedResponse<ProductionOrderDTO>> {
    return this.get<PaginatedResponse<ProductionOrderDTO>>(`/api/v1/production?page=${page}&pageSize=${pageSize}`);
  }

  // Profile
  async updateProfile(data: ProfileUpdateRequest): Promise<UserDTO> {
    return this.patch<UserDTO>('/api/v1/auth/me', data);
  }

  // Upload
  async uploadFile(file: File, documentType: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    return this.upload<FileUploadResponse>('/api/v1/upload', formData);
  }
}
