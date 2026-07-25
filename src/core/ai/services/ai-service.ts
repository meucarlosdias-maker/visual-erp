import type { AICompletionRequest, AICompletionResponse, AIMessage, AIProviderConfig } from '../types';
import { getAdapterForConfig } from '../providers';
import { addToShortMemory, getShortMemory } from '../memory';

export class AIService {
  async chat(
    provider: AIProviderConfig,
    messages: AIMessage[],
    sessionId?: string,
  ): Promise<AICompletionResponse> {
    const adapter = getAdapterForConfig(provider);

    if (sessionId) {
      for (const entry of getShortMemory(sessionId)) {
        const exists = messages.some(
          (m) => m.role === entry.role && m.content === entry.content,
        );
        if (!exists) {
          messages.unshift({ role: entry.role, content: entry.content });
        }
      }
    }

    const request: AICompletionRequest = {
      messages,
      provider,
    };

    const response = await adapter.complete(request);

    if (sessionId) {
      const userMsg = messages.find((m) => m.role === 'user');
      if (userMsg) {
        addToShortMemory(sessionId, { role: 'user', content: userMsg.content, timestamp: new Date() });
      }
      addToShortMemory(sessionId, { role: 'assistant', content: response.content, timestamp: new Date() });
    }

    return response;
  }

  async chatStream(
    provider: AIProviderConfig,
    messages: AIMessage[],
  ): Promise<AsyncIterable<string>> {
    const adapter = getAdapterForConfig(provider);
    const request: AICompletionRequest = { messages, provider, stream: true };
    return adapter.completeStream(request);
  }
}

export const aiService = new AIService();
