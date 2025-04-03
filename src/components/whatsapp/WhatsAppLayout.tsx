import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { WhatsAppSidebar } from './WhatsAppSidebar';
import { WhatsAppChat } from './WhatsAppChat';

interface Conversation {
  userId: string;
  fullName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function WhatsAppLayout() {
  const [selectedChat, setSelectedChat] = useState<{ id: string; name: string } | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="h-full">
        {selectedChat ? (
          <WhatsAppChat
            recipientId={selectedChat.id}
            recipientName={selectedChat.name}
            onBack={() => setSelectedChat(null)}
            isMobile={true}
          />
        ) : (
          <WhatsAppSidebar onSelectChat={setSelectedChat} />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-[400px] border-r">
        <WhatsAppSidebar onSelectChat={setSelectedChat} />
      </div>
      <div className="flex-1">
        {selectedChat ? (
          <WhatsAppChat
            recipientId={selectedChat.id}
            recipientName={selectedChat.name}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-[#f0f2f5]">
            <div className="text-center text-gray-500">
              <p className="text-xl font-medium">WhatsApp Web</p>
              <p className="mt-2">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}