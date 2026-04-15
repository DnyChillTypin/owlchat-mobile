import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { FriendCard } from './components/FriendCard';
import { useFriendship } from '@/hooks/use-friendship';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useChatContext } from '@/providers/chat-provider';
import { navigate } from '@/navigation/navigationRef';

export function FriendsScreen() {
  const { profile } = useUserProfileContext();
  const { friendships, loading, fetchFriendships, deleteFriendship } = useFriendship(null, profile?.id);
  const { findOrCreateChat } = useChatContext();
  const [chatLoading, setChatLoading] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchFriendships();
    }
  }, [fetchFriendships, profile?.id]);

  const handleMessage = async (friendId: string, name: string) => {
    setChatLoading(friendId);
    try {
      const chatId = await findOrCreateChat(friendId);
      navigate('ChatDetail', { conversationId: chatId, title: name });
    } catch (err) {
      console.error("Failed to open chat:", err);
      Alert.alert("Error", "Could not open chat with this user.");
    } finally {
      setChatLoading(null);
    }
  };

  const handleUnfriend = async (friendshipId: string) => {
    Alert.alert(
      "Unfriend",
      "Are you sure you want to remove this friend?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Unfriend", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFriendship(friendshipId);
            } catch (err) {
              console.error("Failed to unfriend:", err);
            }
          }
        }
      ]
    );
  };

  if (loading && friendships.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#34B77B" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={friendships}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const friendId = item.firstUserId === profile?.id ? item.secondUserId : item.firstUserId;
          return (
            <FriendCard 
              friendId={friendId} 
              type="friend"
              onMessagePress={() => handleMessage(friendId, "Friend")}
              onActionPress={(action) => {
                if (action === 'reject') handleUnfriend(item.id);
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No friends found.</Text>
          </View>
        }
        className="px-4 pt-4"
      />
    </View>
  );
}
