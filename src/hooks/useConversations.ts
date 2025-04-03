import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Conversation {
  userId: string;
  fullName: string;
  username: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
    const subscription = subscribeToMessages();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get all messages for the current mentor
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          sender:profiles!messages_sender_id_fkey (
            id,
            full_name,
            username
          )
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by sender and get the latest message for each
      const conversationMap = new Map<string, Conversation>();
      
      messages?.forEach((message) => {
        if (!message.sender) return;
        
        const senderId = message.sender_id;
        if (!conversationMap.has(senderId)) {
          conversationMap.set(senderId, {
            userId: senderId,
            fullName: message.sender.full_name || 'Unknown User',
            username: message.sender.username || 'unknown',
            lastMessage: message.content,
            lastMessageTime: message.created_at,
            unreadCount: 0 // You can implement unread count logic here
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    return supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages'
      }, () => {
        loadConversations();
      })
      .subscribe();
  };

  return { conversations, loading, error, refresh: loadConversations };
}