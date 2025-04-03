import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

interface ChatUser {
  id: string;
  full_name: string;
  username: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface ChatUserListProps {
  onSelectUser: (userId: string, userName: string) => void;
  selectedUserId?: string;
}

export function ChatUserList({ onSelectUser, selectedUserId }: ChatUserListProps) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatUsers();
    const subscription = subscribeToMessages();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadChatUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          content,
          created_at,
          sender:profiles!messages_sender_id_fkey(id, full_name, username),
          recipient:profiles!messages_recipient_id_fkey(id, full_name, username)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading messages:', error);
        setLoading(false);
        return;
      }

      if (messages) {
        const userMap = new Map<string, ChatUser>();
        
        messages.forEach((message: any) => {
          if (!message.sender || !message.recipient) return;
          
          const otherUser = message.sender.id === user.id ? message.recipient : message.sender;
          if (!otherUser || !otherUser.id) return;

          if (!userMap.has(otherUser.id)) {
            userMap.set(otherUser.id, {
              id: otherUser.id,
              full_name: otherUser.full_name || 'Unknown User',
              username: otherUser.username || 'unknown',
              last_message: message.content,
              last_message_time: message.created_at,
              unread_count: 0
            });
          }
        });

        setUsers(Array.from(userMap.values()));
      }
    } catch (error) {
      console.error('Error in loadChatUsers:', error);
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
        loadChatUsers();
      })
      .subscribe();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <MessageCircle className="h-12 w-12 mb-4" />
        <p className="text-center">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id, user.full_name)}
          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
            selectedUserId === user.id ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{user.full_name}</h3>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{user.last_message}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(user.last_message_time), { addSuffix: true })}
              </span>
              {user.unread_count > 0 && (
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.unread_count}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}