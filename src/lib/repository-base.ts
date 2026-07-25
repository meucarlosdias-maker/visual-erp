export interface PaginationInput {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RepositoryBase<T, TCreate, TUpdate> {
  findAll(params?: PaginationInput): Promise<T[] | PaginatedResult<T>>;
  findById(id: string): Promise<T | null>;
  findMany(filter: Partial<T>): Promise<T[]>;
  create(input: TCreate): Promise<T>;
  update(id: string, input: TUpdate): Promise<T>;
  delete(id: string): Promise<boolean>;
  restore(id: string): Promise<T>;
}

export abstract class BaseRepository<T, TCreate, TUpdate> implements RepositoryBase<T, TCreate, TUpdate> {
  abstract findAll(params?: PaginationInput): Promise<T[] | PaginatedResult<T>>;
  abstract findById(id: string): Promise<T | null>;
  abstract findMany(filter: Partial<T>): Promise<T[]>;
  abstract create(input: TCreate): Promise<T>;
  abstract update(id: string, input: TUpdate): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
  abstract restore(id: string): Promise<T>;
}
