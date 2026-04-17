import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { AppState, type AppStateStatus, Alert } from "react-native";
import { socialWebSocketClient } from "@/lib/websocket";
import { useAuthContext } from "@/providers/auth-provider";
import { useUserProfileContext } from "@/providers/user-profile-provider";

interface SocialNotificationContextProps {
  isConnected: boolean;
  subscribeToSocial: (destination: string, callback: (message: any) => void) => any;
}

const SocialNotificationContext = createContext<SocialNotificationContextProps | null>(null);

export const SocialNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const { profile } = useUserProfileContext();
  const [isConnected, setIsConnected] = useState(false);
  const appState = useRef(AppState.currentState);

  const connectSocialWS = useCallback(() => {
    if (!isAuthenticated) return;
    socialWebSocketClient.connect(
      () => {
        console.log("[SocialWS] Connected!");
      },
      (error) => {
        console.error("[SocialWS] Connection error:", error);
      }
    );
  }, [isAuthenticated]);

  const disconnectSocialWS = useCallback(() => {
    socialWebSocketClient.disconnect();
  }, []);

  useEffect(() => {
    socialWebSocketClient.setStatusListener((status) => {
      setIsConnected(status);
    });

    if (!isAuthenticated) {
      disconnectSocialWS();
      return;
    }

    connectSocialWS();

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("[SocialWS] Reconnecting on foreground");
        connectSocialWS();
      } else if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        console.log("[SocialWS] Disconnecting on background");
        disconnectSocialWS();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      disconnectSocialWS();
    };
  }, [isAuthenticated, connectSocialWS, disconnectSocialWS]);

  // Global Friend Request Listener
  useEffect(() => {
    if (isConnected && profile?.id) {
      console.log(`[SocialWS] Subscribing to friend requests for ${profile.id}`);
      const subscription = socialWebSocketClient.subscribe(
        `/user/${profile.id}/queue/friend-request`,
        (notification) => {
          console.log("[SocialWS] Received friend request notification:", notification);
          
          if (notification.action === "CREATED") {
            const senderName = notification.data?.senderName || "Someone";
            Alert.alert(
              "New Friend Request",
              `${senderName} sent you a friend request!`,
              [{ text: "OK" }]
            );
          }
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [isConnected, profile?.id]);

  const subscribeToSocial = (destination: string, callback: (message: any) => void) => {
    return socialWebSocketClient.subscribe(destination, callback);
  };

  return (
    <SocialNotificationContext.Provider value={{ isConnected, subscribeToSocial }}>
      {children}
    </SocialNotificationContext.Provider>
  );
};

export const useSocialNotification = () => {
  const context = useContext(SocialNotificationContext);
  if (!context) {
    throw new Error("useSocialNotification must be used within a SocialNotificationProvider");
  }
  return context;
};
