"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./Sidebar";
import ModelSelector from "./ModelSelector";
import SettingsModal from "./SettingsModal";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType, Conversation, Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { MODELS, getModelById, PROVIDER_CONFIG, type Provider } from "@/lib/models";

const SETTINGS_KEY = "nexchat-settings";
const CONVERSATIONS_KEY = "nexchat-conversations";
const MESSAGES_KEY = "nexchat-messages";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CONVERSATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

function loadMessages(conversationId: string): ChatMessageType[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(`${MESSAGES_KEY}-${conversationId}`);
    if (saved) {
      return JSON.parse(saved).map((m: ChatMessageType) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveMessages(conversationId: string, messages: ChatMessageType[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${MESSAGES_KEY}-${conversationId}`, JSON.stringify(messages));
}

function deleteConversationMessages(conversationId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${MESSAGES_KEY}-${conversationId}`);
}

export default function ChatApp() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSettings(loadSettings());
    setConversations(loadConversations());
  }, []);

  useEffect(() => {
    if (mounted) {
      saveSettings(settings);
    }
  }, [settings, mounted]);

  useEffect(() => {
    if (mounted) {
      saveConversations(conversations);
    }
  }, [conversations, mounted]);

  useEffect(() => {
    if (mounted && currentConversationId) {
      saveMessages(currentConversationId, messages);
    }
  }, [messages, currentConversationId, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createConversation = (): string => {
    const selectedModel = getModelById(settings.selectedModelId);
    const conv: Conversation = {
      id: uuidv4(),
      title: "New Chat",
      model: selectedModel?.modelId || "",
      provider: selectedModel?.provider || "openrouter",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [conv, ...prev]);
    setCurrentConversationId(conv.id);
    return conv.id;
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, title: title.substring(0, 80) + (title.length > 80 ? "..." : ""), updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const getApiKey = useCallback(
    (provider: Provider): string => {
      switch (provider) {
        case "openrouter":
          return settings.openrouterKey;
        case "groq":
          return settings.groqKey;
        case "google":
          return settings.googleKey;
        case "openai":
          return settings.openaiKey;
        case "custom":
          return settings.customKey;
      }
    },
    [settings]
  );

  const hasApiKey = useCallback(
    (provider: Provider): boolean => {
      return getApiKey(provider).length > 0;
    },
    [getApiKey]
  );

  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content || isLoading) return;

    const selectedModel = getModelById(settings.selectedModelId);
    if (!selectedModel) {
      setError("Please select a model first.");
      return;
    }

    const apiKey = getApiKey(selectedModel.provider);
    if (!apiKey) {
      setError(`Please add your ${selectedModel.provider} API key in Settings.`);
      setSettingsOpen(true);
      return;
    }

    setError(null);
    setInputValue("");
    setIsLoading(true);

    // Get or create conversation
    let convId = currentConversationId;
    if (!convId) {
      convId = createConversation();
    }

    // Add user message
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Update conversation title from first message
    if (messages.length === 0) {
      updateConversationTitle(convId, content);
    }

    // Add placeholder assistant message
    const assistantId = uuidv4();
    const assistantMessage: ChatMessageType = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
      isStreaming: true,
    };
    setMessages([...updatedMessages, assistantMessage]);

    // Build messages array for API
    const apiMessages: { role: string; content: string }[] = [];
    if (settings.systemPrompt) {
      apiMessages.push({ role: "system", content: settings.systemPrompt });
    }
    for (const msg of updatedMessages) {
      apiMessages.push({ role: msg.role, content: msg.content });
    }

    // Get the correct API URL
    const providerConfig = PROVIDER_CONFIG[selectedModel.provider];
    let baseUrl = providerConfig.baseUrl;
    if (selectedModel.provider === "custom" && settings.customBaseUrl) {
      baseUrl = settings.customBaseUrl;
    }

    try {
      abortControllerRef.current = new AbortController();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      // Add OpenRouter-specific headers
      if (selectedModel.provider === "openrouter") {
        headers["HTTP-Referer"] = window.location.origin;
        headers["X-Title"] = "NexChat AI";
      }

      const res = await fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: selectedModel.modelId,
          messages: apiMessages,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `API Error (${res.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const deltaContent = parsed.choices?.[0]?.delta?.content || "";
              if (deltaContent) {
                fullContent += deltaContent;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                );
              }
            } catch {
              // Skip invalid JSON chunks
            }
          }
        }
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false, content: fullContent } : m
        )
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      } else {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setError(null);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setMessages(loadMessages(id));
    setError(null);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversationMessages(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleModelChange = (modelId: string) => {
    setSettings((prev) => ({ ...prev, selectedModelId: modelId }));
  };

  const selectedModel = getModelById(settings.selectedModelId);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const quickPrompts = [
    { emoji: "💡", text: "Explain quantum computing simply" },
    { emoji: "📝", text: "Write a Python sorting algorithm" },
    { emoji: "🎨", text: "Design a landing page with HTML/CSS" },
    { emoji: "🧮", text: "Solve a complex math problem" },
  ];

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900">
        <div className="animate-pulse-glow w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-cyan-glow flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-dark-600 bg-dark-800/80 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-cyan-glow flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg hidden sm:block">
              Nex<span className="text-accent-400">Chat</span>
            </span>
          </div>

          <div className="flex-1 flex justify-center">
            <ModelSelector
              selectedModelId={settings.selectedModelId}
              onSelect={handleModelChange}
              hasApiKey={hasApiKey}
            />
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 hover:bg-dark-600 rounded-lg transition-colors text-dark-200 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-2xl w-full text-center">
                {/* Hero */}
                <div className="mb-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent-500 to-cyan-glow flex items-center justify-center mb-4 animate-pulse-glow">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome to <span className="text-accent-400">NexChat</span>
                  </h1>
                  <p className="text-dark-200 text-sm max-w-md mx-auto">
                    Chat with the latest AI models for free. Bring your own API key and choose
                    from {MODELS.filter((m) => m.isFree).length}+ free models.
                  </p>
                </div>

                {/* Model Info */}
                {selectedModel && (
                  <div className="bg-dark-700 border border-dark-500 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{selectedModel.name}</span>
                      {selectedModel.isFree && (
                        <span className="text-xs bg-emerald-glow/20 text-emerald-glow px-2 py-0.5 rounded-full font-medium">
                          FREE
                        </span>
                      )}
                      {selectedModel.badge && (
                        <span className="text-xs text-dark-200">{selectedModel.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-dark-200 mb-2">{selectedModel.description}</p>
                    <div className="flex gap-4 text-xs text-dark-300">
                      <span>📏 {selectedModel.contextWindow} context</span>
                      <span>🏢 {selectedModel.provider}</span>
                    </div>
                    {!hasApiKey(selectedModel.provider) && (
                      <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5">
                        <p className="text-xs text-amber-400">
                          ⚠️ Add your {selectedModel.provider} API key in{" "}
                          <button onClick={() => setSettingsOpen(true)} className="underline font-medium">
                            Settings
                          </button>{" "}
                          to start chatting.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(prompt.text);
                        textareaRef.current?.focus();
                      }}
                      className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-500 rounded-xl px-4 py-3 text-left text-sm transition-colors group"
                    >
                      <span className="text-lg">{prompt.emoji}</span>
                      <span className="text-dark-200 group-hover:text-white transition-colors">
                        {prompt.text}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Provider Links */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {[
                    { name: "OpenRouter", url: "https://openrouter.ai/keys", color: "text-purple-400" },
                    { name: "Groq", url: "https://console.groq.com", color: "text-orange-400" },
                    { name: "Google AI", url: "https://aistudio.google.com", color: "text-blue-400" },
                  ].map(({ name, url, color }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs ${color} hover:underline flex items-center gap-1`}
                    >
                      🔑 Get free {name} key
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-300 flex-1">{error}</p>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-dark-600 bg-dark-800/80 backdrop-blur-md px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 focus-within:border-accent-500 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedModel
                      ? `Message ${selectedModel.name}...`
                      : "Select a model to start chatting..."
                  }
                  rows={1}
                  disabled={isLoading}
                  className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder-dark-300 max-h-[200px]"
                />
              </div>

              {isLoading ? (
                <button
                  onClick={handleStop}
                  className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                    inputValue.trim()
                      ? "bg-accent-500 hover:bg-accent-600 text-white"
                      : "bg-dark-600 text-dark-300 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-dark-400">
                {selectedModel?.isFree ? "🆓 Free model" : "💰 Paid model"} •{" "}
                {selectedModel?.contextWindow || "—"} context • Shift+Enter for new line
              </p>
              <p className="text-[10px] text-dark-400">
                Keys stored locally • Never sent to any server
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSettingsSave}
      />
    </div>
  );
}
