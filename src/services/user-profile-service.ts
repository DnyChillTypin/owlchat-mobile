import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
// import {
//   UserProfile,
//   UserProfileRequest,
//   UserProfileCreateRequest,
// } from "../types/user-profile.type";
import type {
    UserProfile,
    UserProfileCreateRequest,
    UserProfileRequest,
} from "@/types/user-profile.type";

const USER_PROFILE_BASE_URL = `${API_ENDPOINTS.USER_SERVICE}/user`;

export const userProfileService = {
    async getProfiles(
        keywords: string = "",
        page: number = 0,
        size: number = 10,
        gender: number = 0,
        dateOfBirthStart?: string,
        dateOfBirthEnd?: string,
        ascSort: boolean = true,
    ): Promise<UserProfile[]> {
        const params = {
            keywords,
            page,
            size,
            gender,
            dateOfBirthStart,
            dateOfBirthEnd,
            ascSort,
        };
        const response = await apiClient.get(`${USER_PROFILE_BASE_URL}`, {
            params,
        });
        return response.data;
    },

    async getProfileById(id: string): Promise<UserProfile> {
        const response = await apiClient.get(`${USER_PROFILE_BASE_URL}/${id}`);
        return response.data;
    },

    async getUserProfile(accountId: string| null = null): Promise<UserProfile> {
        const headers = accountId ? { "X-Account-Id": accountId } : undefined;
        const response = await apiClient.get(`${USER_PROFILE_BASE_URL}/me`, {
            headers,
        });
        return response.data;
    },

    async addNewProfile(
        userProfileCreateRequest: UserProfileCreateRequest,
    ): Promise<UserProfile> {
        const response = await apiClient.post(
            `${USER_PROFILE_BASE_URL}`,
            userProfileCreateRequest,
        );
        return response.data;
    },

    async addNewProfileToAccount(
        accountId: string,
        userProfileRequest: UserProfileRequest,
    ): Promise<UserProfile> {
        const response = await apiClient.post(
            `${USER_PROFILE_BASE_URL}/account/${accountId}`,
            userProfileRequest,
        );
        return response.data;
    },

    async updateProfile(
        id: string,
        userProfileRequest: UserProfileRequest,
    ): Promise<UserProfile> {
        const response = await apiClient.put(
            `${USER_PROFILE_BASE_URL}/${id}`,
            userProfileRequest,
        );
        return response.data;
    },

    async deleteProfile(id: string): Promise<void> {
        await apiClient.delete(`${USER_PROFILE_BASE_URL}/${id}`);
    },

    async uploadUserAvatar(id: string, avatarFile: any): Promise<string> {
        console.log(`[userProfileService] Starting upload for user: ${id}`);
        
        const formData = new FormData();
        formData.append("file", avatarFile);

        const response = await apiClient.post(
            `${USER_PROFILE_BASE_URL}/${id}/avatar/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                // prevent axios from stringifying the FormData
                transformRequest: (data) => data,
            },
        );
        return response.data;
    },

    async getUserAvatar(id: string): Promise<Blob> {
        const response = await apiClient.get(
            `${USER_PROFILE_BASE_URL}/${id}/avatar`,
            {
                responseType: "blob",
            },
        );
        return response.data;
    },

    getAvatarUrl(id: string): string {
        return `${USER_PROFILE_BASE_URL}/${id}/avatar?t=${Date.now()}`;
    }
};
