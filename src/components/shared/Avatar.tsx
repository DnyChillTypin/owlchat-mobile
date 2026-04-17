import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { userProfileService } from '@/services/user-profile-service';
import { secureStorage } from '@/lib/secure-storage';

interface AvatarProps {
  src?: string;
  userId?: string; 
  fallbackText?: string;
  size?: number;
  className?: string;
  style?: ViewStyle;
}

export function Avatar({ src, userId, size = 40, className = "", fallbackText = "", style }: AvatarProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await secureStorage.getItem('accessToken');
        setToken(storedToken);
      } catch (e) {
        console.error("[Avatar] Failed to load token:", e);
      } finally {
        setIsTokenLoaded(true);
      }
    };
    loadToken();
  }, []);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    ...style
  };

  const getAvatarUri = () => {
    let baseUri = src;
    if (!src && userId) baseUri = userProfileService.getAvatarUrl(userId);
    else if (src && !src.startsWith('http') && userId) {
        baseUri = userProfileService.getAvatarUrl(userId);
    }
    
    if (!baseUri) return null;

    // Append token to URL as a fallback for standard Image loaders, plus t for cache-busting
    const separator = baseUri.includes('?') ? '&' : '?';
    return `${baseUri}${separator}token=${token}&t=${Date.now()}`;
  };

  const uri = getAvatarUri();

  if (!isTokenLoaded) {
    return (
      <View 
        className={`bg-muted items-center justify-center overflow-hidden ${className}`}
        style={containerStyle}
      >
        <ActivityIndicator size="small" color="#34B77B" />
      </View>
    );
  }

  return (
    <View 
      className={`bg-muted items-center justify-center overflow-hidden ${className}`}
      style={containerStyle}
    >
      {uri ? (
        <Image 
          source={{ 
            uri: uri,
            headers: { Authorization: `Bearer ${token}` }
          }} 
          style={containerStyle}
          contentFit="cover"
          transition={200}
          onError={(e) => {
            console.log(`[Avatar] Failed to load image from URI: ${uri}`);
            console.log(`[Avatar] Error detail:`, e);
          }}
        />
      ) : (
        <Text className="text-muted-foreground font-bold" style={{ fontSize: size * 0.4 }}>
          {fallbackText ? fallbackText.substring(0, 1).toUpperCase() : "?"}
        </Text>
      )}
    </View>
  );
}
