import React from 'react';
import { X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

interface FloatingChatWindowProps {
  recipientId: string;
  recipientName: string;
  onClose: () => void;
}

export function FloatingChatWindow({ recipientId, recipientName, onClose }: FloatingChatWindowProps) {
  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] shadow-2xl rounded-lg overflow-hidden z-50 bg-white">
      <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white">
        <h3 className="font-semibold">{recipientName}</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-indigo-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[calc(100%-4rem)]">
        <ChatWindow recipientId={recipientId} recipientName={recipientName} />
      </div>
    </div>
  );
}