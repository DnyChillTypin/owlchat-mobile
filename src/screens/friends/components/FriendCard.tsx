import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { Avatar } from '@/components/shared/Avatar';
import { ThemedButton } from '@/components/shared/ThemedButton';
import { useUserProfile } from '@/hooks/use-user-profile';
import { MessageSquare, User as UserIcon, MoreHorizontal } from 'lucide-react-native';

interface FriendCardProps {
  friendId: string;
  onMessagePress?: () => void;
  onProfilePress?: () => void;
}

export function FriendCard({ friendId, onMessagePress, onProfilePress }: FriendCardProps) {
  const { profile, fetchProfileById, loading } = useUserProfile();

  useEffect(() => {
    fetchProfileById(friendId);
  }, [friendId]);

  if (loading) {
    return (
      <ThemedCard className="mb-2 h-32 items-center justify-center">
        <Text className="text-muted-foreground">Loading profile...</Text>
      </ThemedCard>
    );
  }

  return (
    <ThemedCard className="mb-3 p-4">
      <View className="flex-row items-center">
        <Avatar src={profile?.avatar} fallbackText={profile?.name} size={64} className="mr-4" />
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {profile?.name || "Unknown"}
          </Text>
          <Text className="text-sm text-muted-foreground">{profile?.email || "No email"}</Text>
          <Text className="text-sm text-muted-foreground">
            {profile?.gender === true ? "Male" : profile?.gender === false ? "Female" : "Unknown"}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row justify-between items-center">
        <View className="flex-row space-x-2">
          <ThemedButton 
            title="Message" 
            onPress={onMessagePress}
            className="px-4 py-2"
            textClassName="text-sm"
          />
          <ThemedButton 
            title="Profile" 
            variant="secondary"
            onPress={onProfilePress}
            className="px-4 py-2"
            textClassName="text-sm"
          />
        </View>
        <TouchableOpacity className="p-2">
          <MoreHorizontal size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </ThemedCard>
  );
}
