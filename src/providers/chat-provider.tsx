import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useChatUser } from '@/hooks/use-chat-user';
import { useUserProfileContext } from './user-profile-provider';
import { useWebSocket } from './websocket-provider';
import { Chat } from '@/types/chat.type';
import { chatUserService } from '@/services/chat-user-service';
import chatMemberUserService from '@/services/chat-member-user-service';
import { secureStorage } from '@/lib/secure-storage';

interface ChatContextProps {
  conversations: Chat[];
  loading: boolean;
  refreshConversations: () => Promise<void>;
  findOrCreateChat: (otherMemberId: string) => Promise<string>;
  updateConversationPreview: (chatId: string, notification: any) => void;
  markChatAsReadLocally: (chatId: string) => void;
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
      // Sort: Newest activity (message or update) at the top
      const sorted = [...chats].sort((a, b) => {
        const normalizeDate = (d: any) => typeof d === 'string' ? d.replace(/(\.\d{3})\d+(Z)?$/, '$1$2') : d;
        const dateA = new Date(normalizeDate(a.newestMessageDate || a.updatedDate || a.createdDate || 0)).getTime();
        const dateB = new Date(normalizeDate(b.newestMessageDate || b.updatedDate || b.createdDate || 0)).getTime();
        return dateB - dateA;
      });
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
      const sub = subscribeToTopic(`/topic/chat.${chat.id}`, (message) => {
        updateConversationPreview(chat.id, message);
      });
      subs.push(sub);
    });

    return () => {
      subs.forEach(s => s?.unsubscribe?.());
    };
  }, [profile?.id, isConnected, conversations.length]);

  const updateConversationPreview = useCallback((chatId: string, notification: any) => {
    const action = notification.action || 'CREATED';
    const message = notification.data || notification;
    
    setConversations(prev => {
      const index = prev.findIndex(c => c.id === chatId);
      if (index === -1) {
        fetchConversations();
        return prev;
      }

      const currentChat = prev[index];
      let newUnreadCount = currentChat.unreadCount || 0;

      // Increment unread count only for NEW messages from OTHER users
      if (action === 'CREATED' && message.senderId !== profile?.id) {
          newUnreadCount += 1;
      }

      const updatedChat = {
        ...currentChat,
        newestMessageId: message.id,
        newestMessageDate: message.sentDate,
        updatedDate: message.sentDate,
        unreadCount: newUnreadCount,
      };

      const newList = [...prev];
      newList.splice(index, 1);
      newList.unshift(updatedChat);
      return newList;
    });
  }, [fetchConversations, profile?.id]);

  const markChatAsReadLocally = useCallback((chatId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === chatId ? { ...c, unreadCount: 0 } : c
    ));
  }, []);

  const findOrCreateChat = async (otherMemberId: string): Promise<string> => {
    if (!profile?.id) throw new Error("Not authenticated");

    // Search among existing PRIVATE chats to find one that already has this friend
    const privateChats = conversations.filter(c => c.type === 'PRIVATE');
    for (const chat of privateChats) {
      try {
        const membersData = await chatMemberUserService.getChatMembersByChatId(
          null, profile.id, chat.id, "", 0, 10, true
        );
        const members = Array.isArray(membersData) ? membersData : (membersData?.content || []);
        const memberIds: string[] = members.map((m: any) => m.memberId ?? m.userId ?? m.id);
        if (memberIds.includes(otherMemberId) && memberIds.includes(profile.id)) {
          return chat.id;
        }
      } catch {
        // If member lookup fails, skip this chat and check the next
      }
    }

    // No existing 1:1 chat found — create a new one
    try {
      const newChat = await chatUserService.postChat(null, profile.id, {
        name: ``,
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
      updateConversationPreview,
      markChatAsReadLocally
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
