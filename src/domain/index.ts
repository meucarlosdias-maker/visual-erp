export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Contact {
  email: string;
  phone: string;
  mobile?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface SortParams {
  field: string;
  desc: boolean;
}

export interface FilterParams {
  search?: string;
  status?: string;
  [key: string]: unknown;
}
