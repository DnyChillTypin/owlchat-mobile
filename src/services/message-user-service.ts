import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type {
  MessageUpdateContentRequest,
  TextMessageUserRequest,
  ResourceData,
} from "../types/message.type";

const MESSAGE_BASE_URL = `${API_ENDPOINTS.CHAT_SERVICE}/message`;

export const messageUserService = {
  async getMessagesByChatId(
    accountId: string | null = null,
    requesterId: string | null = null,
    chatId: string,
    keywords: string = "",
    page: number = 0,
    size: number = 10,
    ascSort: boolean = false,
    type: string = "ALL",
    senderId: string = "",
    sentDateStart?: string,
    sentDateEnd?: string,
  ): Promise<any> {
    const params = {
      requesterId,
      keywords,
      page,
      size,
      ascSort,
      type,
      senderId,
      sentDateStart,
      sentDateEnd,
    };
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const response = await apiClient.get(`${MESSAGE_BASE_URL}/chat/${chatId}`, {
      headers,
      params,
    });
    return response.data;
  },

  async getMessageById(
    accountId: string | null = null,
    requesterId: string | null = null,
    messageId: string,
  ): Promise<any> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = { requesterId };
    const response = await apiClient.get(`${MESSAGE_BASE_URL}/${messageId}`, {
      headers,
      params,
    });
    return response.data;
  },

  async getMessageFile(
    accountId: string | null = null,
    requesterId: string | null = null,
    messageId: string,
  ): Promise<ResourceData> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = { requesterId };
    const response = await apiClient.get(
      `${MESSAGE_BASE_URL}/${messageId}/resource`,
      {
        headers,
        params,
        responseType: "blob", // To handle file download
      },
    );
    return {
      contentType: response.headers["content-type"],
      resource: response.data,
    };
  },

  async postNewTextMessage(
    accountId: string | null = null,
    requesterId: string | null = null,
    textMessageRequest: TextMessageUserRequest,
  ): Promise<any> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = { requesterId };
    const response = await apiClient.post(
      `${MESSAGE_BASE_URL}`,
      textMessageRequest,
      { headers, params },
    );
    return response.data;
  },

  async postNewFileMessage(
    accountId: string | null = null,
    requesterId: string | null = null,
    chatId: string,
    type: string,
    file: any,
  ): Promise<any> {
    const headers: Record<string, string> = {
      chatId: chatId,
      type: type,
    };
    if (accountId) {
      headers["X-Account-Id"] = accountId;
    }
    const params = { requesterId };
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `${MESSAGE_BASE_URL}/resource/upload`,
      formData,
      {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        params,
        // prevent axios from stringifying the FormData
        transformRequest: (data) => data,
      },
    );
    return response.data;
  },

  async putTextMessage(
    accountId: string | null = null,
    requesterId: string | null = null,
    messageId: string,
    content: MessageUpdateContentRequest,
  ): Promise<any> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = { requesterId };
    const response = await apiClient.put(
      `${MESSAGE_BASE_URL}/${messageId}/edit`,
      content,
      { headers, params },
    );
    return response.data;
  },

  async softDeleteMessage(
    accountId: string | null = null,
    requesterId: string | null = null,
    messageId: string,
  ): Promise<void> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = { requesterId };
    await apiClient.delete(`${MESSAGE_BASE_URL}/${messageId}`, {
      headers,
      params,
    });
  },

  async reactToMessage(
    accountId: string | null = null,
    requesterId: string | null = null,
    messageId: string,
    emoji: string,
  ): Promise<any> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = { requesterId, emoji };
    const response = await apiClient.put(
      `${MESSAGE_BASE_URL}/${messageId}/react`,
      {},
      { headers, params },
    );
    return response.data;
  },
};
