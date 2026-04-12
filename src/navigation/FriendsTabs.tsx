import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FriendsScreen } from '@/screens/friends/FriendsScreen';
import { RequestsScreen } from '@/screens/friends/RequestsScreen';
import { DiscoveryScreen } from '@/screens/friends/DiscoveryScreen';
import { useTheme } from '@/providers/theme-provider';

const Tab = createMaterialTopTabNavigator();

export function FriendsTabs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#34B77B',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
        tabBarIndicatorStyle: { backgroundColor: '#34B77B', height: 3 },
        tabBarStyle: { 
          backgroundColor: isDark ? '#151515' : '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#333' : '#eee',
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '700', textTransform: 'none' },
      }}
    >
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Discovery" component={DiscoveryScreen} />
    </Tab.Navigator>
  );
}
