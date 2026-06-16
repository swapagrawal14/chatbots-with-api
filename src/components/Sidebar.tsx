"use client";

import { useState } from "react";
import type { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed md:relative z-40 h-full bg-dark-800 border-r border-dark-600 flex flex-col transition-all duration-300 ${
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0"
        }`}
      >
        <div className={`flex flex-col h-full ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200 min-w-[288px]`}>
          {/* Header */}
          <div className="p-4 border-b border-dark-600">
            <button
              onClick={onNew}
              className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white rounded-xl py-2.5 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center text-dark-300 py-8 text-sm">
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative flex items-center rounded-xl px-3 py-2.5 mb-1 cursor-pointer transition-colors group ${
                    currentConversationId === conv.id
                      ? "bg-dark-600 border border-dark-500"
                      : "hover:bg-dark-700 border border-transparent"
                  }`}
                  onClick={() => onSelect(conv.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-dark-300 mt-0.5">
                      {formatDate(conv.updatedAt)}
                    </p>
                  </div>

                  {hoveredId === conv.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      className="ml-2 p-1 text-dark-300 hover:text-red-400 transition-colors rounded"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-dark-600">
            <div className="flex items-center gap-2 text-xs text-dark-300">
              <div className="w-2 h-2 bg-emerald-glow rounded-full animate-pulse"></div>
              <span>{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
