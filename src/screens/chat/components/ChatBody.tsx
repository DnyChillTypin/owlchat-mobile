import React, { useEffect, useRef } from 'react';
import { View, FlatList, Animated } from 'react-native';
import { ChatBubble } from '@/components/shared/ChatBubble';
import { Message } from '@/types/message.type';

interface ChatBodyProps {
  messages: Message[];
  currentUserId?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  otherUserName?: string;
  otherUserImage?: string;
  onReply?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

const MessageSkeleton = () => {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View style={{ opacity: pulseAnim }} className="w-full px-4 py-2 space-y-4">
      {/* Left side mock message */}
      <View className="flex-row items-end justify-start">
        <View className="w-8 h-8 rounded-full bg-muted mr-2" />
        <View className="bg-muted rounded-2xl rounded-bl-sm w-48 h-12" />
      </View>
      
      {/* Right side mock message */}
      <View className="flex-row justify-end mt-4">
        <View className="bg-primary/20 rounded-2xl rounded-br-sm w-32 h-10" />
      </View>
    </Animated.View>
  );
};

export function ChatBody({ 
  messages, 
  currentUserId, 
  onLoadMore, 
  isLoadingMore,
  otherUserName,
  otherUserImage,
  onReply,
  onDelete
}: ChatBodyProps) {

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isMe = message.senderId === currentUserId;
    
    return (
      <ChatBubble 
         message={message} 
         isMe={isMe} 
         otherUserAvatar={otherUserImage} 
         otherUserName={otherUserName} 
         onReply={onReply}
         onDelete={onDelete}
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.id || (item as any)._id || index.toString()}
        renderItem={renderMessage}
        inverted // Newest messages at bottom
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? <MessageSkeleton /> : null}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}
