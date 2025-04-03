import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderName: string;
}

export function ChatMessage({ content, timestamp, isOwn, senderName }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn
            ? 'bg-gray-100 text-gray-900 rounded-bl-none'
            : 'bg-blue-500 text-white rounded-br-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${isOwn ? 'text-gray-600' : 'text-blue-50'}`}>
            {senderName}
          </span>
        </div>
        <p className="break-words">{content}</p>
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${isOwn ? 'text-gray-500' : 'text-blue-50'}`}>
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}