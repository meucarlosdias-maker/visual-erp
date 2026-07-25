export interface AuthResponse {
  error?: string;
  success?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  type?: 'platform' | 'company';
}
