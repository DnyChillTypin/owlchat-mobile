import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { Avatar } from '@/components/shared/Avatar';
import { ThemedButton } from '@/components/shared/ThemedButton';
import { useUserProfile } from '@/hooks/use-user-profile';
import { MessageSquare, User as UserIcon, MoreHorizontal } from 'lucide-react-native';

interface FriendCardProps {
  friendId: string;
  type?: 'friend' | 'discovery' | 'incoming' | 'sent';
  onMessagePress?: () => void;
  onProfilePress?: () => void;
  onActionPress?: (action: 'add' | 'accept' | 'reject' | 'cancel') => void;
}

export function FriendCard({ 
  friendId, 
  type = 'friend',
  onMessagePress, 
  onProfilePress,
  onActionPress
}: FriendCardProps) {
  const { profile, fetchProfileById, loading } = useUserProfile();

  useEffect(() => {
    fetchProfileById(friendId);
  }, [friendId]);

  if (loading) {
    return (
      <ThemedCard className="mb-3 h-32 items-center justify-center">
        <ActivityIndicator color="#34B77B" />
      </ThemedCard>
    );
  }

  const renderActions = () => {
    switch (type) {
      case 'discovery':
        return (
          <ThemedButton 
            title="Add Friend" 
            onPress={() => onActionPress?.('add')}
            className="flex-1"
          />
        );
      case 'incoming':
        return (
          <View className="flex-row space-x-2 flex-1">
            <ThemedButton 
              title="Accept" 
              onPress={() => onActionPress?.('accept')}
              variant="primary"
              className="flex-1"
            />
            <ThemedButton 
              title="Reject" 
              onPress={() => onActionPress?.('reject')}
              variant="secondary"
              className="flex-1"
            />
          </View>
        );
      case 'sent':
        return (
          <ThemedButton 
            title="Cancel Request" 
            onPress={() => onActionPress?.('cancel')}
            variant="secondary"
            className="flex-1"
          />
        );
      case 'friend':
      default:
        return (
          <View className="flex-row space-x-2 flex-1">
            <ThemedButton 
              title="Message" 
              onPress={onMessagePress}
              variant="primary"
              className="flex-3"
            />
            <ThemedButton 
              title="Unfriend" 
              variant="secondary"
              onPress={() => onActionPress?.('reject')} 
              className="flex-2"
            />
          </View>
        );
    }
  };

  return (
    <ThemedCard className="mb-3 p-4">
      <TouchableOpacity onPress={onProfilePress} className="flex-row items-center">
        <Avatar src={profile?.avatar} fallbackText={profile?.name} size={64} className="mr-4" />
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {profile?.name || "Unknown"}
          </Text>
          <Text className="text-sm text-muted-foreground" numberOfLines={1}>{profile?.email || "No email"}</Text>
          <Text className="text-sm text-muted-foreground">
            {profile?.gender === true ? "Male" : profile?.gender === false ? "Female" : "Unknown"}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-between items-center">
        <View className="flex-1 mr-2">
          {renderActions()}
        </View>
        <TouchableOpacity className="p-2">
          <MoreHorizontal size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </ThemedCard>
  );
}
