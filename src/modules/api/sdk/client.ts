import type { SdkConfig, SdkResponse, Client, User, Lead, Project, Quote, WorkOrder, ProductionOrder, Installation, FinancialRecord } from './types';
import { createAuthHeaders } from './auth';
import { buildQueryString } from './helpers';

export class VisualErpClient {
  private config: SdkConfig;

  constructor(config: SdkConfig) {
    this.config = config;
  }

  private async request<T>(method: string, path: string, body?: Record<string, unknown>): Promise<SdkResponse<T>> {
    const url = `${this.config.baseUrl}/api/v1${path}`;
    const bodyStr = body ? JSON.stringify(body) : '';
    const headers = createAuthHeaders(this.config, bodyStr);

    const response = await fetch(url, {
      method,
      headers,
      body: body ? bodyStr : undefined,
    });

    return response.json();
  }

  async listClients(params?: { page?: number; limit?: number }) {
    return this.request<Client[]>('GET', `/clients${buildQueryString(params ?? {})}`);
  }

  async getClient(id: string) {
    return this.request<Client>('GET', `/clients/${id}`);
  }

  async createClient(data: Partial<Client>) {
    return this.request<Client>('POST', '/clients', data);
  }

  async updateClient(id: string, data: Partial<Client>) {
    return this.request<Client>('PUT', `/clients/${id}`, data);
  }

  async deleteClient(id: string) {
    return this.request<void>('DELETE', `/clients/${id}`);
  }

  async listUsers(params?: { page?: number; limit?: number }) {
    return this.request<User[]>('GET', `/users${buildQueryString(params ?? {})}`);
  }

  async getUser(id: string) {
    return this.request<User>('GET', `/users/${id}`);
  }

  async listLeads(params?: { page?: number; limit?: number }) {
    return this.request<Lead[]>('GET', `/crm${buildQueryString(params ?? {})}`);
  }

  async getLead(id: string) {
    return this.request<Lead>('GET', `/crm/${id}`);
  }

  async listProjects(params?: { page?: number; limit?: number; status?: string }) {
    return this.request<Project[]>('GET', `/projects${buildQueryString(params ?? {})}`);
  }

  async getProject(id: string) {
    return this.request<Project>('GET', `/projects/${id}`);
  }

  async listQuotes(params?: { page?: number; limit?: number }) {
    return this.request<Quote[]>('GET', `/quotes${buildQueryString(params ?? {})}`);
  }

  async getQuote(id: string) {
    return this.request<Quote>('GET', `/quotes/${id}`);
  }

  async listWorkOrders(params?: { page?: number; limit?: number }) {
    return this.request<WorkOrder[]>('GET', `/work-orders${buildQueryString(params ?? {})}`);
  }

  async getWorkOrder(id: string) {
    return this.request<WorkOrder>('GET', `/work-orders/${id}`);
  }

  async listProductionOrders(params?: { page?: number; limit?: number }) {
    return this.request<ProductionOrder[]>('GET', `/production${buildQueryString(params ?? {})}`);
  }

  async listInstallations(params?: { page?: number; limit?: number }) {
    return this.request<Installation[]>('GET', `/installations${buildQueryString(params ?? {})}`);
  }

  async listFinancialRecords(params?: { page?: number; limit?: number; type?: string }) {
    return this.request<FinancialRecord[]>('GET', `/financial${buildQueryString(params ?? {})}`);
  }
}