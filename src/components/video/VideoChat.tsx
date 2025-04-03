import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ChatMessage } from '../chat/ChatMessage';
import { ChatInput } from '../chat/ChatInput';

interface VideoChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

interface VideoChatProps {
  recipientId: string;
  recipientName: string;
}

export function VideoChat({ recipientId, recipientName }: VideoChatProps) {
  const [messages, setMessages] = useState<VideoChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (data) {
          setCurrentUserName(data.full_name);
        }
      }
    };
    getUser();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string) => {
    if (!currentUserId || !currentUserName) return;

    const newMessage: VideoChatMessage = {
      id: crypto.randomUUID(),
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
      sender_name: currentUserName
    };

    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            timestamp={message.created_at}
            isOwn={message.sender_id === currentUserId}
            senderName={message.sender_name}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={sendMessage} placeholder="Type a message..." />
    </div>
  );
}