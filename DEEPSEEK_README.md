# DeepSeek LLM Integration

## Overview

This project now includes DeepSeek LLM integration for enhanced video generation capabilities. The LLM service provides:

- **Chat Completion**: Use DeepSeek's chat models for text generation
- **Video Prompt Generation**: AI-powered enhancement of video generation prompts
- **Prompt Enhancement**: Analyze and improve user prompts with suggestions
- **Keyword Extraction**: Extract important keywords from prompts

## Configuration

### Environment Variables

Add the following environment variable to your Cloudflare Worker configuration:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### Getting Your DeepSeek API Key

1. Visit [https://platform.deepseek.com/](https://platform.deepseek.com/)
2. Sign up or log in to your account
3. Navigate to API Keys in your dashboard
4. Create a new API key
5. Copy the key and add it to your environment configuration

### Wrangler Configuration

Update your `wrangler.toml`:

```toml
[vars]
DEEPSEEK_API_KEY = "your_deepseek_api_key_here"
```

Or use secrets for better security:

```bash
wrangler secret put DEEPSEEK_API_KEY
```

## API Endpoints

### 1. Chat Completion

**Endpoint:** `POST /api/llm/chat`

**Request Body:**
```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello! How can you help with video generation?" }
  ],
  "config": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "reasoningEffort": "high"
  }
}
```

**Response:**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I can help you generate detailed video prompts..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

### 2. Generate Video Prompt

**Endpoint:** `POST /api/llm/VideoPrompt`

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over the ocean",
  "context": {
    "videoDuration": 5,
    "resolution": "1080p",
    "style": "cinematic"
  }
}
```

**Response:**
```json
{
  "prompt": "A breathtaking cinematic shot of a golden sunset casting warm orange and pink hues across a vast ocean surface. The sun slowly descends below the horizon, creating dramatic silhouettes of distant boats and seagulls flying in the frame. Gentle ocean waves reflect the vibrant sunset colors, with camera slowly panning right to capture the majestic beauty. Shot in 1080p vertical orientation, 5-second duration with smooth, cinematic motion."
}
```

### 3. Enhance Prompt

**Endpoint:** `POST /api/llm/enhance`

**Request Body:**
```json
{
  "prompt": "A cat playing"
}
```

**Response:**
```json
{
  "enhancedPrompt": "A playful domestic cat with soft ginger fur chasing a small feather toy in a cozy living room. The cat jumps and pounces with graceful movements, whiskers twitching in excitement.",
  "suggestions": [
    "Add specific lighting conditions",
    "Include camera movement direction",
    "Specify time of day"
  ],
  "keywords": ["cat", "playful", "domestic", "ginger", "feather toy", "living room"]
}
```

### 4. Get Provider Info

**Endpoint:** `GET /api/llm/info`

**Response:**
```json
{
  "provider": "deepseek",
  "model": "deepseek-chat",
  "baseUrl": "https://api.deepseek.com/v1",
  "status": "configured"
}
```

## Frontend Usage

### Import LLM Client

```typescript
import LLMClient from './utils/llmClient';
```

### Generate Video Prompt

```typescript
const result = await LLMClient.generateVideoPrompt({
  prompt: "A futuristic city skyline",
  context: {
    videoDuration: 5,
    resolution: "1080p",
    style: "sci-fi"
  }
});

console.log(result.prompt);
```

### Enhance Prompt

```typescript
const result = await LLMClient.enhancePrompt({
  prompt: "A dog running"
});

console.log(result.enhancedPrompt);
console.log(result.suggestions);
console.log(result.keywords);
```

### Simple Chat

```typescript
const response = await LLMClient.simpleChat(
  "What makes a good video prompt?",
  "You are an expert in AI video generation."
);

console.log(response);
```

## Available Models

- **deepseek-chat**: General-purpose chat model
- **deepseek-coder**: Specialized for coding tasks

## Configuration Options

### Temperature (0-2)
- Lower values (0.1-0.3): More focused and deterministic responses
- Higher values (0.7-1.0): More creative and diverse responses

### Max Tokens
- Controls the maximum length of the generated response
- Default: 4096 tokens
- Typical range: 100-4000 tokens

### Reasoning Effort
- Low: Fast responses with minimal reasoning
- Medium: Balanced reasoning and speed
- High: Maximum reasoning capabilities (may be slower)

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing/invalid parameters)
- `500`: Internal server error
- `503`: Service unavailable (API key not configured)

Error responses include a descriptive message:

```json
{
  "error": "DEEPSEEK_API_KEY not configured"
}
```

## Rate Limits

DeepSeek API has rate limits based on your plan. Make sure to handle potential rate limit errors in your application.

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables or secrets**
3. **Rotate API keys regularly**
4. **Monitor API usage and costs**
5. **Implement proper error handling and retry logic**

## Support

For issues related to:
- **DeepSeek API**: Visit [https://platform.deepseek.com/docs](https://platform.deepseek.com/docs)
- **This integration**: Check the GitHub repository issues

## License

This integration follows the same license as the main project.
