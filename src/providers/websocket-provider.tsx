import React, { createContext, useContext, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { chatWebSocketClient } from "@/lib/websocket";
import { useAuthContext } from "@/providers/auth-provider";

interface WebSocketContextProps {
  isConnected: boolean;
  sendMessage: (destination: string, body: any) => void;
  subscribeToTopic: (destination: string, callback: (message: any) => void) => any;
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [isConnected, setIsConnected] = React.useState(false);
  const appState = useRef(AppState.currentState);

  const connectWebSocket = () => {
    if (!isAuthenticated) return;
    chatWebSocketClient.connect(
      () => {
        console.log("WebSocket connected!");
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  const disconnectWebSocket = () => {
    chatWebSocketClient.disconnect();
  };

  useEffect(() => {
    // Sync with internal state of the class instance
    chatWebSocketClient.setStatusListener((status) => {
      setIsConnected(status);
    });

    if (!isAuthenticated) {
      disconnectWebSocket();
      return;
    }

    // Initial connection when authenticated
    connectWebSocket();

    // AppState listener for background/foreground transitions
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground - Reconnecting WebSocket");
        connectWebSocket();
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log("App is going to the background - Disconnecting WebSocket");
        disconnectWebSocket();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      disconnectWebSocket();
    };
  }, [isAuthenticated]);

  const sendMessage = (destination: string, body: any) => {
    chatWebSocketClient.send(destination, body);
  };

  const subscribeToTopic = (destination: string, callback: (message: any) => void) => {
    chatWebSocketClient.subscribe(destination, callback);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, subscribeToTopic }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};