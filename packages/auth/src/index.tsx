'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserDTO, AuthTokens, LoginRequest } from '@visual-erp/types';
import { ApiClient } from '@visual-erp/api';

const STORAGE_KEY = 'visual_erp_auth';

interface StoredAuth {
  user: UserDTO;
  tokens: AuthTokens;
}

interface AuthContextType {
  user: UserDTO | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  api: ApiClient | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  api: null,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function createAuthProvider(baseUrl: string) {
  function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const getAccessToken = useCallback((): string | null => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        const auth: StoredAuth = JSON.parse(stored);
        return auth.tokens.accessToken;
      } catch {
        return null;
      }
    }, []);

    const handleUnauthorized = useCallback(() => {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      window.location.href = '/login';
    }, []);

    const [api] = useState(() => new ApiClient({
      baseUrl,
      getAccessToken,
      onUnauthorized: handleUnauthorized,
    }));

    useEffect(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const auth: StoredAuth = JSON.parse(stored);
          setUser(auth.user);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
      const response = await api.login(data);
      const auth: StoredAuth = { user: response.user, tokens: response.tokens };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      setUser(response.user);
    }, [api]);

    const logout = useCallback(() => {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }, []);

    return (
      <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, api }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return AuthProvider;
}

export function withAuth<P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return React.createElement('div', { className: 'flex items-center justify-center min-h-screen' },
        React.createElement('p', null, 'Carregando...')
      );
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return React.createElement(Component, props);
  };
}
