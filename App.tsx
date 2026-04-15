import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, LogBox } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { AuthProvider } from './src/providers/auth-provider';
import { ThemeProvider, useTheme } from './src/providers/theme-provider';
import { UserProfileProvider } from './src/providers/user-profile-provider';
import { WebSocketProvider } from './src/providers/websocket-provider';
import { ChatProvider } from './src/providers/chat-provider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import "./global.css";

// Prevent the developer overlay from dimming the screen
LogBox.ignoreAllLogs(true);

function AppContent() {
  useKeepAwake();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaProvider>
      <View className={`flex-1 ${isDark ? 'dark' : ''} bg-background`}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <NavigationContainer 
          ref={navigationRef}
          theme={isDark ? DarkTheme : DefaultTheme}
        >
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProfileProvider>
          <WebSocketProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </WebSocketProvider>
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
