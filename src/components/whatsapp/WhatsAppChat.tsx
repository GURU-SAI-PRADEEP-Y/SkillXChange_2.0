import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Send, Paperclip, Smile, MoreVertical, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface WhatsAppChatProps {
  recipientId: string;
  recipientName: string;
  onBack?: () => void;
  isMobile?: boolean;
}

export function WhatsAppChat({ recipientId, recipientName, onBack, isMobile }: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        await loadMessages();
      }
    };
    getUser();

    const channel = supabase.channel('messages')
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

    return () => {
      channel.unsubscribe();
    };
  }, [recipientId]);

  const loadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!sender_id(full_name)
      `)
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          recipient_id: recipientId,
          content: newMessage.trim()
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
      {/* Chat Header */}
      <div className="flex items-center px-4 py-3 bg-[#f0f2f5] border-b">
        {isMobile && (
          <button 
            onClick={onBack} 
            className="mr-2 p-2 hover:bg-gray-200 rounded-full"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{recipientName}</h2>
          <p className="text-sm text-gray-500">online</p>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#efeae2]"
        style={{ 
          backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
          backgroundSize: 'contain'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === currentUserId
                  ? 'bg-[#d9fdd3] text-gray-900'
                  : 'bg-white text-gray-900'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="px-4 py-3 bg-[#f0f2f5]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Smile className="h-6 w-6 text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <Paperclip className="h-6 w-6 text-gray-600" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-0 bg-white"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 hover:bg-gray-200 rounded-full disabled:opacity-50"
          >
            <Send className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </form>
    </div>
  );
}