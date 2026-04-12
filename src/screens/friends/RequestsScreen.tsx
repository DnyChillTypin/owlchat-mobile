import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { FriendCard } from './components/FriendCard';
import { useFriend } from '@/hooks/use-friend';

export function RequestsScreen() {
  const { getReceiveFriendRequests, loading } = useFriend();
  const [requests, setRequests] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const data = await getReceiveFriendRequests(null, null, 0, 20);
    setRequests(data || []);
  }, [getReceiveFriendRequests]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendCard 
            friendId={item.senderId} 
            onMessagePress={() => {}} // Could be Accept/Decline in future
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No pending requests.</Text>
          </View>
        }
        className="px-4 pt-4"
      />
    </View>
  );
}
