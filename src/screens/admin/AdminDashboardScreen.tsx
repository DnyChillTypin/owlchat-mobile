import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { Users, MessageSquare, Activity, Settings, ChevronRight } from 'lucide-react-native';
import { navigate } from '@/navigation/navigationRef';

export function AdminDashboardScreen() {


  const stats = [
    { label: "Total Users", value: "1,245", icon: <Users size={24} color="#34B77B" /> },
    { label: "Active Chats", value: "432", icon: <MessageSquare size={24} color="#34B77B" /> },
    { label: "Daily Active", value: "892", icon: <Activity size={24} color="#34B77B" /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Admin Dashboard</Text>
        <Text className="text-muted-foreground text-sm">System Overview</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="flex-row flex-wrap justify-between">
          {stats.map((stat, i) => (
            <ThemedCard key={i} className="w-[48%] mb-4 p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-3">
                {stat.icon}
              </View>
              <Text className="text-2xl font-bold text-foreground">{stat.value}</Text>
              <Text className="text-muted-foreground text-xs uppercase tracking-wider font-medium">{stat.label}</Text>
            </ThemedCard>
          ))}
        </View>

        <Text className="text-foreground font-bold text-lg mt-4 mb-2">Management</Text>
        
        <ThemedCard className="p-0 overflow-hidden mb-6">
          <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-border/50"
            onPress={() => navigate("AdminUsers")}
          >
            <Users size={20} color="#888" />
            <View className="ml-3 flex-1">
              <Text className="text-foreground font-medium">User Management</Text>
              <Text className="text-muted-foreground text-xs">View, edit, or ban accounts</Text>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 border-b border-border/50">
            <MessageSquare size={20} color="#888" />
            <View className="ml-3 flex-1">
              <Text className="text-foreground font-medium">Content Moderation</Text>
              <Text className="text-muted-foreground text-xs">Review reported messages</Text>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4">
            <Settings size={20} color="#888" />
            <View className="ml-3 flex-1">
              <Text className="text-foreground font-medium">System Settings</Text>
              <Text className="text-muted-foreground text-xs">API keys and thresholds</Text>
            </View>
            <ChevronRight size={20} color="#888" />
          </TouchableOpacity>
        </ThemedCard>
      </ScrollView>
    </SafeAreaView>
  );
}
