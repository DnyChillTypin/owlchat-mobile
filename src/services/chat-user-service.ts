import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const CHAT_API = `${API_ENDPOINTS.CHAT_SERVICE}/chat`;

/** Strip null/undefined values so they don't serialize as "null" in query params */
function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined)
  );
}

export const chatUserService = {
    async getChatsByMemberId(
        accountId: string | null,
        requesterId: string | null,
        keywords: string = "",
        page: number = 0,
        size: number = 10,
        ascSort: boolean = false,
        type?: string,
        joinDateStart?: string,
        joinDateEnd?: string,
    ) {
        try {
            const params = cleanParams({
                requesterId,
                keywords,
                page,
                size,
                ascSort,
                type,
                joinDateStart,
                joinDateEnd,
            });

            const response = await apiClient.get(`${CHAT_API}/member`, {
                headers: {
                    "X-Account-Id": accountId || "",
                },
                params,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data || "Error fetching chats by member ID",
            );
        }
    },

    async getChatByChatId(
        accountId: string | null,
        requesterId: string | null,
        chatId: string,
    ) {
        try {
            const response = await apiClient.get(`${CHAT_API}/${chatId}`, {
                headers: {
                    "X-Account-Id": accountId || "",
                },
                params: cleanParams({ requesterId }),
            });
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data || "Error fetching chat by ID",
            );
        }
    },

    async getChatAvatar(
        accountId: string | null,
        requesterId: string | null,
        chatId: string,
    ) {
        try {
            const response = await apiClient.get(
                `${CHAT_API}/${chatId}/avatar`,
                {
                    headers: {
                        "X-Account-Id": accountId || "",
                    },
                    params: cleanParams({ requesterId }),
                    responseType: "blob", 
                },
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data || "Error fetching chat avatar",
            );
        }
    },

    async postChat(
        accountId: string | null,
        requesterId: string | null,
        chatRequest: any,
    ) {
        try {
            const response = await apiClient.post(CHAT_API, chatRequest, {
                headers: {
                    "X-Account-Id": accountId || "",
                },
                params: cleanParams({ requesterId }),
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data || "Error creating chat");
        }
    },

    async patchChatName(
        accountId: string | null,
        requesterId: string | null,
        chatId: string,
        name: string,
    ) {
        try {
            const response = await apiClient.patch(
                `${CHAT_API}/${chatId}/name`,
                { name },
                {
                    headers: {
                        "X-Account-Id": accountId || "",
                    },
                    params: cleanParams({ requesterId }),
                },
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data || "Error updating chat name");
        }
    },

    async patchChatAvatar(
        accountId: string | null,
        requesterId: string | null,
        chatId: string,
        avatarFile: File,
    ) {
        try {
            const formData = new FormData();
            formData.append("file", avatarFile);

            const response = await apiClient.post(
                `${CHAT_API}/${chatId}/avatar/upload`,
                formData,
                {
                    headers: {
                        "X-Account-Id": accountId || "",
                        "Content-Type": "multipart/form-data",
                    },
                    params: cleanParams({ requesterId }),
                },
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data || "Error uploading chat avatar",
            );
        }
    },

    async deactivateChat(
        accountId: string | null,
        requesterId: string | null,
        chatId: string,
    ) {
        try {
            const response = await apiClient.delete(
                `${CHAT_API}/${chatId}/deactivate`,
                {
                    headers: {
                        "X-Account-Id": accountId || "",
                    },
                    params: cleanParams({ requesterId }),
                },
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data || "Error deactivating chat");
        }
    },
};

export default chatUserService;
