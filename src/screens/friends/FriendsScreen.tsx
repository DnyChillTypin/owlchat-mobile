import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FriendCard } from './components/FriendCard';
import { useFriendship } from '@/hooks/use-friendship';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useChatContext } from '@/providers/chat-provider';
import { navigate } from '@/navigation/navigationRef';


export function FriendsScreen() {
  const { profile } = useUserProfileContext();
  const { friendships, loading, fetchFriendships, deleteFriendship } = useFriendship(null, profile?.id);
  const { findOrCreateChat, refreshConversations } = useChatContext();
  const [chatLoading, setChatLoading] = useState<string | null>(null);

  // Refresh every time this tab comes into focus (e.g. after accepting a friend request)
  useFocusEffect(
    useCallback(() => {
      if (profile?.id) {
        console.log("[FriendsScreen] Fetching friendships for:", profile.id);
        fetchFriendships().then(() => {
            console.log(`[FriendsScreen] Received ${friendships?.length} friendships.`);
        });
      }
    }, [fetchFriendships, profile?.id, friendships?.length])
  );

  const handleMessage = async (friendId: string, friendName: string) => {
    setChatLoading(friendId);
    try {
      const chatId = await findOrCreateChat(friendId);
      // Refresh chat list so the new conversation appears
      refreshConversations();
      navigate('ChatDetail', { conversationId: chatId, title: friendName });
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
              Alert.alert("Error", "Could not remove this friend.");
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
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => profile?.id && fetchFriendships()}
            tintColor="#34B77B"
          />
        }
        renderItem={({ item }) => {
          const friendId = item.firstUserId === profile?.id ? item.secondUserId : item.firstUserId;
          return (
            <FriendCard 
              friendId={friendId} 
              type="friend"
              actionLoading={chatLoading === friendId}
              onMessagePress={() => handleMessage(friendId, "Friend")}
              onActionPress={(action) => {
                if (action === 'reject') handleUnfriend(item.id);
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No friends yet. Add friends from the Discovery tab!</Text>
          </View>
        }
        className="px-4 pt-4"
      />
    </View>
  );
}
