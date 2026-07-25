import type { AIProviderAdapter, AICompletionRequest, AICompletionResponse } from '../types';

const mockResponses: Record<string, string> = {
  default: 'Esta é uma resposta simulada do assistente Visual AI. Em produção, esta resposta seria gerada por um provedor de IA configurado.',
  greeting: 'Olá! Sou o assistente do Visual ERP. Como posso ajudar?',
};

export class MockAIAdapter implements AIProviderAdapter {
  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 300));

    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === 'user');
    const userContent = lastUserMessage?.content ?? '';

    let content = mockResponses.default;
    if (userContent.toLowerCase().includes('olá') || userContent.toLowerCase().includes('oi')) {
      content = mockResponses.greeting;
    } else if (userContent.toLowerCase().includes('cliente') || userContent.toLowerCase().includes('lead')) {
      content = 'Simulei a busca por clientes. Encontrei registros relacionados na base de dados.';
    } else if (userContent.toLowerCase().includes('financeiro') || userContent.toLowerCase().includes('fatura')) {
      content = 'Simulei a consulta financeira. Os dados estão disponíveis no módulo Financeiro.';
    } else if (userContent.toLowerCase().includes('produção') || userContent.toLowerCase().includes('produção')) {
      content = 'Simulei a verificação de produção. Consulte o painel de produção para detalhes.';
    }

    return {
      content,
      tokensInput: 50,
      tokensOutput: 30,
      model: request.provider.model,
      duration: Math.round(performance.now() - start),
    };
  }

  async *completeStream(request: AICompletionRequest): AsyncIterable<string> {
    const result = await this.complete(request);
    for (const char of result.content) {
      yield char;
      await new Promise((r) => setTimeout(r, 10));
    }
  }
}
