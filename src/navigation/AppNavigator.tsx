import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuthContext } from '@/providers/auth-provider';

// Placeholder screens
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { ConversationsListScreen } from '@/screens/chat/ConversationsListScreen';
import { ConversationDetailScreen } from '@/screens/chat/ConversationDetailScreen';
import { FriendsHeaderWrapper } from '@/navigation/FriendsHeaderWrapper';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { AdminDashboardScreen } from '@/screens/admin/AdminDashboardScreen';
import { AdminUsersScreen } from '@/screens/admin/AdminUsersScreen';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();
const MainTabs = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <MainTabs.Navigator screenOptions={{ headerShown: false }}>
      <MainTabs.Screen name="Chat" component={ConversationsListScreen} />
      <MainTabs.Screen name="Friends" component={FriendsHeaderWrapper} />
      <MainTabs.Screen name="Admin" component={AdminDashboardScreen} />
      <MainTabs.Screen name="Profile" component={ProfileScreen} />
    </MainTabs.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Tabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <MainStack.Screen 
        name="ChatDetail" 
        component={ConversationDetailScreen} 
        options={({ route }: any) => ({ title: route.params?.title || 'Chat' })}
      />
      <MainStack.Screen 
        name="AdminUsers" 
        component={AdminUsersScreen} 
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, loading } = useAuthContext();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
