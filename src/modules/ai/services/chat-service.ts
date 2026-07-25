import { conversationRepository } from '../repository/conversation-repository';
import { aiExecutionRepository } from '../repository/execution-repository';
import { aiService } from '@/core/ai';
import type { AIMessage } from '@/core/ai';
import type { AiConversation, AiMessage } from '../types';
import type { AIProviderConfig } from '@/core/ai';

export class ChatService {
  async createConversation(title: string, module?: string): Promise<AiConversation> {
    return conversationRepository.create({ title, module: module ?? null, userId: null });
  }

  async getConversation(id: string): Promise<AiConversation | null> {
    return conversationRepository.findById(id);
  }

  async listConversations(): Promise<AiConversation[]> {
    return conversationRepository.findAll();
  }

  async deleteConversation(id: string): Promise<boolean> {
    return conversationRepository.delete(id);
  }

  async sendMessage(
    conversationId: string,
    content: string,
    providerConfig: AIProviderConfig,
    systemPrompt?: string,
  ): Promise<{ reply: string; message: AiMessage }> {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) throw new Error('Conversa não encontrada');

    const userMsg = await conversationRepository.addMessage(conversationId, {
      conversationId,
      role: 'user',
      content,
      tokens: null,
      createdAt: new Date(),
    });

    const messages: AIMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    for (const msg of conversation.messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role as 'user' | 'assistant', content: msg.content });
      }
    }
    messages.push({ role: 'user', content });

    const response = await aiService.chat(providerConfig, messages);

    const assistantMsg = await conversationRepository.addMessage(conversationId, {
      conversationId,
      role: 'assistant',
      content: response.content,
      tokens: response.tokensOutput,
      createdAt: new Date(),
    });

    await aiExecutionRepository.create({
      conversationId,
      provider: providerConfig.provider,
      model: response.model,
      tokensInput: response.tokensInput,
      tokensOutput: response.tokensOutput,
      cost: 0,
      duration: response.duration,
      status: 'completed',
    });

    return { reply: response.content, message: assistantMsg };
  }

  async sendStreamMessage(
    _conversationId: string,
    _content: string,
    _providerConfig: AIProviderConfig,
  ): Promise<AsyncIterable<string>> {
    return aiService.chatStream(_providerConfig, [{ role: 'user', content: _content }]);
  }
}

export const chatService = new ChatService();
