import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/shared/Avatar';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { useUserProfileContext } from '@/providers/user-profile-provider';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/providers/theme-provider';
import { LogOut, Sun, Moon, User, Bell, Shield, HelpCircle } from 'lucide-react-native';

export function ProfileScreen() {
  const { profile } = useUserProfileContext();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const menuItems = [
    { icon: <User size={20} color="#888" />, label: "Edit Profile", onPress: () => {} },
    { icon: <Bell size={20} color="#888" />, label: "Notifications", onPress: () => {} },
    { icon: <Shield size={20} color="#888" />, label: "Security", onPress: () => {} },
    { icon: <HelpCircle size={20} color="#888" />, label: "Help & Support", onPress: () => {} },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1 px-4">
        <View className="items-center py-10">
          <Avatar src={profile?.avatar} fallbackText={profile?.name} size={100} className="mb-4 border-2 border-primary" />
          <Text className="text-2xl font-bold text-foreground">{profile?.name || "Member"}</Text>
          <Text className="text-muted-foreground">{profile?.email || "email@example.com"}</Text>
          
          <TouchableOpacity className="mt-4 bg-primary/10 px-6 py-2 rounded-full">
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
