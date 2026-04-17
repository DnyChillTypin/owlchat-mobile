import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import type {
  FriendRequest,
  FriendRequestCreateUserRequest,
  FriendRequestResponseRequest,
} from "../types/friend.type";

const FRIEND_REQUEST_BASE_URL = `${API_ENDPOINTS.SOCIAL_SERVICE}/friend-request`;

/** Remove null/undefined values from query param objects so they're not serialized as "null" */
function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined),
  );
}

export const friendUserService = {
  async getFriendRequests(
    accountId: string | null = null,
    requesterId: string | null = null,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string,
  ): Promise<FriendRequest[]> {
    const params = cleanParams({
      requesterId,
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    });
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}`, {
      headers,
      params,
    });
    return response.data;
  },

  async getFriendRequestById(
    accountId: string | null = null,
    requesterId: string | null = null,
    id: string,
  ): Promise<FriendRequest> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = cleanParams({ requesterId });
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/${id}`, {
      headers,
      params,
    });
    return response.data;
  },

  async getSendFriendRequests(
    accountId: string | null = null,
    requesterId: string | null = null,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string,
  ): Promise<FriendRequest[]> {
    const params = cleanParams({
      requesterId,
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    });
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/send`, {
      headers,
      params,
    });
    return response.data;
  },

  async getReceiveFriendRequests(
    accountId: string | null = null,
    requesterId: string | null = null,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string,
  ): Promise<FriendRequest[]> {
    const params = cleanParams({
      requesterId,
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    });
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const response = await apiClient.get(`${FRIEND_REQUEST_BASE_URL}/receive`, {
      headers,
      params,
    });
    return response.data;
  },

  async getFriendRequestsWithUser(
    accountId: string | null = null,
    requesterId: string | null = null,
    userId: string,
    page = 0,
    size = 10,
    ascSort = true,
    keywords?: string,
    status?: string,
    createdDateStart?: string,
    createdDateEnd?: string,
    updatedDateStart?: string,
    updatedDateEnd?: string,
  ): Promise<FriendRequest[]> {
    const params = cleanParams({
      requesterId,
      page,
      size,
      ascSort,
      keywords,
      status,
      createdDateStart,
      createdDateEnd,
      updatedDateStart,
      updatedDateEnd,
    });
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const response = await apiClient.get(
      `${FRIEND_REQUEST_BASE_URL}/user/${userId}`,
      { headers, params },
    );
    return response.data;
  },

  async getFriendRequestFromRequesterToUser(
    accountId: string | null = null,
    requesterId: string | null = null,
    receiverId: string,
  ): Promise<FriendRequest> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = cleanParams({ requesterId });
    const response = await apiClient.get(
      `${FRIEND_REQUEST_BASE_URL}/receiver/${receiverId}`,
      { headers, params },
    );
    return response.data;
  },

  async getFriendRequestFromUserToRequester(
    accountId: string | null = null,
    requesterId: string | null = null,
    senderId: string,
  ): Promise<FriendRequest> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = cleanParams({ requesterId });
    const response = await apiClient.get(
      `${FRIEND_REQUEST_BASE_URL}/sender/${senderId}`,
      { headers, params },
    );
    return response.data;
  },

  async postFriendRequest(
    accountId: string | null = null,
    requesterId: string | null = null,
    request: FriendRequestCreateUserRequest,
  ): Promise<FriendRequest> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = cleanParams({ requesterId });
    const response = await apiClient.post(
      `${FRIEND_REQUEST_BASE_URL}`,
      request,
      { headers, params },
    );
    return response.data;
  },

  async patchFriendRequestStatus(
    accountId: string | null = null,
    requesterId: string | null = null,
    id: string,
    request: FriendRequestResponseRequest,
  ): Promise<FriendRequest> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = cleanParams({ requesterId });
    const response = await apiClient.patch(
      `${FRIEND_REQUEST_BASE_URL}/${id}/response`,
      request,
      { headers, params },
    );
    return response.data;
  },

  async deleteFriendRequest(
    accountId: string | null = null,
    requesterId: string | null = null,
    id: string,
  ): Promise<void> {
    const headers = accountId ? { "X-Account-Id": accountId } : undefined;
    const params = cleanParams({ requesterId });
    await apiClient.delete(`${FRIEND_REQUEST_BASE_URL}/${id}`, {
      headers,
      params,
    });
  },
};
