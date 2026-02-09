// deepseekService.ts - DeepSeek API Service

import type { DeepSeekConfig, LLMProvider } from './llmConfig';
import { LLMProvider as ProviderEnum, validateLLMConfig } from './llmConfig';

/**
 * DeepSeek Message Types
 */
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * DeepSeek API Request
 */
export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  reasoning_effort?: 'low' | 'medium' | 'high';
}

/**
 * DeepSeek API Response
 */
export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_cache_hit_tokens?: number;
    prompt_cache_miss_tokens?: number;
  };
}

/**
 * DeepSeek Service Class
 */
export class DeepSeekService {
  private config: DeepSeekConfig;

  constructor(config: DeepSeekConfig) {
    this.config = config;

    if (!validateLLMConfig(config)) {
      throw new Error('Invalid DeepSeek configuration. Please check your API key and configuration.');
    }
  }

  /**
   * Get Base URL
   */
  private getBaseUrl(): string {
    return this.config.baseUrl || 'https://api.deepseek.com/v1';
  }

  /**
   * Get Model Name
   */
  private getModel(): string {
    return this.config.model || 'deepseek-chat';
  }

  /**
   * Create chat completion
   */
  async chat(messages: DeepSeekMessage[]): Promise<DeepSeekResponse> {
    const requestBody: DeepSeekRequest = {
      model: this.getModel(),
      messages,
      temperature: this.config.temperature ?? 0.7,
      max_tokens: this.config.maxTokens ?? 4096,
      stream: false,
    };

    // Add reasoning_effort for supported models
    if (this.config.reasoningEffort && this.getModel().includes('deepseek')) {
      requestBody.reasoning_effort = this.config.reasoningEffort;
    }

    try {
      const response = await fetch(`${this.getBaseUrl()}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(this.config.timeout ?? 30000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
      }

      const data = await response.json() as DeepSeekResponse;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`DeepSeek service error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while calling DeepSeek API');
    }
  }

  /**
   * Generate video prompt using DeepSeek
   */
  async generateVideoPrompt(userPrompt: string, context?: {
    videoDuration?: number;
    resolution?: string;
    style?: string;
  }): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate a detailed video generation prompt: ${userPrompt}` },
    ];

    const response = await this.chat(messages);
    const content = response.choices[0]?.message?.content || '';

    return content;
  }

  /**
   * Build system prompt for video generation
   */
  private buildSystemPrompt(context?: {
    videoDuration?: number;
    resolution?: string;
    style?: string;
  }): string {
    let systemPrompt = 'You are an expert at creating detailed video generation prompts. ';
    systemPrompt += 'Your task is to transform user descriptions into detailed, structured prompts optimized for AI video generation. ';
    systemPrompt += 'Include specific visual details, camera movements, lighting, style, and composition.';

    if (context) {
      const details: string[] = [];
      if (context.videoDuration) details.push(`Duration: ${context.videoDuration} seconds`);
      if (context.resolution) details.push(`Resolution: ${context.resolution}`);
      if (context.style) details.push(`Style: ${context.style}`);

      if (details.length > 0) {
        systemPrompt += `\n\nTarget specifications:\n${details.join('\n')}`;
      }
    }

    return systemPrompt;
  }

  /**
   * Analyze and enhance prompt
   */
  async enhancePrompt(prompt: string): Promise<{
    enhancedPrompt: string;
    suggestions: string[];
    keywords: string[];
  }> {
    const systemPrompt = `You are an expert prompt engineer for AI video generation. 
Analyze the given prompt and provide:
1. An enhanced version with more visual details
2. Suggestions for improvement
3. Important keywords extracted

Respond in the following JSON format:
{
  "enhancedPrompt": "detailed enhanced prompt",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "keywords": ["keyword1", "keyword2"]
}`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ];

    const response = await this.chat(messages);
    const content = response.choices[0]?.message?.content || '{}';

    try {
      const parsed = JSON.parse(content);
      return {
        enhancedPrompt: parsed.enhancedPrompt || prompt,
        suggestions: parsed.suggestions || [],
        keywords: parsed.keywords || [],
      };
    } catch {
      return {
        enhancedPrompt: prompt,
        suggestions: [],
        keywords: [],
      };
    }
  }

  /**
   * Get provider information
   */
  getProviderInfo(): { provider: LLMProvider; model: string; baseUrl: string } {
    return {
      provider: ProviderEnum.DEEPSEEK,
      model: this.getModel(),
      baseUrl: this.getBaseUrl(),
    };
  }
}

export default DeepSeekService;
