export type UUID = string;

export type Timestamp = string;

export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState {
  status: ActionStatus;
  error: string | null;
}
