import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@/components/shared/Avatar';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/providers/theme-provider';
import { LogOut, Sun, Moon, User, Bell, Shield, HelpCircle, Camera } from 'lucide-react-native';
import { navigate } from '@/navigation/navigationRef';

export function ProfileScreen() {
  const { profile, refreshProfile } = useUserProfileContext();
  const { uploadAvatar } = useUserProfile();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera roll permissions to upload an avatar.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      handleAvatarUpload(result.assets[0]);
    }
  };

  const handleAvatarUpload = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!profile?.id) return;
    
    setUploading(true);
    try {
      const filename = asset.uri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const file = {
        uri: asset.uri,
        name: filename,
        type: type,
      };

      await uploadAvatar(profile.id, file);
      await refreshProfile();
      Alert.alert('Success', 'Profile picture updated!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const menuItems = [
    { icon: <Bell size={20} color="#888" />, label: "Notifications", onPress: () => {} },
    { icon: <Shield size={20} color="#888" />, label: "Security", onPress: () => {} },
    { icon: <HelpCircle size={20} color="#888" />, label: "Help & Support", onPress: () => {} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-4">
        <View className="items-center py-10">
          <View className="relative">
            <Avatar src={profile?.avatar} userId={profile?.id} fallbackText={profile?.name} size={100} className="mb-4 border-2 border-primary" />
            <TouchableOpacity 
              onPress={pickImage}
              disabled={uploading}
              className="absolute bottom-4 right-0 bg-primary p-2 rounded-full border-2 border-background"
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Camera size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold text-foreground">{profile?.name || "Member"}</Text>
          <Text className="text-muted-foreground">{profile?.email || "email@example.com"}</Text>
          
          <TouchableOpacity 
            onPress={() => navigate('EditProfile')}
            className="mt-4 bg-primary/10 px-6 py-2 rounded-full"
          >
            <Text className="text-primary font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">Settings</Text>
        <ThemedCard className="mb-6 p-0 overflow-hidden">
          <View className="flex-row items-center justify-between p-4 border-b border-border/50">
            <View className="flex-row items-center">
              {theme === 'dark' ? <Moon size={20} color="#888" /> : <Sun size={20} color="#888" />}
              <Text className="text-foreground ml-3 font-medium">Dark Mode</Text>
            </View>
            <Switch 
              value={theme === 'dark'} 
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: "#34B77B" }}
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => navigate('EditProfile')}
            className="flex-row items-center p-4 border-b border-border/50"
          >
            <User size={20} color="#888" />
            <Text className="text-foreground ml-3 font-medium flex-1">Edit Profile</Text>
          </TouchableOpacity>

          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              onPress={item.onPress}
              className={`flex-row items-center p-4 ${index < menuItems.length - 1 ? 'border-b border-border/50' : ''}`}
            >
              {item.icon}
              <Text className="text-foreground ml-3 font-medium flex-1">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ThemedCard>

        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center justify-center p-4 bg-destructive/10 rounded-xl mb-10"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-destructive font-bold ml-2">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
