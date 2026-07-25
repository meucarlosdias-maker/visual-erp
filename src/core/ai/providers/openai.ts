import type { AIProviderAdapter, AICompletionRequest, AICompletionResponse } from '../types';

export class OpenAIAdapter implements AIProviderAdapter {
  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const start = performance.now();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.provider.apiKey}`,
      },
      body: JSON.stringify({
        model: request.provider.model,
        messages: request.messages,
        temperature: request.provider.temperature,
        max_tokens: request.provider.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
      usage: { prompt_tokens: number; completion_tokens: number };
      model: string;
    };

    return {
      content: data.choices[0]?.message?.content ?? '',
      tokensInput: data.usage?.prompt_tokens ?? 0,
      tokensOutput: data.usage?.completion_tokens ?? 0,
      model: data.model,
      duration: Math.round(performance.now() - start),
    };
  }

  async *completeStream(request: AICompletionRequest): AsyncIterable<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.provider.apiKey}`,
      },
      body: JSON.stringify({
        model: request.provider.model,
        messages: request.messages,
        temperature: request.provider.temperature,
        max_tokens: request.provider.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data) as { choices: { delta: { content?: string } }[] };
          const content = parsed.choices[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // skip parse errors
        }
      }
    }
  }
}
