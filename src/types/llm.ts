// types/llm.ts - LLM Service Types

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMChatRequest {
  messages: LLMMessage[];
  config?: {
    temperature?: number;
    maxTokens?: number;
    reasoningEffort?: 'low' | 'medium' | 'high';
  };
}

export interface LLMVideoPromptContext {
  videoDuration?: number;
  resolution?: string;
  style?: string;
}

export interface LLMVideoPromptRequest {
  prompt: string;
  context?: LLMVideoPromptContext;
}

export interface LLMVideoPromptResponse {
  prompt: string;
}

export interface LLMEnhanceRequest {
  prompt: string;
}

export interface LLMEnhanceResponse {
  enhancedPrompt: string;
  suggestions: string[];
  keywords: string[];
}

export interface LLMProviderInfo {
  provider: string;
  model: string;
  baseUrl: string;
  status: 'configured' | 'not_configured';
  message?: string;
}

export interface LLMUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_cache_hit_tokens?: number;
  prompt_cache_miss_tokens?: number;
}

export interface LLMChoice {
  index: number;
  message: {
    role: string;
    content: string;
    reasoning_content?: string;
  };
  finish_reason: string;
}

export interface LLMChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: LLMChoice[];
  usage: LLMUsage;
}
