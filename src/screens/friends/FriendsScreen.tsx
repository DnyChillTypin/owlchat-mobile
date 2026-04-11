import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FriendCard } from './components/FriendCard';
import { useFriendship } from '@/hooks/use-friendship';
import { useFriend } from '@/hooks/use-friend';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useNavigation } from '@react-navigation/native';

type Tab = 'friends' | 'requests' | 'discovery';

export function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const navigation = useNavigation<any>();
  const { friendships, loading: listLoading, fetchFriendships } = useFriendship();
  const { getReceiveFriendRequests, loading: reqLoading } = useFriend();
  const [requests, setRequests] = useState<any[]>([]);
  const { profile } = useUserProfileContext();

  const loadData = useCallback(async () => {
    if (activeTab === 'friends') {
      fetchFriendships();
    } else if (activeTab === 'requests') {
      const data = await getReceiveFriendRequests(null, null, 0, 20);
      setRequests(data || []);
    }
  }, [activeTab, fetchFriendships, getReceiveFriendRequests]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderContent = () => {
    if (listLoading || reqLoading) {
      return (
        <View className="flex-1 justify-center items-center pt-20">
          <ActivityIndicator size="large" color="#34B77B" />
        </View>
      );
    }

    if (activeTab === 'friends') {
      return (
        <FlatList
          data={friendships}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const friendId = item.firstUserId === profile?.id ? item.secondUserId : item.firstUserId;
            return (
              <FriendCard 
                friendId={friendId} 
                onMessagePress={() => navigation.navigate('ChatDetail', { conversationId: item.chatId, title: "Chat" })}
              />
            );
          }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-muted-foreground">No friends found.</Text>
            </View>
          }
          className="px-4"
        />
      );
    }

    if (activeTab === 'requests') {
       return (
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
           className="px-4"
         />
       );
    }

    return (
      <View className="items-center py-20">
        <Text className="text-muted-foreground text-center px-10">
          Search and Discovery features are currently focused on management.
        </Text>
      </View>
    );
  };

  const tabs: { label: string; id: Tab }[] = [
    { label: 'Friends', id: 'friends' },
    { label: 'Requests', id: 'requests' },
    { label: 'Discovery', id: 'discovery' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-4 mb-4">
        <Text className="text-3xl font-bold text-foreground mb-4">Wisdom Hub</Text>
        <View className="flex-row bg-muted rounded-xl p-1">
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab.id}
              className={`flex-1 py-3 rounded-lg ${activeTab === tab.id ? 'bg-card shadow-sm' : ''}`}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text className={`text-center font-bold text-sm ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {renderContent()}
    </SafeAreaView>
  );
}
