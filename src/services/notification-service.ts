import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type { NotificationItem } from "@/types/notification.type";

const NOTIFICATION_BASE_URL = `${API_ENDPOINTS.SOCIAL_SERVICE}/notification`;

export const notificationService = {
    async getNotifications(
        accountId: string | null = null,
        requesterId: string | null = null,
        page = 0,
        size = 20
    ): Promise<NotificationItem[]> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const params = { requesterId, page, size };
        const response = await apiClient.get(`${NOTIFICATION_BASE_URL}`, { headers, params });
        return response.data;
    },

    async getUnreadNotifications(
        accountId: string | null = null,
        requesterId: string | null = null,
        page = 0,
        size = 20
    ): Promise<NotificationItem[]> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const params = { requesterId, page, size };
        const response = await apiClient.get(`${NOTIFICATION_BASE_URL}/unread`, { headers, params });
        return response.data;
    },

    async getUnreadCount(
        accountId: string | null = null,
        requesterId: string | null = null,
    ): Promise<number> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const params = { requesterId };
        const response = await apiClient.get(`${NOTIFICATION_BASE_URL}/unread/count`, { headers, params });
        return response.data;
    },

    async markAsRead(
        accountId: string | null = null,
        requesterId: string | null = null,
        id: string
    ): Promise<NotificationItem> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const params = { requesterId };
        const response = await apiClient.patch(`${NOTIFICATION_BASE_URL}/${id}/read`, null, { headers, params });
        return response.data;
    },

    async markAllAsRead(
        accountId: string | null = null,
        requesterId: string | null = null,
    ): Promise<void> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const params = { requesterId };
        await apiClient.patch(`${NOTIFICATION_BASE_URL}/read-all`, null, { headers, params });
    },

    async deleteNotification(
        accountId: string | null = null,
        requesterId: string | null = null,
        id: string
    ): Promise<void> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const params = { requesterId };
        await apiClient.delete(`${NOTIFICATION_BASE_URL}/${id}`, { headers, params });
    },
};
