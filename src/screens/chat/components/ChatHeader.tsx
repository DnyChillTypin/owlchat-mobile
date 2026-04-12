import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { goBack } from '@/navigation/navigationRef';
import { CircleArrowLeft, Phone, Video, Info } from 'lucide-react-native';
import { Avatar } from '@/components/shared/Avatar';

interface ChatHeaderProps {
  imageUrl?: string;
  name: string;
  isOnline?: boolean;
}

export function ChatHeader({ imageUrl, name, isOnline }: ChatHeaderProps) {
  return (
    <View className="flex-row items-center justify-between p-3 border-b border-border bg-card">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity 
          onPress={() => goBack()}
          className="mr-3 p-1"
        >
          <CircleArrowLeft size={24} color="#34B77B" />
        </TouchableOpacity>
        
        <View className="relative mr-3">
          <Avatar src={imageUrl} fallbackText={name} size={40} />
          {isOnline && (
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
          )}
        </View>

        <View className="flex-1 justify-center">
          <Text className="font-bold text-foreground text-base leading-tight" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            {isOnline ? "Active now" : "Offline"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center space-x-2">
        <TouchableOpacity className="p-2">
          <Phone size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Video size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Info size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
