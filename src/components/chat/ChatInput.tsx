import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, placeholder = 'Type a message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}