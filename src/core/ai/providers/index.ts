import type { AIProviderAdapter, AIProviderConfig, AIProviderType } from '../types';
import { OpenAIAdapter } from './openai';
import { MockAIAdapter } from './mock';

const adapters: Record<string, AIProviderAdapter> = {
  mock: new MockAIAdapter(),
  openai: new OpenAIAdapter(),
};

export function getProviderAdapter(provider: AIProviderType): AIProviderAdapter {
  if (provider === 'openai') return adapters.openai;
  return adapters.mock;
}

export function getAdapterForConfig(config: AIProviderConfig): AIProviderAdapter {
  return getProviderAdapter(config.provider);
}

export { MockAIAdapter, OpenAIAdapter };
