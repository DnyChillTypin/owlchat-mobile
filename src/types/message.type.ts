import type { MessageType } from "./enum/mesage-type";
import type { MessageState } from "./enum/message-state";

export interface FileMessageUserRequest {
    chatId: string;
    type: string;
    file: File; // Corresponds to MultipartFile in Java
}

export interface MessageUpdateContentRequest {
    content: string;
}

export interface ResourceData {
    contentType: string;
    resource: any; // You may replace `any` with a more specific type if needed
}

export interface TextMessageUserRequest {
    chatId: string;
    content: string;
}

export interface Message {
    id: string;
    chatId: string;
    status: boolean;
    //   state: "ORIGIN" | "EDITED" | "REMOVED";
    state: MessageState;
    type: MessageType;
    //   type: "SYSTEM_MESSAGE" | "TEXT" | "IMG" | "VID" | "GENERIC_FILE";
    content: string;
    senderId: string;
    predecessorId?: string;
    sentDate: string;
    removedDate?: string;
    isRead?: boolean;
    readAt?: string;
    reactions?: Record<string, string>;
    createdDate: string;
}
