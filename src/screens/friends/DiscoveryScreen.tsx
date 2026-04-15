import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, Alert } from 'react-native';
import { FriendCard } from './components/FriendCard';
import { ThemedInput } from '@/components/shared/ThemedInput';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useFriend } from '@/hooks/use-friend';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { Search } from 'lucide-react-native';

export function DiscoveryScreen() {
  const [search, setSearch] = useState('');
  const { profiles, fetchProfiles, loading } = useUserProfile();
  const { postFriendRequest } = useFriend();
  const { profile: me } = useUserProfileContext();

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

  const handleAddFriend = async (userId: string) => {
    try {
      await postFriendRequest(null, me?.id || null, { receiverId: userId });
      // Refresh to update potential status if we implement status check in card
      // For now, simpler to just show success
      Alert.alert("Success", "Friend request sent!");
    } catch (err) {
      console.error("Failed to add friend:", err);
    }
  };

  // Filter out self
  const filteredProfiles = profiles.filter(p => p.id !== me?.id);

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <ThemedInput
        placeholder="Search people..."
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
              onActionPress={(action) => {
                if (action === 'add') handleAddFriend(item.id);
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
