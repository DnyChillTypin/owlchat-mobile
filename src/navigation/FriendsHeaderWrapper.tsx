import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FriendsTabs } from './FriendsTabs';

export function FriendsHeaderWrapper() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-4 mb-4">
        <Text className="text-3xl font-bold text-foreground">Wisdom Hub</Text>
      </View>
      <View className="flex-1">
        <FriendsTabs />
      </View>
    </SafeAreaView>
  );
}
