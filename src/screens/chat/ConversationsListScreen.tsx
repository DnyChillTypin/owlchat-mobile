import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatUser } from "@/hooks/use-chat-user";
import { useUserProfileContext } from "@/providers/user-profile-provider";
import { ConversationItem } from './ConversationItem';

interface Conversation {
  id: string;
  avatar: string;
  name: string;
  type: string;
  newestMessageId?: string;
}

export function ConversationsListScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { getChatsByMemberId } = useChatUser();
  const { profile } = useUserProfileContext();

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getChatsByMemberId(null, null, "", 0, 20, false);
      setConversations(data.content || data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getChatsByMemberId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#34B77B" />
      </View>
    );
  }

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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#34B77B" />
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
