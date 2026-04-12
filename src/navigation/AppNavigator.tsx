import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuthContext } from '@/providers/auth-provider';
import { MessageSquare, Users, User } from 'lucide-react-native';

// Placeholder screens
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { ConversationsListScreen } from '@/screens/chat/ConversationsListScreen';
import { ConversationDetailScreen } from '@/screens/chat/ConversationDetailScreen';
import { FriendsHeaderWrapper } from '@/navigation/FriendsHeaderWrapper';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
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
    <MainTabs.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Chat') {
            return <MessageSquare size={size} color={color} />;
          } else if (route.name === 'Friends') {
            return <Users size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <User size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#34B77B',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        }
      })}
    >
      <MainTabs.Screen name="Chat" component={ConversationsListScreen} />
      <MainTabs.Screen name="Friends" component={FriendsHeaderWrapper} />
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
