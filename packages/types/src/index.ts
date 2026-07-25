export type UserRole = 'client' | 'employee' | 'admin';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  companyId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserDTO;
  tokens: AuthTokens;
}

export interface ProjectDTO {
  id: string;
  number: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  clientId: string;
  expectedStartDate: string | null;
  expectedEndDate: string | null;
  createdAt: string;
}

export interface QuotationDTO {
  id: string;
  number: string;
  title: string;
  status: string;
  total: number;
  validUntil: string | null;
  createdAt: string;
}

export interface FinancialEntryDTO {
  id: string;
  description: string;
  type: 'receber' | 'pagar';
  value: number;
  dueDate: string;
  status: string;
  category: string;
  createdAt: string;
}

export interface WorkOrderDTO {
  id: string;
  number: string;
  title: string;
  status: string;
  priority: string;
  projectId: string;
  assignedTeamId: string | null;
  expectedStartDate: string | null;
  expectedEndDate: string | null;
  createdAt: string;
}

export interface AgendaEventDTO {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  location: string | null;
}

export interface InstallationDTO {
  id: string;
  projectId: string;
  address: string;
  scheduledDate: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface ProductionOrderDTO {
  id: string;
  number: string;
  title: string;
  status: string;
  departmentId: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  phone?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export type ProjectStatus = 'WAITING' | 'PLANNING' | 'IN_PRODUCTION' | 'WAITING_INSTALLATION' | 'INSTALLING' | 'FINISHED' | 'DELIVERED' | 'CANCELLED';

export type QuotationStatus = 'DRAFT' | 'PENDING' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export type DocumentType = 'photo' | 'document' | 'signature' | 'receipt';

export interface FileUploadResponse {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PortalConfig {
  appName: string;
  appLogo: string | null;
  primaryColor: string;
  companyName: string;
}
