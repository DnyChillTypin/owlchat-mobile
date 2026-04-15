import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ChatHeader } from './components/ChatHeader';
import { ChatBody } from './components/ChatBody';
import { ChatInput } from './components/ChatInput';
import { useMessageUser } from '@/hooks/use-chat-message-user';
import { useChatUser } from '@/hooks/use-chat-user';
import { useChatMemberUser } from '@/hooks/use-chat-member-user';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useWebSocket } from '@/providers/websocket-provider';
import { MessageType } from '@/types/enum/mesage-type';
import { messageUserService } from '@/services/message-user-service';
import { secureStorage } from '@/lib/secure-storage';

export function ConversationDetailScreen() {
  const route = useRoute<any>();
  const { conversationId, title: initialTitle } = route.params;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [replyingToMessage, setReplyingToMessage] = useState<any | null>(null);
  const [chatMetadata, setChatMetadata] = useState<{
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }>({ name: initialTitle || "Chat" });

  const {
    messages,
    setMessages,
    loading,
    getMessagesByChatId,
    postNewTextMessage,
    postNewFileMessage,
    softDeleteMessage,
  } = useMessageUser();

  const { profile } = useUserProfileContext();
  const { getChatByChatId } = useChatUser();
  const { getChatMembersByChatId } = useChatMemberUser();
  const { isConnected, sendMessage, subscribeToTopic } = useWebSocket();

  // 1. WebSocket Subscription
  useEffect(() => {
    if (!conversationId || !isConnected) return;

    // The backend topic is /topic/chat/{chatId}
    const topic = `/topic/chat/${conversationId}`;
    console.log("Subscribing to topic:", topic);

    return subscribeToTopic(topic, (notification) => {
      // The backend sends a NotificationDto { type, action, data }
      // The actual message is in notification.data
      const message = notification.data || notification;
      
      setMessages((prev) => {
        // Prevent duplicate messages (since we also add optimistically in REST hook)
        if (prev.find((m) => m.id === message.id)) return prev;
        return [message, ...prev];
      });
    });
  }, [conversationId, isConnected, subscribeToTopic]);

  // 2. Fetch Chat Metadata
  useEffect(() => {
    const initChat = async () => {
      try {
        const chat = await getChatByChatId(null, null, conversationId);
        if (chat.type === 'PRIVATE') {
          const membersResp = await getChatMembersByChatId(null, null, conversationId);
          const members = membersResp.content || membersResp;
          if (Array.isArray(members)) {
            const other = members.find(m => (m.memberId || m.userId || m.id) !== profile?.id);
            if (other) {
              setChatMetadata({
                name: other.nickname || other.memberName || chat.name,
                avatar: other.memberAvatar || chat.avatar,
                isOnline: true,
              });
              return;
            }
          }
        }
        setChatMetadata({
          name: chat.name,
          avatar: chat.avatar,
          isOnline: chat.status,
        });
      } catch (err) {
        console.error("Failed to fetch chat context:", err);
      }
    };
    if (profile?.id) initChat();
  }, [conversationId, profile?.id]);

  // 3. Pagination & Fetching
  const fetchMessages = useCallback(async (targetPage: number) => {
    try {
      const size = 20;
      const data = await getMessagesByChatId(null, null, conversationId, "", targetPage, size);
      if (data && data.length < size) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [conversationId, getMessagesByChatId]);

  useEffect(() => {
    const loadCachedAndFetch = async () => {
      try {
        const cached = await secureStorage.getItem(`messages_${conversationId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed) && parsed.length > 0) {
            // Optimistically load cached messages if we don't have any yet
            setMessages(prev => prev.length === 0 ? parsed : prev);
          }
        }
      } catch (e) {
        console.error("Failed to parse cached messages", e);
      }
      
      // Always fetch fresh data to sync
      fetchMessages(0);
    };

    if (conversationId) {
      loadCachedAndFetch();
    }
  }, [conversationId, fetchMessages]);

  // Persist messages to cache whenever they update
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      // Keep ONLY the latest 50 messages in offline cache to prevent bloat
      const snapshot = messages.slice(0, 50);
      secureStorage.setItem(`messages_${conversationId}`, JSON.stringify(snapshot))
        .catch(e => console.error("Failed to cache messages", e));
    }
  }, [messages, conversationId]);

  const onLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // If replying, construct a quoted text payload as fallback structure
    const replyPrefix = replyingToMessage 
      ? `> Replying to: ${replyingToMessage.content || "Attachment"}\n\n` 
      : "";
    const finalContent = `${replyPrefix}${content.trim()}`;

    try {
        await messageUserService.postNewTextMessage(null, null, {
            chatId: conversationId,
            content: finalContent
        });
        setReplyingToMessage(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleDeleteMessage = async (message: any) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message for everyone?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await softDeleteMessage(null, null, message.id);
            } catch (err) {
              Alert.alert("Error", "Could not delete message");
            }
          }
        }
      ]
    );
  };

  const handleSendFile = async (file: any, type: MessageType) => {
    try {
      await postNewFileMessage(null, null, conversationId, type, file);
      setReplyingToMessage(null);
    } catch (err) {
      console.error("Failed to send file:", err);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ChatHeader 
        imageUrl={chatMetadata.avatar} 
        name={chatMetadata.name} 
        isOnline={chatMetadata.isOnline && isConnected} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ChatBody 
          messages={messages} 
          currentUserId={profile?.id} 
          onLoadMore={onLoadMore}
          isLoadingMore={loading && page > 0}
          otherUserName={chatMetadata.name}
          otherUserImage={chatMetadata.avatar}
          onReply={(msg) => setReplyingToMessage(msg)}
          onDelete={handleDeleteMessage}
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onSendFile={handleSendFile}
          replyingTo={replyingToMessage}
          onCancelReply={() => setReplyingToMessage(null)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
