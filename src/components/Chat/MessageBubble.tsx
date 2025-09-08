import React from "react";
import { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
  isConsecutive: boolean;
  businessLogo?: string;
}

export default function MessageBubble({
  message,
  isConsecutive,
  businessLogo,
}: MessageBubbleProps) {
  return (
    <div
      className={`flex ${
        message.senderType === "buyer" ? "justify-end" : "justify-start"
      } ${isConsecutive ? "mt-1" : "mt-4"}`}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
          message.senderType === "buyer"
            ? "flex-row-reverse space-x-reverse"
            : ""
        }`}
      >
        {!isConsecutive && (
          <img
            src={
              message.senderType === "buyer"
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    message.senderName
                  )}&background=10b981&color=fff`
                : businessLogo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    message.senderName
                  )}&background=6b7280&color=fff`
            }
            alt={message.senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        {isConsecutive && <div className="w-8" />}
        <div
          className={`px-4 py-2 rounded-lg ${
            message.senderType === "buyer"
              ? "bg-green-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          <p
            className={`text-xs mt-1 ${
              message.senderType === "buyer"
                ? "text-green-100"
                : "text-gray-500"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {message.read && message.senderType === "buyer" && (
              <span className="ml-1">✓</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
