import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@/components/shared/Avatar';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { useChatMemberUser } from "@/hooks/use-chat-member-user";
import { useMessageUser } from "@/hooks/use-chat-message-user";
import { useUserProfile } from "@/hooks/use-user-profile";

interface ConversationItemProps {
  id: string;
  imageUrl: string;
  username: string;
  newestMessageId?: string;
  currentUserId?: string;
}

export function ConversationItem({
  id,
  imageUrl,
  username,
  newestMessageId,
  currentUserId,
}: ConversationItemProps) {
  const navigation = useNavigation<any>();
  const { getChatMembersByChatId } = useChatMemberUser();
  const { getMessageById } = useMessageUser();
  const { fetchProfileById } = useUserProfile();

  const [displayName, setDisplayName] = useState(username);
  const [displayAvatar, setDisplayAvatar] = useState(imageUrl);
  const [preview, setPreview] = useState("Start the conversation!");
  const [timeStamp, setTimeStamp] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      if (!id || !currentUserId) return;
      try {
        const membersResp = await getChatMembersByChatId(null, null, id);
        const members = Array.isArray(membersResp) ? membersResp : (membersResp.content || []);

        const other = members.find((m: any) => {
          const mId = m.memberId ?? m.userId ?? m.id;
          return mId && mId !== currentUserId;
        });

        if (other) {
          const otherId = other.memberId ?? other.userId ?? other.id;
          const otherProfile = await fetchProfileById(otherId);
          if (otherProfile?.name) {
            setDisplayName(otherProfile.name);
          }
          if (otherProfile?.avatar || other.memberAvatar) {
            setDisplayAvatar(otherProfile?.avatar || other.memberAvatar);
          }
        }
      } catch (err) {
        console.error("Error loading chat members for preview:", err);
      }
    };
    loadMembers();
  }, [id, currentUserId]);

  useEffect(() => {
    const loadNewestMessage = async () => {
      if (!newestMessageId) {
        setPreview("No messages yet");
        setTimeStamp(null);
        return;
      }
      try {
        const msg = await getMessageById(null, null, newestMessageId);
        if (!msg) return;

        let content = msg.content || "";
        if (msg.type === "IMG") content = "Đã gửi một ảnh";
        else if (msg.type === "VID") content = "Đã gửi một video";
        else if (msg.type === "GENERIC_FILE") content = "Đã gửi một tệp đính kèm";

        setPreview(msg.senderId === currentUserId ? `You: ${content}` : content);

        if (msg.sentDate) {
          const date = new Date(msg.sentDate);
          setTimeStamp(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.error("Error loading newest message preview:", err);
      }
    };
    loadNewestMessage();
  }, [newestMessageId, currentUserId]);

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("ChatDetail", { conversationId: id, title: displayName })}
      className="mb-2 px-2"
    >
      <ThemedCard className="flex-row items-center p-3">
        <Avatar src={displayAvatar} fallbackText={displayName} size={50} className="mr-4" />
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-foreground font-bold text-base truncate" numberOfLines={1}>
              {displayName}
            </Text>
            {timeStamp && (
              <Text className="text-muted-foreground text-xs font-light">
                {timeStamp}
              </Text>
            )}
          </View>
          <Text className="text-muted-foreground text-sm truncate" numberOfLines={1}>
            {preview}
          </Text>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}
