import React, { useState, useRef } from "react";
import { Send, Image, Paperclip } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message.trim());
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 128) + "px";
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex items-end space-x-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            title="Attach file"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            title="Send image"
            aria-label="Send image"
          >
            <Image className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[40px] max-h-32"
            rows={1}
            disabled={disabled}
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`p-2 rounded-lg transition-colors ${
            message.trim() && !disabled
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title="Send message"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{message.length}/1000</span>
      </div>
    </form>
  );
}
