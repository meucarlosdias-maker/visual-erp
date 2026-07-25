export type AIProviderType = 'openai' | 'anthropic' | 'gemini' | 'azure' | 'openrouter';

export interface AIProviderConfig {
  id: string;
  name: string;
  provider: AIProviderType;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  provider: AIProviderConfig;
  stream?: boolean;
}

export interface AICompletionResponse {
  content: string;
  tokensInput: number;
  tokensOutput: number;
  model: string;
  duration: number;
}

export interface AIProviderAdapter {
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
  completeStream(request: AICompletionRequest): AsyncIterable<string>;
}

export interface AIPromptDefinition {
  id: string;
  name: string;
  module: string;
  version: number;
  prompt: string;
  systemPrompt: string | null;
  active: boolean;
}

export type AgentType =
  | 'commercial' | 'financial' | 'production'
  | 'project' | 'support' | 'executive';

export interface AgentDefinition {
  type: AgentType;
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[];
}

export type AIToolType =
  | 'search_clients' | 'search_projects' | 'search_financial'
  | 'search_crm' | 'search_workorders'
  | 'generate_report' | 'generate_summary' | 'generate_email';

export interface AIToolDefinition {
  type: AIToolType;
  name: string;
  description: string;
  parameters: AIToolParameter[];
}

export interface AIToolParameter {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
}

export interface ShortMemoryEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LongMemoryEntry {
  id: string;
  key: string;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface EmbeddingResult {
  vector: number[];
  model: string;
  dimension: number;
}

export interface KnowledgeBaseEntry {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
}
