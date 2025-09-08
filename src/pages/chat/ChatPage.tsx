import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, Phone, MoreVertical } from "lucide-react";
import { useStore } from "../../stores/useStore";
import ConversationList from "../../components/Chat/ConversationList";
import MessageBubble from "../../components/Chat/MessageBubble";
import MessageInput from "../../components/Chat/MessageInput";

export default function ChatPage() {
  const { vendorId } = useParams<{ vendorId?: string }>();
  const conversations = useStore((state) => state.conversations);
  const businesses = useStore((state) => state.businesses);
  const user = useStore((state) => state.user);
  const updateConversation = useStore((state) => state.updateConversation);
  const addNotification = useStore((state) => state.addNotification);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(vendorId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current conversation and business
  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );
  const currentBusiness = currentConversation
    ? businesses.find((b) => b.id === currentConversation.businessId)
    : null;

  // Get messages for current conversation (in a real app, this would be fetched from API)
  const [messages, setMessages] = useState(
    currentConversation?.lastMessage ? [currentConversation.lastMessage] : []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (messageText: string) => {
    if (!selectedConversation || !currentConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user?.id || "1",
      senderName: user?.name || "You",
      senderType: "buyer" as const,
      receiverId: currentConversation.sellerId || "1",
      message: messageText,
      timestamp: new Date().toISOString(),
      read: false,
      type: "text" as const,
    };

    // Update local messages
    setMessages([...messages, newMessage]);

    // Update conversation in store
    const updatedConversation = {
      ...currentConversation,
      lastMessage: newMessage,
      updatedAt: new Date().toISOString(),
      unreadCount: 0, // Reset unread count when user sends a message
    };

    updateConversation(updatedConversation);

    // Add notification for the receiver (in a real app, this would be sent via WebSocket)
    addNotification({
      id: Date.now().toString(),
      userId: currentConversation.sellerId || "1",
      type: "message",
      title: "New Message",
      message: `${user?.name || "Someone"} sent you a message`,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/chat/${currentConversation.id}`,
    });
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation?.lastMessage) {
      setMessages([conversation.lastMessage]);
    } else {
      setMessages([]);
    }
  };

  if (!vendorId && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/buyer/home"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No conversations yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start chatting with sellers to see your conversations here
            </p>
            <Link
              to="/buyer/home"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Businesses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/buyer/home"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[600px] flex">
          {/* Conversations List */}
          {!vendorId && (
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onConversationSelect={handleConversationSelect}
              searchQuery={searchQuery}
              showSearch={showSearch}
              onSearchToggle={() => setShowSearch(!showSearch)}
              onSearchChange={setSearchQuery}
            />
          )}

          {/* Chat Area */}
          <div className={`${vendorId ? "w-full" : "flex-1"} flex flex-col`}>
            {currentConversation && currentBusiness ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentBusiness.logo}
                      alt={currentBusiness.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {currentBusiness.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentBusiness.responseTime
                          ? `Usually responds in ${currentBusiness.responseTime}`
                          : "Online"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentBusiness.phone && (
                      <a
                        href={`tel:${currentBusiness.phone}`}
                        className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                        title="Call business"
                        aria-label="Call business"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                    )}
                    <button
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="More options"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm">
                          Start a conversation with {currentBusiness?.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isConsecutive =
                        index > 0 &&
                        messages[index - 1].senderType === msg.senderType &&
                        new Date(msg.timestamp).getTime() -
                          new Date(messages[index - 1].timestamp).getTime() <
                          5 * 60 * 1000; // 5 minutes

                      return (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isConsecutive={isConsecutive}
                          businessLogo={currentBusiness?.logo}
                        />
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={!currentConversation}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
