import OpenAI from 'openai';

// Types for OpenRouter integration
export interface OpenRouterConfig {
  apiKey: string;
  siteUrl?: string; // Optional. Site URL for rankings on openrouter.ai.
  siteName?: string; // Optional. Site title for rankings on openrouter.ai.
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * OpenRouter service that provides access to multiple AI models through a unified API
 */
export class OpenRouterService {
  private client: OpenAI;
  private config: OpenRouterConfig;

  constructor(config: OpenRouterConfig) {
    this.config = config;

    // Initialize OpenAI client configured for OpenRouter
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.apiKey,
      defaultHeaders: {
        ...(config.siteUrl && { 'HTTP-Referer': config.siteUrl }),
        ...(config.siteName && { 'X-Title': config.siteName }),
      },
    });
  }

  /**
   * Generate a chat completion using the specified model
   */
  async generateChatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    try {
      // Don't support streaming in this simplified version
      const completion = await this.client.chat.completions.create({
        model: options.model || 'openai/gpt-4o', // Default to GPT-4o
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        stream: false, // Force non-streaming for simplicity
      }) as OpenAI.Chat.Completions.ChatCompletion;

      const choice = completion.choices[0];
      if (!choice || !choice.message) {
        throw new Error('No completion generated');
      }

      return {
        content: choice.message.content || '',
        model: completion.model || options.model || 'unknown',
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error(`Failed to generate chat completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a simple text completion from a prompt
   */
  async generateText(prompt: string, model?: string, options?: Partial<ChatCompletionOptions>): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'user', content: prompt }
    ];

    const response = await this.generateChatCompletion({
      model,
      messages,
      ...options,
    });

    return response.content;
  }

  /**
   * Get available models from OpenRouter
   */
  async getAvailableModels() {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      throw error;
    }
  }

  /**
   * Update the API key
   */
  updateApiKey(apiKey: string) {
    this.config.apiKey = apiKey;
    // Recreate client with new API key
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      defaultHeaders: {
        ...(this.config.siteUrl && { 'HTTP-Referer': this.config.siteUrl }),
        ...(this.config.siteName && { 'X-Title': this.config.siteName }),
      },
    });
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getConfig() {
    return {
      siteUrl: this.config.siteUrl,
      siteName: this.config.siteName,
      hasApiKey: !!this.config.apiKey,
    };
  }
}

// Export a factory function for easier usage
export const createOpenRouterService = (config: OpenRouterConfig): OpenRouterService => {
  return new OpenRouterService(config);
};