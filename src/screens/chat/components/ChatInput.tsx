import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard, Text } from 'react-native';
import { Plus, SendHorizontal, Image as ImageIcon, FileText, X, Reply } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { MessageType } from '@/types/enum/mesage-type';
import type { Message } from '@/types/message.type';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onSendFile: (file: any, type: MessageType) => Promise<void>;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export function ChatInput({ onSendMessage, onSendFile, replyingTo, onCancelReply }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [showActions, setShowActions] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) return;
    const message = content.trim();
    setContent("");
    await onSendMessage(message);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const type = asset.type === 'video' ? MessageType.VID : MessageType.IMG;
      
      // Construct a pseudo-File object for the service
      const file = {
        uri: asset.uri,
        name: asset.uri.split('/').pop(),
        type: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
      };
      
      await onSendFile(file, type);
    }
    setShowActions(false);
  };

  return (
    <View className="border-t border-border bg-card">
      {replyingTo && (
        <View className="flex-row items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <View className="flex-row items-center flex-1">
            <Reply size={16} color="#34B77B" className="mr-2" />
            <View className="flex-1">
              <Text className="text-xs text-primary font-medium">Replying to message</Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {replyingTo.type === 'TEXT' ? replyingTo.content : `[${replyingTo.type}]`}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onCancelReply} className="p-1">
            <X size={16} color="#888" />
          </TouchableOpacity>
        </View>
      )}
      
      <View className="p-2 pb-6 flex-row items-end space-x-2">
        <TouchableOpacity 
          className="p-3 bg-muted rounded-full"
          onPress={() => setShowActions(!showActions)}
        >
          <Plus size={20} color={showActions ? "#34B77B" : "#888"} />
        </TouchableOpacity>

        {showActions && (
          <View className="flex-row space-x-2 mb-1">
            <TouchableOpacity 
              className="p-3 bg-primary/10 rounded-full"
              onPress={pickImage}
            >
              <ImageIcon size={20} color="#34B77B" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-3 bg-primary/10 rounded-full"
            >
              <FileText size={20} color="#34B77B" />
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-1 bg-muted rounded-2xl px-4 py-2 max-h-32">
          <TextInput
            className="text-foreground text-sm"
            placeholder="Type a message..."
            placeholderTextColor="#888"
            multiline
            value={content}
            onChangeText={setContent}
            onFocus={() => setShowActions(false)}
          />
        </View>

        <TouchableOpacity 
          className={`p-3 rounded-full ${content.trim() ? 'bg-primary' : 'bg-muted'}`}
          onPress={handleSend}
          disabled={!content.trim()}
        >
          <SendHorizontal size={20} color={content.trim() ? "#fff" : "#888"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
