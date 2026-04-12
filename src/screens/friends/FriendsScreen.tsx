import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { FriendCard } from './components/FriendCard';
import { useFriendship } from '@/hooks/use-friendship';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { navigate } from '@/navigation/navigationRef';

export function FriendsScreen() {
  const { friendships, loading, fetchFriendships } = useFriendship();
  const { profile } = useUserProfileContext();

  useEffect(() => {
    fetchFriendships();
  }, [fetchFriendships]);

  if (loading) {
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
              onMessagePress={() => navigate('ChatDetail', { conversationId: '', title: "Chat" })}
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
