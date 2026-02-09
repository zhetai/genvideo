// utils/llmClient.ts - LLM API Client

import type {
  LLMChatRequest,
  LLMChatResponse,
  LLMVideoPromptRequest,
  LLMVideoPromptResponse,
  LLMEnhanceRequest,
  LLMEnhanceResponse,
  LLMProviderInfo,
} from '../types/llm';

const API_BASE_URL = '/api';

export class LLMClient {
  /**
   * DeepSeek Chat Completion
   */
  static async chat(request: LLMChatRequest): Promise<LLMChatResponse> {
    const response = await fetch(`${API_BASE_URL}/llm/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to complete chat request');
    }

    return response.json();
  }

  /**
   * Generate Video Prompt using DeepSeek
   */
  static async generateVideoPrompt(request: LLMVideoPromptRequest): Promise<LLMVideoPromptResponse> {
    const response = await fetch(`${API_BASE_URL}/llm/VideoPrompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate video prompt');
    }

    return response.json();
  }

  /**
   * Enhance Prompt
   */
  static async enhancePrompt(request: LLMEnhanceRequest): Promise<LLMEnhanceResponse> {
    const response = await fetch(`${API_BASE_URL}/llm/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to enhance prompt');
    }

    return response.json();
  }

  /**
   * Get LLM Provider Information
   */
  static async getProviderInfo(): Promise<LLMProviderInfo> {
    const response = await fetch(`${API_BASE_URL}/llm/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get provider info');
    }

    return response.json();
  }

  /**
   * Simple chat helper function
   */
  static async simpleChat(message: string, systemPrompt?: string): Promise<string> {
    const messages = systemPrompt
      ? [
          { role: 'system' as const, content: systemPrompt },
          { role: 'user' as const, content: message },
        ]
      : [{ role: 'user' as const, content: message }];

    const response = await this.chat({ messages });
    return response.choices[0]?.message?.content || '';
  }
}

export default LLMClient;
