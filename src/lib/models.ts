export type Provider = "openrouter" | "groq" | "google" | "openai" | "custom";

export interface AIModel {
  id: string;
  name: string;
  provider: Provider;
  modelId: string;
  contextWindow: string;
  description: string;
  isFree: boolean;
  category: "featured" | "reasoning" | "coding" | "chat" | "multimodal";
  badge?: string;
}

export const PROVIDER_CONFIG: Record<
  Provider,
  { name: string; baseUrl: string; keyName: string; description: string }
> = {
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1/chat/completions",
    keyName: "OpenRouter API Key",
    description: "Access 200+ models through a unified API. Many free models available.",
  },
  groq: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    keyName: "Groq API Key",
    description: "Ultra-fast inference for open-source models. Free tier available.",
  },
  google: {
    name: "Google AI Studio",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyName: "Google AI API Key",
    description: "Free access to Gemini models with generous rate limits.",
  },
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    keyName: "OpenAI API Key",
    description: "GPT-4o, GPT-4o-mini and more. Paid API with free trial credits.",
  },
  custom: {
    name: "Custom (OpenAI-compatible)",
    baseUrl: "",
    keyName: "API Key",
    description: "Any OpenAI-compatible API endpoint.",
  },
};

export const MODELS: AIModel[] = [
  // ──── OpenRouter Featured Free Models ────
  {
    id: "or-owl-alpha",
    name: "Owl Alpha",
    provider: "openrouter",
    modelId: "openrouter/openrouter-owl-alpha",
    contextWindow: "1M",
    description: "Stealth frontier model with 1M context. Strong at coding & math. Free preview.",
    isFree: true,
    category: "featured",
    badge: "🔥 NEW",
  },
  {
    id: "or-nex-n2-pro",
    name: "Nex-N2 Pro",
    provider: "openrouter",
    modelId: "nex-agi/nex-n2-pro:free",
    contextWindow: "262K",
    description: "Agentic MoE model (397B/17B active). Excels at coding, tool use & deep research.",
    isFree: true,
    category: "featured",
    badge: "🔥 NEW",
  },
  {
    id: "or-deepseek-r1",
    name: "DeepSeek R1",
    provider: "openrouter",
    modelId: "deepseek/deepseek-r1:free",
    contextWindow: "64K",
    description: "Strong reasoning model for math, logic, and complex problem solving.",
    isFree: true,
    category: "reasoning",
    badge: "⭐ Popular",
  },
  {
    id: "or-deepseek-v3",
    name: "DeepSeek V3",
    provider: "openrouter",
    modelId: "deepseek/deepseek-chat-v3-0324:free",
    contextWindow: "64K",
    description: "General-purpose chat model. Great for content writing and conversations.",
    isFree: true,
    category: "chat",
  },
  {
    id: "or-qwen3-235b",
    name: "Qwen3 235B",
    provider: "openrouter",
    modelId: "qwen/qwen3-235b-a22b:free",
    contextWindow: "128K",
    description: "One of the strongest free coding models. Excellent for analysis & automation.",
    isFree: true,
    category: "coding",
    badge: "💻 Coding",
  },
  {
    id: "or-qwen3-coder",
    name: "Qwen3 Coder",
    provider: "openrouter",
    modelId: "qwen/qwen3-coder:free",
    contextWindow: "128K",
    description: "Specialized coding model with tool use support.",
    isFree: true,
    category: "coding",
    badge: "💻 Coding",
  },
  {
    id: "or-llama4-maverick",
    name: "Llama 4 Maverick",
    provider: "openrouter",
    modelId: "meta-llama/llama-4-maverick:free",
    contextWindow: "1M",
    description: "Meta's multimodal model with 1M context. Supports image + text input.",
    isFree: true,
    category: "multimodal",
  },
  {
    id: "or-llama4-scout",
    name: "Llama 4 Scout",
    provider: "openrouter",
    modelId: "meta-llama/llama-4-scout:free",
    contextWindow: "128K",
    description: "Fast and lightweight. Best for real-time chat with low latency.",
    isFree: true,
    category: "chat",
  },
  {
    id: "or-grok3-mini",
    name: "Grok 3 Mini Beta",
    provider: "openrouter",
    modelId: "x-ai/grok-3-mini-beta:free",
    contextWindow: "131K",
    description: "xAI's fast lightweight reasoning model. Optimized for speed.",
    isFree: true,
    category: "reasoning",
  },
  {
    id: "or-gemma3-27b",
    name: "Gemma 3 27B",
    provider: "openrouter",
    modelId: "google/gemma-3-27b-it:free",
    contextWindow: "128K",
    description: "Google's efficient instruction-following model. Good for summaries.",
    isFree: true,
    category: "chat",
  },
  {
    id: "or-mistral-small",
    name: "Mistral Small 3.1",
    provider: "openrouter",
    modelId: "mistralai/mistral-small-3.1-24b-instruct:free",
    contextWindow: "128K",
    description: "Well-balanced model for writing, coding, and assistant tasks.",
    isFree: true,
    category: "chat",
  },
  {
    id: "or-nemotron-120b",
    name: "Nemotron 3 Super 120B",
    provider: "openrouter",
    modelId: "nvidia/nemotron-3-super-120b-a12b:free",
    contextWindow: "128K",
    description: "NVIDIA's large free model. Strong at high-context tasks.",
    isFree: true,
    category: "reasoning",
  },
  {
    id: "or-gpt-oss-120b",
    name: "GPT-OSS 120B",
    provider: "openrouter",
    modelId: "openai/gpt-oss-120b:free",
    contextWindow: "128K",
    description: "OpenAI's open-source model. Reliable tool use & reasoning.",
    isFree: true,
    category: "reasoning",
  },
  {
    id: "or-glm-45-air",
    name: "GLM 4.5 Air",
    provider: "openrouter",
    modelId: "zhipu-ai/glm-4.5-air:free",
    contextWindow: "32K",
    description: "Excellent for multilingual tasks, especially Chinese + English.",
    isFree: true,
    category: "chat",
  },
  {
    id: "or-hermes3-70b",
    name: "Hermes 3 Llama 70B",
    provider: "openrouter",
    modelId: "nousresearch/hermes-3-llama-3.1-70b:free",
    contextWindow: "128K",
    description: "Conversational and personality-driven. Great for assistant-style chat.",
    isFree: true,
    category: "chat",
  },

  // ──── Groq Free Models ────
  {
    id: "groq-llama4-scout",
    name: "Llama 4 Scout (Groq)",
    provider: "groq",
    modelId: "meta-llama/llama-4-scout-17b-16e-instruct",
    contextWindow: "128K",
    description: "Llama 4 on Groq's ultra-fast infrastructure. Free tier available.",
    isFree: true,
    category: "chat",
    badge: "⚡ Fast",
  },
  {
    id: "groq-llama33-70b",
    name: "Llama 3.3 70B (Groq)",
    provider: "groq",
    modelId: "llama-3.3-70b-versatile",
    contextWindow: "128K",
    description: "Versatile 70B model with ultra-fast inference on Groq.",
    isFree: true,
    category: "chat",
    badge: "⚡ Fast",
  },
  {
    id: "groq-qwen3-32b",
    name: "Qwen3 32B (Groq)",
    provider: "groq",
    modelId: "qwen/qwen3-32b",
    contextWindow: "128K",
    description: "Qwen3 with blazing fast Groq inference.",
    isFree: true,
    category: "coding",
    badge: "⚡ Fast",
  },

  // ──── Google AI Studio Free Models ────
  {
    id: "google-gemini-25-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    modelId: "gemini-2.5-flash-preview-05-20",
    contextWindow: "1M",
    description: "Google's fast multimodal model. Free with generous rate limits.",
    isFree: true,
    category: "multimodal",
    badge: "🌟 Recommended",
  },
  {
    id: "google-gemini-25-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    modelId: "gemini-2.5-pro-preview-06-05",
    contextWindow: "1M",
    description: "Google's most capable free model. 1M context window.",
    isFree: true,
    category: "reasoning",
    badge: "🌟 Recommended",
  },

  // ──── OpenAI (Paid) ────
  {
    id: "openai-gpt4o",
    name: "GPT-4o",
    provider: "openai",
    modelId: "gpt-4o",
    contextWindow: "128K",
    description: "OpenAI's flagship multimodal model. Requires paid API key.",
    isFree: false,
    category: "multimodal",
  },
  {
    id: "openai-gpt4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    modelId: "gpt-4o-mini",
    contextWindow: "128K",
    description: "Affordable and fast. Great for most tasks.",
    isFree: false,
    category: "chat",
  },
];

export function getModelById(id: string): AIModel | undefined {
  return MODELS.find((m) => m.id === id);
}

export function getModelsByProvider(provider: Provider): AIModel[] {
  return MODELS.filter((m) => m.provider === provider);
}

export function getFreeModels(): AIModel[] {
  return MODELS.filter((m) => m.isFree);
}

export function getModelsByCategory(category: AIModel["category"]): AIModel[] {
  return MODELS.filter((m) => m.category === category);
}
