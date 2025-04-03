import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { useConversations } from '../../hooks/useConversations';

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

export function ConversationList({ onSelectConversation, selectedUserId }: ConversationListProps) {
  const { conversations, loading, error } = useConversations();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p>Failed to load conversations: {error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <MessageCircle className="h-12 w-12 mb-4" />
        <p className="text-center">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <button
          key={conversation.userId}
          onClick={() => onSelectConversation(conversation.userId, conversation.fullName)}
          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
            selectedUserId === conversation.userId ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{conversation.fullName}</h3>
              <p className="text-sm text-gray-500">@{conversation.username}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {conversation.lastMessage}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
              </span>
              {conversation.unreadCount > 0 && (
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}