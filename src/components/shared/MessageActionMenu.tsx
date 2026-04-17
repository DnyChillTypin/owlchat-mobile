import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { 
  Reply, 
  Copy, 
  Trash2, 
  CornerUpLeft,
  SmilePlus
} from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface MessageActionMenuProps {
  isVisible: boolean;
  onClose: () => void;
  messageType: string;
  isMe: boolean;
  onAction: (action: 'reply' | 'copy' | 'delete' | 'react', emoji?: string) => void;
}

export function MessageActionMenu({ isVisible, onClose, messageType, isMe, onAction }: MessageActionMenuProps) {
  const [slideAnim] = React.useState(new Animated.Value(height));
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  const reactions = ['❤️', '😂', '😮', '😢', '😠', '👍'];

  const ActionItem = ({ icon: Icon, label, onPress, isDestructive = false }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center p-4 active:bg-muted/10`}
    >
      <View className={`p-2 rounded-full mr-4 ${isDestructive ? 'bg-destructive/10' : 'bg-muted'}`}>
        <Icon size={20} color={isDestructive ? '#ef4444' : '#34B77B'} />
      </View>
      <Text className={`text-base font-medium ${isDestructive ? 'text-destructive' : 'text-foreground'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          className="flex-1 bg-black/40 justify-end"
          style={{ opacity: fadeAnim }}
        >
          <TouchableWithoutFeedback>
            <Animated.View 
              className="bg-card rounded-t-[40px] px-6 pb-12 pt-4 shadow-2xl"
              style={{ 
                transform: [{ translateY: slideAnim }],
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}
            >
              {/* Handle bar */}
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-border rounded-full" />
              </View>

              {/* Reaction Bar */}
              <View className="flex-row justify-between mb-8 px-2">
                {reactions.map((emoji) => (
                  <TouchableOpacity 
                    key={emoji}
                    onPress={() => {
                        onAction('react', emoji);
                        onClose();
                    }}
                    className="p-2 bg-muted/30 rounded-full"
                  >
                    <Text className="text-2xl">{emoji}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity className="p-2 bg-muted/30 rounded-full items-center justify-center">
                   <SmilePlus size={24} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Actions List */}
              <View className="bg-secondary/30 rounded-3xl overflow-hidden">
                <ActionItem 
                  icon={Reply} 
                  label="Reply" 
                  onPress={() => { onAction('reply'); onClose(); }} 
                />
                
                {messageType === 'TEXT' && (
                  <ActionItem 
                    icon={Copy} 
                    label="Copy Text" 
                    onPress={() => { onAction('copy'); onClose(); }} 
                  />
                )}

                {isMe && (
                  <ActionItem 
                    icon={Trash2} 
                    label="Delete for everyone" 
                    isDestructive 
                    onPress={() => { onAction('delete'); onClose(); }} 
                  />
                )}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity 
                onPress={onClose}
                className="mt-6 items-center"
              >
                <Text className="text-muted-foreground font-semibold text-base py-2">Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
