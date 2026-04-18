import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type {
  ChatMemberCreateUserRequest,
  ChatMemberUpdateNicknameRequest,
  ChatMemberUpdateRoleRequest,
} from "@/types/chat.type";

const CHAT_MEMBER_API = `${API_ENDPOINTS.CHAT_SERVICE}/member`;

/** Strip null/undefined values so they don't serialize as "null" in query params */
function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined)
  );
}

export const chatMemberUserService = {
  async getChatMembersByMemberId(
    accountId: string | null,
    requesterId: string | null,
    keywords: string = "",
    page: number = 0,
    size: number = 10,
    ascSort: boolean = true,
    role?: string,
    joinDateStart?: string,
    joinDateEnd?: string
  ) {
    try {
      const params = cleanParams({
        requesterId,
        keywords,
        page,
        size,
        ascSort,
        role,
        joinDateStart,
        joinDateEnd,
      });

      const response = await apiClient.get(CHAT_MEMBER_API, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching chat members by member ID");
    }
  },

  async getChatMembersByChatId(
    accountId: string | null,
    requesterId: string | null,
    chatId: string,
    keywords: string = "",
    page: number = 0,
    size: number = 10,
    ascSort: boolean = true,
    role?: string,
    joinDateStart?: string,
    joinDateEnd?: string
  ) {
    try {
      const params = cleanParams({
        requesterId,
        keywords,
        page,
        size,
        ascSort,
        role,
        joinDateStart,
        joinDateEnd,
      });

      const response = await apiClient.get(`${CHAT_MEMBER_API}/chat/${chatId}`, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching chat members by chat ID");
    }
  },

  async getChatMemberByChatIdAndMemberId(
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string
  ) {
    try {
      const response = await apiClient.get(`${CHAT_MEMBER_API}/${memberId}/chat/${chatId}`, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching chat member by chat ID and member ID");
    }
  },

  async postChatMember(
    accountId: string | null,
    requesterId: string | null,
    chatMemberCreateRequest: ChatMemberCreateUserRequest
  ) {
    try {
      const response = await apiClient.post(CHAT_MEMBER_API, chatMemberCreateRequest, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error creating chat member");
    }
  },

  async patchChatMemberRole(
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string,
    roleRequest: ChatMemberUpdateRoleRequest
  ) {
    try {
      const response = await apiClient.patch(`${CHAT_MEMBER_API}/${memberId}/chat/${chatId}/role`, roleRequest, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error updating chat member role");
    }
  },

  async patchChatMemberNickname(
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string,
    nicknameRequest: ChatMemberUpdateNicknameRequest
  ) {
    try {
      const response = await apiClient.patch(`${CHAT_MEMBER_API}/${memberId}/chat/${chatId}/nickname`, nicknameRequest, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error updating chat member nickname");
    }
  },

  async deleteChatMember(
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string
  ) {
    try {
      const response = await apiClient.delete(`${CHAT_MEMBER_API}/${memberId}/chat/${chatId}`, {
        headers: {
          "X-Account-Id": accountId || "",
        },
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error deleting chat member");
    }
  },
  
  async markAsRead(
    accountId: string | null,
    requesterId: string | null,
    chatId: string
  ) {
    try {
      const response = await apiClient.post(`${CHAT_MEMBER_API}/read/chat/${chatId}`, {}, {
        headers: accountId ? { "X-Account-Id": accountId } : undefined,
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      console.error("[ChatMemberService] Failed to mark chat as read:", error);
      throw new Error(error.response?.data || "Error marking chat as read");
    }
  },
};

export default chatMemberUserService;