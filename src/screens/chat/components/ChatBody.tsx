import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FileText, Download, Play, Clock } from 'lucide-react-native';
import { Avatar } from '@/components/shared/Avatar';
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
      <View 
        className={`flex-row mb-4 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        {!isMe && (
          <Avatar 
            src={otherUserImage} 
            fallbackText={otherUserName} 
            size={32} 
            className="mr-2 self-end mb-1" 
          />
        )}
        
        <View 
          className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
            isMe 
              ? 'bg-primary rounded-br-none' 
              : 'bg-card border border-border rounded-bl-none'
          }`}
        >
          {message.type === 'TEXT' && (
            <Text className={`${isMe ? 'text-primary-foreground' : 'text-foreground'}`}>
              {message.content}
            </Text>
          )}

          {message.type === 'IMG' && (
            <Image 
              source={{ uri: message.content }} // Assuming the service provides a URL or we fix message loading logic
              className="w-64 h-48 rounded-lg"
              resizeMode="cover"
            />
          )}

          {message.type === 'VID' && (
            <View className="w-64 h-48 bg-black/10 rounded-lg items-center justify-center">
              <Play size={40} color="#fff" />
            </View>
          )}

          {message.type === 'GENERIC_FILE' && (
            <View className="flex-row items-center p-2 bg-background/10 rounded-lg">
              <FileText size={24} color={isMe ? "#fff" : "#888"} />
              <View className="ml-2 flex-1">
                <Text className={`text-xs font-bold truncate ${isMe ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {message.content || 'Document'}
                </Text>
              </View>
            </View>
          )}

          <View className={`mt-1 ${isMe ? 'items-end' : 'items-start'}`}>
            <Text className={`text-[9px] opacity-60 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              {new Date(message.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>
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
