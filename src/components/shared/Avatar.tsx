import React from 'react';
import { View, Image, Text } from 'react-native';
import { User } from 'lucide-react-native';

interface AvatarProps {
  src?: string;
  fallbackText?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, fallbackText, size = 40, className = "" }: AvatarProps) {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View 
      className={`bg-muted items-center justify-center overflow-hidden ${className}`}
      style={containerStyle}
    >
      {src ? (
        <Image 
          source={{ uri: src }} 
          style={containerStyle}
          resizeMode="cover"
        />
      ) : fallbackText ? (
        <Text className="text-muted-foreground font-bold" style={{ fontSize: size * 0.4 }}>
          {fallbackText.substring(0, 2).toUpperCase()}
        </Text>
      ) : (
        <User size={size * 0.6} color="#888" />
      )}
    </View>
  );
}
