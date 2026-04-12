import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedCard } from '@/components/shared/ThemedCard';
import { ThemedButton } from '@/components/shared/ThemedButton';
import { Avatar } from '@/components/shared/Avatar';
import { goBack } from '@/navigation/navigationRef';
import { CircleArrowLeft, ShieldAlert } from 'lucide-react-native';

// Placeholder mock service for admin users fetching since admin-service wasn't ported explicitly in Phase 3
// In a full implementation, we'd use the actual admin APIs.
const fetchAllUsers = async () => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Admin Owl', email: 'admin@owlchat.com', role: 'ADMIN', status: 'ACTIVE' },
        { id: '2', name: 'John Doe', email: 'john@example.com', role: 'USER', status: 'ACTIVE' },
        { id: '3', name: 'Spammer Bot', email: 'bot123@spam.com', role: 'USER', status: 'BANNED' },
      ]);
    }, 1000);
  });
};

export function AdminUsersScreen() {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllUsers();
      setUsers(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center p-4 border-b border-border bg-card">
        <TouchableOpacity onPress={() => goBack()} className="mr-3">
          <CircleArrowLeft size={24} color="#34B77B" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">User Management</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#34B77B" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          className="p-4"
          renderItem={({ item }) => (
            <ThemedCard className="mb-3 flex-row items-center p-3">
              <Avatar fallbackText={item.name} size={48} className="mr-3" />
              <View className="flex-1">
                <Text className="font-bold text-foreground">{item.name}</Text>
                <Text className="text-xs text-muted-foreground">{item.email}</Text>
                <View className="flex-row mt-1">
                  <View className={`px-2 py-0.5 rounded-full mr-2 ${item.role === 'ADMIN' ? 'bg-primary/20' : 'bg-muted'}`}>
                    <Text className={`text-[10px] font-bold ${item.role === 'ADMIN' ? 'text-primary' : 'text-muted-foreground'}`}>{item.role}</Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded-full ${item.status === 'BANNED' ? 'bg-destructive/20' : 'bg-green-500/20'}`}>
                    <Text className={`text-[10px] font-bold ${item.status === 'BANNED' ? 'text-destructive' : 'text-green-600'}`}>{item.status}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="p-2 ml-2 bg-destructive/10 rounded-full">
                <ShieldAlert size={18} color="#EF4444" />
              </TouchableOpacity>
            </ThemedCard>
          )}
        />
      )}
    </View>
  );
}
