import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking, ActivityIndicator } from "react-native";
import { Avatar } from "./Avatar";
import { format } from "date-fns";
import type { Message } from "@/types/message.type";
import { API_ENDPOINTS } from "@/config/api";
import { secureStorage } from "@/lib/secure-storage";
import { FileText, Download, Play } from 'lucide-react-native';

import { Share, Alert, Clipboard } from 'react-native';

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

  useEffect(() => {
    secureStorage.getItem("accessToken").then(setToken);
  }, []);

  const handleLongPress = () => {
    if (isRemoved) return;
    
    const options = [
      { text: "Cancel", style: "cancel" as const }
    ];

    if (message.type === "TEXT" && message.content) {
      options.unshift({
        text: "Copy",
        onPress: () => Clipboard.setString(message.content)
      });
    }

    if (onReply) {
      options.unshift({
        text: "Reply",
        onPress: () => onReply(message)
      });
    }

    if (isMe && onDelete) {
      options.push({
        text: "Delete",
        style: "destructive" as const,
        onPress: () => onDelete(message)
      });
    }

    Alert.alert("Message Actions", undefined, options, { cancelable: true });
  };

  const renderContent = () => {
    if (isRemoved) {
      return <Text className="text-muted-foreground text-sm italic">Message removed</Text>;
    }

    const resourceUrl = `${API_ENDPOINTS.CHAT_SERVICE}/message/${message.id}/resource`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    switch (message.type) {
      case "IMG":
        return (
          <Image 
            source={{ uri: resourceUrl, headers }}
            className="w-64 h-64 rounded-xl"
            resizeMode="cover"
          />
        );
      case "VID":
        return (
          <View className="w-64 h-40 bg-black/10 items-center justify-center rounded-xl border border-divider">
            <View className="bg-primary/80 p-3 rounded-full">
              <Play size={24} color="#fff" fill="#fff" />
            </View>
            <Text className="text-[10px] text-muted-foreground mt-2">Video Attachment</Text>
          </View>
        );
      case "GENERIC_FILE":
        return (
          <TouchableOpacity 
            className="flex-row items-center bg-background/50 p-3 rounded-xl border border-divider"
            onPress={() => Linking.openURL(resourceUrl)}
          >
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
          </TouchableOpacity>
        );
      case "TEXT":
      default:
        return (
          <Text className={`text-base ${isMe ? "text-primary-foreground" : "text-foreground"}`}>
            {message.content}
          </Text>
        );
    }
  };

  return (
    <View className={`flex-row w-full my-2 px-4 ${isMe ? "justify-end" : "justify-start"}`}>
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
          className={`py-2 px-3 rounded-2xl ${
            isRemoved 
              ? "bg-muted border border-border" 
              : isMe 
                ? "bg-primary" 
                : "bg-secondary"
          } ${message.type !== 'TEXT' && !isRemoved ? 'p-1' : ''}`}
          style={{
            borderBottomRightRadius: isMe ? 4 : 16,
            borderBottomLeftRadius: !isMe ? 4 : 16,
          }}
        >
          {renderContent()}
        </View>

        <View className="flex-row items-center mt-1 space-x-2">
          {isEdited && !isRemoved && (
            <Text className="text-[10px] text-muted-foreground ml-1">Edited</Text>
          )}
          <Text className="text-[10px] text-muted-foreground">
            {format(new Date(message.sentDate), 'HH:mm')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
