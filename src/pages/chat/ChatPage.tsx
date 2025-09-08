import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Image, Paperclip, Phone, MoreVertical } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockConversations, mockMessages, mockBusinesses } from '../../data/mockData';

export default function ChatPage() {
  const { vendorId } = useParams<{ vendorId?: string }>();
  const { state } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(vendorId || null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = mockConversations;
  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentBusiness = currentConversation ? mockBusinesses.find(b => b.id === currentConversation.businessId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: state.user?.id || '1',
      senderName: state.user?.name || 'You',
      senderType: 'buyer' as const,
      receiverId: currentConversation?.sellerId || '1',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text' as const
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  if (!vendorId && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Link
            to="/buyer/home"
            className="hidden sm:flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No conversations yet</h2>
            <p className="text-gray-600 mb-6">Start chatting with sellers to see your conversations here</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          to="/buyer/home"
          className="hidden sm:flex items-center text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex h-[75vh] sm:h-[600px]">
          {/* Conversations List */}
          {!vendorId && (
            <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 border-r border-gray-200 flex-col`}>
              <div className="p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-3 sm:p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversation.businessLogo}
                        alt={conversation.businessName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{conversation.businessName}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.message || 'No messages yet'}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className={`${vendorId ? 'w-full' : 'flex-1'} flex flex-col`}>
            {currentConversation && currentBusiness ? (
              <>
                {/* Chat Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center space-x-3">
                    {!vendorId && (
                      <button
                        className="mr-1 lg:hidden p-2 -ml-2 text-gray-600 hover:text-green-600"
                        onClick={() => setSelectedConversation(null)}
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                    )}
                    <img
                      src={currentBusiness.logo}
                      alt={currentBusiness.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{currentBusiness.name}</h3>
                      <p className="text-sm text-gray-600">
                        {currentBusiness.responseTime ? `Usually responds in ${currentBusiness.responseTime}` : 'Online'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentBusiness.phone && (
                      <a
                        href={`tel:${currentBusiness.phone}`}
                        className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                      </a>
                    )}
                    <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 no-scrollbar bg-gray-50/50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'buyer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                          msg.senderType === 'buyer'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-[10px] sm:text-xs mt-1 ${
                          msg.senderType === 'buyer' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Image className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className={`p-2 rounded-full transition-colors ${
                        message.trim()
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}