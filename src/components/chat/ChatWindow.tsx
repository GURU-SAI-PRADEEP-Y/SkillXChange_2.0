import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
}

export function ChatWindow({ recipientId, recipientName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

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

  useEffect(() => {
    loadMessages();
    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [recipientId, currentUserId]);

  const setupRealtimeSubscription = () => {
    if (!currentUserId) return;

    // Unsubscribe from existing subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    // Create new subscription
    const channel = supabase.channel(`chat:${currentUserId}-${recipientId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${recipientId}`,
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      })
      .subscribe();

    channelRef.current = channel;
  };

  const loadMessages = async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!sender_id(full_name)
      `)
      .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (data) {
      setMessages(data);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const sendMessage = async (content: string) => {
    if (!currentUserId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          recipient_id: recipientId,
          content: content.trim()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
            senderName={message.sender_id === currentUserId ? currentUserName : recipientName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}