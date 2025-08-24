// Environment variable configuration for OpenRouter
export interface OpenRouterEnvConfig {
  apiKey: string;
  siteUrl?: string;
  siteName?: string;
  defaultModel?: string;
}

/**
 * Load OpenRouter configuration from environment variables
 */
export function loadOpenRouterConfig(): OpenRouterEnvConfig {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY environment variable is required. Please set it in your .env file.'
    );
  }

  return {
    apiKey,
    siteUrl: process.env.OPENROUTER_SITE_URL,
    siteName: process.env.OPENROUTER_SITE_NAME,
    defaultModel: process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-4o',
  };
}

/**
 * Create OpenRouter service with environment configuration
 */
export function createOpenRouterServiceFromEnv() {
  const { createOpenRouterService } = require('./OpenRouterService');
  const config = loadOpenRouterConfig();
  
  return createOpenRouterService({
    apiKey: config.apiKey,
    siteUrl: config.siteUrl,
    siteName: config.siteName,
  });
}