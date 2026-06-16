export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  openrouterKey: string;
  groqKey: string;
  googleKey: string;
  openaiKey: string;
  customKey: string;
  customBaseUrl: string;
  selectedModelId: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export const DEFAULT_SETTINGS: Settings = {
  openrouterKey: "",
  groqKey: "",
  googleKey: "",
  openaiKey: "",
  customKey: "",
  customBaseUrl: "",
  selectedModelId: "or-owl-alpha",
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: "",
};
