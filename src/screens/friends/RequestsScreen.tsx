import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FriendCard } from './components/FriendCard';
import { useFriend } from '@/hooks/use-friend';
import { useSocialNotification } from '@/providers/social-notification-provider';
import { useTheme } from '@/providers/theme-provider';
import { useUserProfileContext } from '@/providers/user-profile-provider';

const Tab = createMaterialTopTabNavigator();

function ReceivedRequestsTab() {
  const { profile } = useUserProfileContext();
  const { getReceiveFriendRequests, patchFriendRequestStatus } = useFriend();
  const { subscribeToSocial, isConnected } = useSocialNotification();
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  // Track which request IDs are currently being accepted/rejected
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getReceiveFriendRequests(null, profile?.id, 0, 20, false, undefined, 'PENDING');
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load received requests:", err);
    } finally {
      setLoadingList(false);
    }
  }, [getReceiveFriendRequests, profile?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  React.useEffect(() => {
    if (isConnected && profile?.id) {
      console.log("[ReceivedRequestsTab] Subscribing to real-time updates");
      const sub = subscribeToSocial(
        `/user/${profile.id}/queue/friend-request`,
        () => {
          loadData();
        }
      );
      return () => sub?.unsubscribe();
    }
  }, [isConnected, profile?.id, subscribeToSocial, loadData]);

  const handleResponse = async (requestId: string, response: 'ACCEPTED' | 'REJECTED') => {
    if (pendingIds.has(requestId)) return; // prevent double-tap
    setPendingIds(prev => new Set(prev).add(requestId));
    try {
      await patchFriendRequestStatus(null, profile?.id || null, requestId, { response });
      // Optimistically remove from list
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      console.error("Failed to respond to request:", err);
      const msg = err?.response?.data?.message || err?.message || "Action failed.";
      Alert.alert("Error", msg);
      await loadData(); // Refresh to sync state
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  if (loadingList && requests.length === 0) {
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
            actionLoading={pendingIds.has(item.id)}
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
  const { getSendFriendRequests, deleteFriendRequest } = useFriend();
  const { subscribeToSocial, isConnected } = useSocialNotification();
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  // Track which request IDs are being cancelled
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getSendFriendRequests(null, profile?.id, 0, 20, false, undefined, 'PENDING');
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load sent requests:", err);
    } finally {
      setLoadingList(false);
    }
  }, [getSendFriendRequests, profile?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  React.useEffect(() => {
    if (isConnected && profile?.id) {
      console.log("[SentRequestsTab] Subscribing to real-time updates");
      const sub = subscribeToSocial(
        `/user/${profile.id}/queue/friend-request`,
        () => {
          loadData();
        }
      );
      return () => sub?.unsubscribe();
    }
  }, [isConnected, profile?.id, subscribeToSocial, loadData]);

  const handleCancel = async (requestId: string) => {
    if (pendingIds.has(requestId)) return; // prevent double-tap
    setPendingIds(prev => new Set(prev).add(requestId));
    try {
      await deleteFriendRequest(null, profile?.id || null, requestId);
      // Optimistically remove from list
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      console.error("Failed to cancel request:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to cancel request.";
      Alert.alert("Error", msg);
      await loadData(); // Refresh to sync state
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  if (loadingList && requests.length === 0) {
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
            actionLoading={pendingIds.has(item.id)}
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
        // Disable animation to prevent Reanimated "reading .value during render" warning
        // from nested animated tab navigators
        animationEnabled: false,
      }}
    >
      <Tab.Screen name="Received" component={ReceivedRequestsTab} />
      <Tab.Screen name="Sent" component={SentRequestsTab} />
    </Tab.Navigator>
  );
}
