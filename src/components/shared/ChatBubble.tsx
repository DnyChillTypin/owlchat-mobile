import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator, Alert, Clipboard } from 'react-native';
import { Image } from 'expo-image';
import { Avatar } from './Avatar';
import { format } from "date-fns";
import type { Message } from "@/types/message.type";
import { API_ENDPOINTS } from "@/config/api";
import { secureStorage } from "@/lib/secure-storage";
import { FileText, Download, Play, Check, CheckCheck } from 'lucide-react-native';

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
  otherUserAvatar?: string;
  otherUserName?: string;
  onReply?: (message: Message) => void;
  onDelete?: (message: Message) => void;
}

export function ChatBubble({ message, isMe, otherUserAvatar, otherUserName, onReply, onDelete }: ChatBubbleProps) {
  const isRemoved = message.state === "REMOVED";
  const isEdited = message.state === "EDITED";
  
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await secureStorage.getItem("accessToken");
        setToken(storedToken);
      } catch (e) {
        console.error("[ChatBubble] Failed to load token:", e);
      } finally {
        setIsTokenLoaded(true);
      }
    };
    loadToken();
  }, []);

  if (!isTokenLoaded) {
    return (
      <View className={`flex-row w-full my-1 px-4 ${isMe ? "justify-end" : "justify-start"}`}>
        <ActivityIndicator size="small" color="#34B77B" />
      </View>
    );
  }

  const handleLongPress = () => {
    if (isRemoved || !onDelete) return;
    onDelete(message);
  };

  const renderContent = () => {
    if (isRemoved) {
      return <Text className="text-muted-foreground text-sm italic">Message removed</Text>;
    }

    const imageUrl = `${API_ENDPOINTS.CHAT_SERVICE}/message/${message.id}/resource`;

    switch (message.type) {
      case "IMG":
        return (
          <View className="w-64 h-64 bg-muted">
            <Image 
              source={{ 
                uri: imageUrl, 
                headers: { Authorization: `Bearer ${token}` } 
              }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
            />
          </View>
        );
      case "VID":
        return (
          <View className="w-64 h-40 bg-black/10 items-center justify-center">
            <View className="bg-primary/80 p-3 rounded-full">
              <Play size={24} color="#fff" fill="#fff" />
            </View>
            <Text className="text-[10px] text-muted-foreground mt-2">Video Attachment</Text>
          </View>
        );
      case "GENERIC_FILE":
        return (
          <View className="p-1">
             <View className="flex-row items-center bg-background/50 p-3 rounded-2xl border border-divider">
                <View className="bg-primary/10 p-2 rounded-lg mr-3">
                <FileText size={20} color="#34B77B" />
                </View>
                <View className="flex-1">
                <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                    {message.content || "Attachment"}
                </Text>
                <Text className="text-[10px] text-muted-foreground uppercase">File</Text>
                </View>
                <Download size={16} color="#888" className="ml-2" />
            </View>
          </View>
        );
      case "TEXT":
      default:
        return (
          <Text 
            selectable={false}
            className={`text-base ${isMe ? "text-primary-foreground" : "text-foreground"}`}
          >
            {message.content}
          </Text>
        );
    }
  };

  const isMedia = (message.type === "IMG" || message.type === "VID") && !isRemoved;
  const bubblePadding = isMedia ? "p-0" : "py-2 px-3";
  
  return (
    <View className={`flex-row w-full my-1 px-4 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <View className="mr-2 justify-end pb-4">
          <Avatar 
            src={otherUserAvatar} 
            fallbackText={otherUserName?.substring(0, 2).toUpperCase() || "U"} 
            size={28} 
          />
        </View>
      )}
      
      <TouchableOpacity 
        activeOpacity={0.9}
        onLongPress={handleLongPress}
        className={`max-w-[85%] ${isMe ? "items-end" : "items-start"}`}
      >
        <View 
          className={`overflow-hidden ${bubblePadding} rounded-[24px] ${
            isRemoved 
              ? "bg-muted border border-border" 
              : isMe 
                ? "bg-primary" 
                : "bg-secondary"
          }`}
          style={{
            borderBottomRightRadius: isMe ? 6 : 24,
            borderBottomLeftRadius: !isMe ? 6 : 24,
          }}
        >
          {renderContent()}
        </View>

        {/* Reactions Display - Overlayed on the bubble corner */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <View 
            className={`absolute bottom-[-10px] z-50 flex-row items-center bg-card rounded-full px-2 py-1 shadow-md border-[1.5px] border-border/40`}
            style={{ [isMe ? 'right' : 'left']: 0 }}
          >
                {Array.from(new Set(Object.values(message.reactions))).map((emoji, idx) => (
                    <Text key={idx} className="text-sm mr-0.5">{emoji}</Text>
                ))}
                {Object.keys(message.reactions).length > 1 && (
                    <Text className="text-[10px] text-muted-foreground ml-0.5 font-bold">
                        {Object.keys(message.reactions).length}
                    </Text>
                )}
          </View>
        )}

        <View className="flex-row items-center mt-1 space-x-2">
          {isEdited && !isRemoved && (
            <Text className="text-[10px] text-muted-foreground ml-1">Edited</Text>
          )}
          <Text className="text-[10px] text-muted-foreground mr-1">
            {message.sentDate ? format(new Date(message.sentDate.replace(/(\.\d{3})\d+(Z)?$/, '$1$2')), 'HH:mm') : ''}
          </Text>
          {isMe && !isRemoved && (
            <View className="ml-0.5">
              {message.isRead ? (
                <CheckCheck size={12} color="#3b82f6" />
              ) : (
                <Check size={12} color="#888" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
