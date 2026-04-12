import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Avatar } from "./Avatar";
import { format } from "date-fns";
import type { Message } from "@/types/message.type";

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
  otherUserAvatar?: string;
  otherUserName?: string;
}

export function ChatBubble({ message, isMe, otherUserAvatar, otherUserName }: ChatBubbleProps) {
  const isRemoved = message.state === "REMOVED";
  const isEdited = message.state === "EDITED";
  const isImage = message.type === "IMG";

  // Dummy fallback for API file structure: assuming the content is the API endpoint to fetch if it's an image
  // For production, we'd need to use the token to fetch the blob, but for now we'll handle standard urls or placeholders
  const imageSource = message.content.startsWith("http") 
    ? { uri: message.content } 
    : { uri: "https://via.placeholder.com/150" };

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
      
      <View className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
        <View 
          className={`py-2 px-3 rounded-2xl ${
            isRemoved 
              ? "bg-muted border border-border" 
              : isMe 
                ? "bg-primary" 
                : "bg-secondary"
          }`}
          style={{
            borderBottomRightRadius: isMe ? 4 : 16,
            borderBottomLeftRadius: !isMe ? 4 : 16,
          }}
        >
          {isRemoved ? (
            <Text className="text-muted-foreground text-sm italic">Message removed</Text>
          ) : isImage ? (
             <Image 
               source={imageSource}
               className="w-48 h-48 rounded-lg"
               resizeMode="cover"
             />
          ) : (
            <Text className={`text-base ${isMe ? "text-primary-foreground" : "text-foreground"}`}>
              {message.content}
            </Text>
          )}
        </View>

        <View className="flex-row items-center mt-1 space-x-2">
          {isEdited && !isRemoved && (
            <Text className="text-[10px] text-muted-foreground ml-1">Edited</Text>
          )}
          <Text className="text-[10px] text-muted-foreground">
            {format(new Date(message.sentDate), 'HH:mm')}
          </Text>
        </View>
      </View>
    </View>
  );
}
