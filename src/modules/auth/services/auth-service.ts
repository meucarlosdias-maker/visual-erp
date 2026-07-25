import { authRepository } from '../repository';
import type { AuthUser } from '../types';

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    return authRepository.getCurrentUser();
  },

  async login(email: string, password: string) {
    const { error } = await authRepository.signIn(email, password);
    if (error) throw new Error(error.message);
  },

  async logout() {
    await authRepository.signOut();
  },

  async requestPasswordReset(email: string) {
    const { error } = await authRepository.resetPassword(email);
    if (error) throw new Error(error.message);
  },
};