export interface SdkConfig {
  baseUrl: string;
  apiKey: string;
  secret: string;
}

export interface SdkResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  errors?: Record<string, string>;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Lead {
  id: string;
  number: string;
  contactName: string;
  companyName: string;
  status: string;
}

export interface Project {
  id: string;
  number: string;
  name: string;
  status: string;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  status: string;
}

export interface WorkOrder {
  id: string;
  number: string;
  status: string;
}

export interface ProductionOrder {
  id: string;
  number: string;
  status: string;
}

export interface Installation {
  id: string;
  number: string;
  status: string;
}

export interface FinancialRecord {
  id: string;
  type: 'payable' | 'receivable';
  amount: number;
  status: string;
}