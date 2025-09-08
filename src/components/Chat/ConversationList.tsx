import React from "react";
import { ChatConversation } from "../../types";

interface ConversationListProps {
  conversations: ChatConversation[];
  selectedConversation: string | null;
  onConversationSelect: (conversationId: string) => void;
  searchQuery: string;
  showSearch: boolean;
  onSearchToggle: () => void;
  onSearchChange: (query: string) => void;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onConversationSelect,
  searchQuery,
  showSearch,
  onSearchToggle,
  onSearchChange,
}: ConversationListProps) {
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;
    return (
      conversation.businessName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage?.message
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onSearchToggle}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              title="Search conversations"
              aria-label="Search conversations"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              title="Filter conversations"
              aria-label="Filter conversations"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="relative mb-4">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedConversation === conversation.id
                  ? "bg-green-50 border-green-200"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={conversation.businessLogo}
                  alt={conversation.businessName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">
                      {conversation.businessName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage
                        ? new Date(
                            conversation.lastMessage.timestamp
                          ).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.message || "No messages yet"}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
