import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FileText, Download, Play, Clock } from 'lucide-react-native';
import { Avatar } from '@/components/shared/Avatar';
import { ChatBubble } from '@/components/shared/ChatBubble';
import { Message } from '@/types/message.type';

interface ChatBodyProps {
  messages: Message[];
  currentUserId?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  otherUserName?: string;
  otherUserImage?: string;
}

export function ChatBody({ 
  messages, 
  currentUserId, 
  onLoadMore, 
  isLoadingMore,
  otherUserName,
  otherUserImage 
}: ChatBodyProps) {

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isMe = message.senderId === currentUserId;
    
    return (
      <ChatBubble 
         message={message} 
         isMe={isMe} 
         otherUserAvatar={otherUserImage} 
         otherUserName={otherUserName} 
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted // Newest messages at bottom
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator size="small" color="#34B77B" className="py-4" /> : null
        }
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}
