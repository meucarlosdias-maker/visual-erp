export interface AiProvider {
  id: string;
  companyId: string;
  name: string;
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface AiPrompt {
  id: string;
  companyId: string;
  name: string;
  module: string;
  version: number;
  prompt: string;
  systemPrompt: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface AiConversation {
  id: string;
  companyId: string;
  userId: string | null;
  title: string;
  module: string | null;
  messages: AiMessage[];
  executions: AiExecution[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  tokens: number | null;
  createdAt: Date;
}

export interface AiExecution {
  id: string;
  conversationId: string | null;
  provider: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  cost: number;
  duration: number;
  status: string;
  createdAt: Date;
}
