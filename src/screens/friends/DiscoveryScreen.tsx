import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, Alert } from 'react-native';
import { FriendCard } from './components/FriendCard';
import { ThemedInput } from '@/components/shared/ThemedInput';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useFriend } from '@/hooks/use-friend';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useChatContext } from '@/providers/chat-provider';
import { navigate } from '@/navigation/navigationRef';
import { Search } from 'lucide-react-native';

export function DiscoveryScreen() {
  const [search, setSearch] = useState('');
  const { profiles, fetchProfiles, loading } = useUserProfile();
  const { postFriendRequest } = useFriend();
  const { profile: me } = useUserProfileContext();
  const { findOrCreateChat, refreshConversations } = useChatContext();
  // Track which user IDs have an in-flight request to prevent double-taps
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  // Load initial results
  useEffect(() => {
    fetchProfiles("");
  }, [fetchProfiles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfiles(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchProfiles]);

  const handleAddFriend = async (userId: string, userName: string) => {
    if (pendingIds.has(userId)) return; // prevent double-tap
    setPendingIds(prev => new Set(prev).add(userId));
    try {
      await postFriendRequest(null, me?.id || null, { receiverId: userId });
      Alert.alert("Success", "Friend request sent!");
    } catch (err: any) {
      console.error("Failed to add friend:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to send friend request.";
      
      // Auto-create and navigate to chat if friendship exists
      if (msg.toLowerCase().includes("friendship already exists")) {
        try {
          const chatId = await findOrCreateChat(userId);
          refreshConversations();
          Alert.alert("Already Friends", "You're already friends! Redirecting to chat...");
          navigate('ChatDetail', { conversationId: chatId, title: userName });
        } catch (chatErr) {
          console.error("Failed to jump to chat:", chatErr);
          Alert.alert("Error", "Friendship exists, but could not open chat.");
        }
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  // Filter out self
  const filteredProfiles = profiles.filter(p => p.id !== me?.id);

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <ThemedInput
        placeholder="Search username, name, or email..."
        value={search}
        onChangeText={setSearch}
        leftIcon={<Search size={20} color="#888" />}
        className="mb-4"
      />

      {loading && profiles.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#34B77B" />
        </View>
      ) : (
        <FlatList
          data={filteredProfiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendCard 
              friendId={item.id} 
              type="discovery"
              actionLoading={pendingIds.has(item.id)}
              onActionPress={(action) => {
                if (action === 'add') handleAddFriend(item.id, item.name || "Friend");
              }}
            />
          )}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-muted-foreground">No users found matching your search.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
