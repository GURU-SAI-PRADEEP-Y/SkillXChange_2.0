import React, { useState } from 'react';
import { ConversationList } from '../chat/ConversationList';
import { ChatWindow } from '../chat/ChatWindow';

export function ChatList() {
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-r">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Conversations</h2>
        </div>
        <ConversationList
          onSelectConversation={(id, name) => setSelectedUser({ id, name })}
          selectedUserId={selectedUser?.id}
        />
      </div>
      <div className="col-span-2">
        {selectedUser ? (
          <ChatWindow
            recipientId={selectedUser.id}
            recipientName={selectedUser.name}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}