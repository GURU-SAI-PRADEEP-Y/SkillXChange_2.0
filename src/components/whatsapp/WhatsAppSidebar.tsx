import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WhatsAppSidebarProps {
  onSelectChat: (chat: { id: string; name: string }) => void;
}

interface ChatUser {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
}

export function WhatsAppSidebar({ onSelectChat }: WhatsAppSidebarProps) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    const subscription = subscribeToMessages();
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, get all unique users who have either sent or received messages
      const { data: uniqueUsers, error: usersError } = await supabase
        .from('messages')
        .select(`
          distinct_users:sender_id,
          sender:profiles!messages_sender_id_fkey(
            id,
            full_name
          )
        `)
        .or(`sender_id.neq.${user.id},recipient_id.eq.${user.id}`);

      if (usersError) throw usersError;

      // Get the latest message for each unique conversation
      const userMap = new Map<string, ChatUser>();

      for (const uniqueUser of uniqueUsers || []) {
        if (!uniqueUser.sender) continue;
        const otherUserId = uniqueUser.sender.id;
        
        // Skip if it's the current user
        if (otherUserId === user.id) continue;

        // Get the latest message for this conversation
        const { data: latestMessage, error: messageError } = await supabase
          .from('messages')
          .select(`
            content,
            created_at,
            sender:profiles!messages_sender_id_fkey(
              id,
              full_name
            )
          `)
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (messageError) continue;

        if (latestMessage) {
          userMap.set(otherUserId, {
            id: otherUserId,
            full_name: uniqueUser.sender.full_name,
            last_message: latestMessage.content,
            last_message_time: latestMessage.created_at
          });
        }
      }

      setUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error('Error loading users:', error);
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
        loadUsers();
      })
      .subscribe();
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f0f2f5]">
        <h1 className="text-xl font-semibold">Chats</h1>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[#f0f2f5] rounded-lg border-0 focus:ring-0"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectChat({ id: user.id, name: user.full_name })}
                className="w-full px-4 py-3 flex items-start hover:bg-[#f0f2f5] transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-gray-300 flex-shrink-0">
                  {/* Avatar placeholder */}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {user.full_name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(user.last_message_time), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}