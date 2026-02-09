// llmConfig.ts - LLM Provider Configuration

/**
 * LLM Provider Types
 */
export const LLMProvider = {
  DASHSCOPE: 'dashscope',
  DEEPSEEK: 'deepseek',
  OPENAI: 'openai',
  ZHIPU: 'zhipu',
} as const;

export type LLMProvider = typeof LLMProvider[keyof typeof LLMProvider];

/**
 * LLM Configuration Interface
 */
export interface LLMConfig {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

/**
 * DeepSeek Specific Configuration
 */
export interface DeepSeekConfig extends LLMConfig {
  provider: 'deepseek';
  baseUrl?: string;
  model?: 'deepseek-chat' | 'deepseek-coder';
  reasoningEffort?: 'low' | 'medium' | 'high';

}

/**
 * LLM Provider Default Configurations
 */
export const LLM_DEFAULT_CONFIGS: Record<LLMProvider, Partial<LLMConfig>> = {
  [LLMProvider.DASHSCOPE]: {
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    model: 'qwen-plus',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
  },
  [LLMProvider.DEEPSEEK]: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
  },
  [LLMProvider.OPENAI]: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
  },
  [LLMProvider.ZHIPU]: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4',
    temperature: 0.7,
    maxTokens: 4096,
    timeout: 30000,
  },
};

/**
 * Environment Variables Mapping
 */
export const LLM_ENV_VAR_MAPPING: Record<LLMProvider, string> = {
  [LLMProvider.DASHSCOPE]: 'DASHSCOPE_API_KEY',
  [LLMProvider.DEEPSEEK]: 'DEEPSEEK_API_KEY',
  [LLMProvider.OPENAI]: 'OPENAI_API_KEY',
  [LLMProvider.ZHIPU]: 'ZHIPU_API_KEY',
};

/**
 * Get LLM Configuration from Environment
 */
export function getLLMConfig(
  provider: LLMProvider,
  env: Record<string, string>,
  customConfig?: Partial<LLMConfig>
): LLMConfig {
  const apiKey = env[LLM_ENV_VAR_MAPPING[provider]];

  if (!apiKey) {
    throw new Error(`Missing API key for ${provider}. Expected environment variable: ${LLM_ENV_VAR_MAPPING[provider]}`);
  }

  const defaultConfig = LLM_DEFAULT_CONFIGS[provider];

  return {
    provider,
    apiKey,
    ...defaultConfig,
    ...customConfig,
  } as LLMConfig;
}

/**
 * Validate LLM Configuration
 */
export function validateLLMConfig(config: LLMConfig): boolean {
  return Boolean(
    config.provider &&
    config.apiKey &&
    config.baseUrl &&
    config.model
  );
}
