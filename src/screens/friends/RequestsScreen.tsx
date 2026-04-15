import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FriendCard } from './components/FriendCard';
import { useFriend } from '@/hooks/use-friend';
import { useTheme } from '@/providers/theme-provider';
import { useUserProfileContext } from '@/providers/user-profile-provider';

const Tab = createMaterialTopTabNavigator();

function ReceivedRequestsTab() {
  const { profile } = useUserProfileContext();
  const { getReceiveFriendRequests, patchFriendRequestStatus, loading } = useFriend();
  const [requests, setRequests] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await getReceiveFriendRequests(null, profile?.id, 0, 20);
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load received requests:", err);
    }
  }, [getReceiveFriendRequests, profile?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResponse = async (requestId: string, response: 'ACCEPTED' | 'REJECTED') => {
    try {
      await patchFriendRequestStatus(null, profile?.id || null, requestId, { response });
      loadData();
    } catch (err) {
      console.error("Failed to respond to request:", err);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator color="#34B77B" />
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
            type="incoming"
            onActionPress={(action) => {
              if (action === 'accept') handleResponse(item.id, 'ACCEPTED');
              if (action === 'reject') handleResponse(item.id, 'REJECTED');
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No incoming requests.</Text>
          </View>
        }
        className="px-4 pt-4"
      />
    </View>
  );
}

function SentRequestsTab() {
  const { profile } = useUserProfileContext();
  const { getSendFriendRequests, deleteFriendRequest, loading } = useFriend();
  const [requests, setRequests] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await getSendFriendRequests(null, profile?.id, 0, 20);
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load sent requests:", err);
    }
  }, [getSendFriendRequests, profile?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancel = async (requestId: string) => {
    try {
      await deleteFriendRequest(null, profile?.id || null, requestId);
      loadData();
    } catch (err) {
      console.error("Failed to cancel request:", err);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator color="#34B77B" />
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
            friendId={item.receiverId} 
            type="sent"
            onActionPress={(action) => {
              if (action === 'cancel') handleCancel(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-muted-foreground">No sent requests.</Text>
          </View>
        }
        className="px-4 pt-4"
      />
    </View>
  );
}

export function RequestsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#34B77B',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
        tabBarIndicatorStyle: { backgroundColor: '#34B77B', height: 2 },
        tabBarStyle: { 
          backgroundColor: isDark ? '#0A0A0A' : '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#222' : '#eee',
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '700', textTransform: 'none' },
      }}
    >
      <Tab.Screen name="Received" component={ReceivedRequestsTab} />
      <Tab.Screen name="Sent" component={SentRequestsTab} />
    </Tab.Navigator>
  );
}
