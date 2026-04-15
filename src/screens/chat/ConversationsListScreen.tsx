import React from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatContext } from '@/providers/chat-provider';
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { ConversationItem } from './ConversationItem';

export function ConversationsListScreen() {
  const { conversations, loading, refreshConversations } = useChatContext();
  const { profile } = useUserProfileContext();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-3xl font-bold text-foreground">Messages</Text>
      </View>
      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            id={item.id}
            imageUrl={item.avatar || ""}
            username={item.name}
            newestMessageId={item.newestMessageId}
            currentUserId={profile?.id}
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshConversations} 
            tintColor="#34B77B" 
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-muted-foreground text-lg">No conversations yet.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
