import { messageUserService } from "./message-user-service";
import type { TextMessageUserRequest } from "@/types/message.type";

/**
 * WebSocket Message Service
 * Handles sending messages via WebSocket and async persistence via CRUD
 */
export const websocketMessageService = {
  /**
   * Send message via WebSocket (realtime)
   * @param sendMessage - WebSocket send function
   * @param chatId - Chat ID
   * @param content - Message content
   */
  sendViaWebSocket(
    sendMessage: (destination: string, body: any) => void,
    chatId: string,
    content: string,
    userId: string,
  ): void {
    const destination = `/app/chat.send`; // App endpoint - server processes it
    const timestamp = new Date().toISOString();

    sendMessage(destination, {
      chatId,
      content,
      userId,
      timestamp,
      type: "TEXT",
    });
  },

  /**
   * Save message to DB asynchronously (fire & forget)
   * @param textMessageRequest - Message content
   * @returns Promise (not awaited in UI)
   */
  async saveMessageAsync(
    accountId: string | null,
    requesterId: string | null,
    textMessageRequest: TextMessageUserRequest,
  ): Promise<void> {
    // Fire and forget - don't throw errors or block UI
    try {
      await messageUserService.postNewTextMessage(
        accountId,
        requesterId,
        textMessageRequest,
      );
    } catch (error) {
      // Log error but don't propagate to UI
      console.error("[WebSocket Message Service] Async save failed:", error);
    }
  },

  /**
   * Handle incoming message from WebSocket
   * Transforms it to UI format
   */
  transformWebSocketMessage(wsMessage: any): any {
    return {
      id: wsMessage.id || `temp-${Date.now()}`,
      chatId: wsMessage.chatId,
      content: wsMessage.content,
      senderId: wsMessage.userId || wsMessage.senderId,
      sentDate: wsMessage.timestamp || new Date().toISOString(),
      createdDate: wsMessage.timestamp || new Date().toISOString(),
      state: "ORIGIN",
      type: wsMessage.type || "TEXT",
    };
  },
};
