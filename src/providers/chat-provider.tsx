import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useChatUser } from '@/hooks/use-chat-user';
import { useUserProfileContext } from './user-profile-provider';
import { useWebSocket } from './websocket-provider';
import { Chat } from '@/types/chat.type';
import { chatUserService } from '@/services/chat-user-service';
import { secureStorage } from '@/lib/secure-storage';

interface ChatContextProps {
  conversations: Chat[];
  loading: boolean;
  refreshConversations: () => Promise<void>;
  findOrCreateChat: (otherMemberId: string) => Promise<string>;
  updateConversationPreview: (chatId: string, message: any) => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const { getChatsByMemberId, postChat } = useChatUser();
  const { profile } = useUserProfileContext();
  const { subscribeToTopic, isConnected } = useWebSocket();

  const fetchConversations = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const data = await getChatsByMemberId(null, profile.id, "", 0, 50, false);
      const chats = Array.isArray(data) ? data : (data.content || []);
      // Sort by updatedDate or newestMessageDate descending
      const sorted = [...chats].sort((a, b) => 
        new Date(b.updatedDate || b.newestMessageDate || 0).getTime() - 
        new Date(a.updatedDate || a.newestMessageDate || 0).getTime()
      );
      setConversations(sorted);
      await secureStorage.setItem(`chats_${profile.id}`, JSON.stringify(sorted));
    } catch (err) {
      console.error("Error fetching conversations in provider:", err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, getChatsByMemberId]);

  useEffect(() => {
    const loadCached = async () => {
      if (profile?.id) {
        const cached = await secureStorage.getItem(`chats_${profile.id}`);
        if (cached) {
          try {
            setConversations(JSON.parse(cached));
          } catch (e) {
            console.error("Failed to parse cached chats", e);
          }
        }
        fetchConversations();
      }
    };
    loadCached();
  }, [profile?.id, fetchConversations]);

  // Global WebSocket listener for chat notifications
  useEffect(() => {
    if (!profile?.id || !isConnected) return;

    // We assume /user/queue/chat exists for global notifications
    // Or we subscribe to all active chat topics
    const subs: any[] = [];
    
    // Fallback: subscribe to all currently known topics
    conversations.forEach(chat => {
      const sub = subscribeToTopic(`/topic/chat/${chat.id}`, (message) => {
        updateConversationPreview(chat.id, message);
      });
      subs.push(sub);
    });

    return () => {
      subs.forEach(s => s?.unsubscribe?.());
    };
  }, [profile?.id, isConnected, conversations.length]);

  const updateConversationPreview = useCallback((chatId: string, message: any) => {
    setConversations(prev => {
      const index = prev.findIndex(c => c.id === chatId);
      if (index === -1) {
        // If not in list, we might need to fetch the chat info or refresh
        fetchConversations();
        return prev;
      }

      const updatedChat = {
        ...prev[index],
        newestMessageId: message.id,
        newestMessageDate: message.sentDate,
        updatedDate: message.sentDate,
      };

      const newList = [...prev];
      newList.splice(index, 1);
      newList.unshift(updatedChat);
      return newList;
    });
  }, [fetchConversations]);

  const findOrCreateChat = async (otherMemberId: string): Promise<string> => {
    if (!profile?.id) throw new Error("Not authenticated");

    // Check if 1:1 chat already exists
    // (In a real app, you might have a dedicated endpoint for this)
    const existing = conversations.find(c => {
      // Very basic check - would need member list for accuracy
      return c.type === 'SINGLE' && c.name?.includes(otherMemberId); 
    });

    if (existing) return existing.id;

    // Create new chat
    try {
      const newChat = await postChat(null, profile.id, {
        name: `Chat with ${otherMemberId}`,
        chatMembersId: [profile.id, otherMemberId]
      });
      await fetchConversations();
      return newChat.id;
    } catch (err) {
      console.error("Error creating chat:", err);
      throw err;
    }
  };

  return (
    <ChatContext.Provider value={{ 
      conversations, 
      loading, 
      refreshConversations: fetchConversations,
      findOrCreateChat,
      updateConversationPreview
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within a ChatProvider");
  return context;
};
