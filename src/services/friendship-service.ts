import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

const FRIENDSHIP_API = `${API_ENDPOINTS.SOCIAL_SERVICE}/friendship`;

/** Strip null/undefined values so they don't serialize as "null" in query params */
function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined),
  );
}

export const friendshipService = {
  async getFriendships(
    accountId: string | null,
    requesterId: string | null,
    page: number = 0,
    size: number = 10,
    ascSort: boolean = true,
    createdDateStart?: string,
    createdDateEnd?: string,
  ) {
    try {
      const headers = accountId ? { "X-Account-Id": accountId } : undefined;
      const params = cleanParams({
        requesterId,
        page,
        size,
        ascSort,
        createdDateStart,
        createdDateEnd,
      });

      const response = await apiClient.get(FRIENDSHIP_API, { headers, params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error fetching friendships");
    }
  },

  async getFriendshipById(
    accountId: string | null,
    requesterId: string | null,
    id: string,
  ) {
    try {
      const headers = accountId ? { "X-Account-Id": accountId } : undefined;
      const response = await apiClient.get(`${FRIENDSHIP_API}/${id}`, {
        headers,
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data || "Error fetching friendship by ID",
      );
    }
  },

  async getFriendshipWithUser(
    accountId: string | null,
    requesterId: string | null,
    userId: string,
  ) {
    try {
      const headers = accountId ? { "X-Account-Id": accountId } : undefined;
      const response = await apiClient.get(`${FRIENDSHIP_API}/user/${userId}`, {
        headers,
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data || "Error fetching friendship with user",
      );
    }
  },

  async deleteFriendship(
    accountId: string | null,
    requesterId: string | null,
    id: string,
  ) {
    try {
      const headers = accountId ? { "X-Account-Id": accountId } : undefined;
      const response = await apiClient.delete(`${FRIENDSHIP_API}/${id}`, {
        headers,
        params: cleanParams({ requesterId }),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Error deleting friendship");
    }
  },
};

export default friendshipService;
