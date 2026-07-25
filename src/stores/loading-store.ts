import { create } from 'zustand';

interface LoadingState {
  global: boolean;
  setGlobal: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  global: false,
  setGlobal: (loading) => set({ global: loading }),
}));
