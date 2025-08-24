# AI Services with OpenRouter

This directory contains AI services that use OpenRouter to provide access to multiple AI models through a unified API.

## Setup

1. **Get an OpenRouter API Key**
   - Sign up at [openrouter.ai](https://openrouter.ai)
   - Generate an API key from your dashboard

2. **Configure the Service**
   ```typescript
   import { createOpenRouterService } from '@/services/ai';

   const openRouterService = createOpenRouterService({
     apiKey: 'your-openrouter-api-key-here',
     siteUrl: 'https://your-app-domain.com', // Optional
     siteName: 'Your App Name' // Optional
   });
   ```

## Available Services

### OpenRouterService

The core service that provides direct access to OpenRouter's API.

**Features:**
- Chat completions with any supported model
- Model availability checking
- Configurable parameters (temperature, max tokens, etc.)
- Automatic fallback handling

**Example Usage:**
```typescript
// Simple text generation
const response = await openRouterService.generateText(
  'Create a workout plan for beginners',
  'openai/gpt-4o'
);

// Chat completion with multiple messages
const chatResponse = await openRouterService.generateChatCompletion({
  messages: [
    { role: 'system', content: 'You are a fitness trainer.' },
    { role: 'user', content: 'How do I build muscle?' }
  ],
  model: 'anthropic/claude-3-opus'
});
```

### WorkoutSuggestionService

A specialized service for generating workout recommendations using AI.

**Features:**
- Personalized workout plans based on fitness level
- Daily workout generation
- Exercise recommendations by muscle group
- Equipment-aware suggestions
- Fallback content when AI is unavailable

**Example Usage:**
```typescript
import { createWorkoutSuggestionService } from '@/services/ai';

const workoutService = createWorkoutSuggestionService(openRouterService);

// Generate a full workout plan
const plan = await workoutService.generateWorkoutSuggestions(
  'beginner',
  ['build muscle', 'lose weight'],
  ['dumbbells', 'bodyweight'],
  45, // 45 minutes
  3   // 3 days per week
);

// Get daily workout
const dailyWorkout = await workoutService.generateDailyWorkout(
  1, 4, 'intermediate', 'upper body',
  ['dumbbells', 'barbell'], 60
);
```

## Supported Models

OpenRouter supports hundreds of models. Here are some popular ones:

- **OpenAI Models:**
  - `openai/gpt-4o` - GPT-4 Optimized (recommended)
  - `openai/gpt-4o-mini` - Fast and cost-effective
  - `openai/gpt-4-turbo` - Latest GPT-4 Turbo

- **Anthropic Models:**
  - `anthropic/claude-3-opus` - Most capable Claude model
  - `anthropic/claude-3-sonnet` - Balanced performance/cost
  - `anthropic/claude-3-haiku` - Fast and efficient

- **Other Providers:**
  - `google/gemini-pro` - Google's Gemini
  - `meta-llama/llama-3-70b-instruct` - Meta's LLaMA
  - `mistralai/mistral-large` - Mistral's latest

## Configuration Options

### OpenRouterService Config
```typescript
{
  apiKey: string;           // Your OpenRouter API key (required)
  siteUrl?: string;         // Your site URL for rankings
  siteName?: string;        // Your site name for rankings
}
```

### ChatCompletionOptions
```typescript
{
  model?: string;           // Model to use (default: 'openai/gpt-4o')
  messages: ChatMessage[];  // Conversation messages
  temperature?: number;     // Creativity (0.0-2.0, default: 0.7)
  maxTokens?: number;       // Max response length (default: 1000)
  stream?: boolean;         // Enable streaming (default: false)
}
```

## Best Practices

1. **Error Handling:** Always wrap AI calls in try-catch blocks
2. **Fallback Content:** Provide fallback responses when AI is unavailable
3. **Rate Limiting:** Consider implementing rate limiting for user requests
4. **Cost Management:** Monitor your usage on the OpenRouter dashboard
5. **Model Selection:** Choose models based on your use case:
   - Use faster/cheaper models for simple tasks
   - Use more capable models for complex reasoning
6. **Prompt Engineering:** Craft clear, specific prompts for better results

## Cost Optimization

- Use `gpt-4o-mini` or `claude-3-haiku` for simple tasks
- Set appropriate `maxTokens` to avoid unnecessary costs
- Cache responses when possible
- Use streaming for better user experience with long responses

## Security Notes

- Never commit API keys to version control
- Use environment variables for configuration
- Consider implementing user-specific API key management
- Monitor usage to prevent abuse

## Migration from OpenAI

If you're migrating from direct OpenAI usage:

1. Replace your OpenAI client initialization with OpenRouter configuration
2. Update model names to use the format `provider/model-name`
3. The rest of your code can remain largely the same since OpenRouter uses the same API format

**Before:**
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: 'sk-...' });
```

**After:**
```typescript
import { createOpenRouterService } from '@/services/ai';
const openRouterService = createOpenRouterService({ apiKey: 'sk-or-v1-...' });