import { useState, useEffect, useCallback } from "react";
import { userProfileService } from "@/services/user-profile-service";
import type {
    UserProfile,
    UserProfileCreateRequest,
    UserProfileRequest,
} from "@/types/user-profile.type";

export const useUserProfile = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfiles = useCallback(
        async (
            keywords: string = "",
            page: number = 0,
            size: number = 10,
            gender: number = 0,
            dateOfBirthStart?: string,
            dateOfBirthEnd?: string,
            ascSort: boolean = true,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userProfileService.getProfiles(
                    keywords,
                    page,
                    size,
                    gender,
                    dateOfBirthStart,
                    dateOfBirthEnd,
                    ascSort,
                );
                setProfiles(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch profiles");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const fetchProfileById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userProfileService.getProfileById(id);
            setProfile(data);
            return data; 
        } catch (err: any) {
            setError(err.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = useCallback(async (accountId: string | null = null) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userProfileService.getUserProfile(accountId);
            setProfile(data);
            return data;
        } catch (err: any) {
            setError(err.message || "Failed to fetch user profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const createProfile = useCallback(
        async (userProfileCreateRequest: UserProfileCreateRequest) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userProfileService.addNewProfile(
                    userProfileCreateRequest,
                );
                setProfile(data);
            } catch (err: any) {
                setError(err.message || "Failed to create profile");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const updateProfile = useCallback(
        async (id: string, userProfileRequest: UserProfileRequest) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userProfileService.updateProfile(
                    id,
                    userProfileRequest,
                );
                setProfile(data);
            } catch (err: any) {
                setError(err.message || "Failed to update profile");
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const deleteProfile = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await userProfileService.deleteProfile(id);
            setProfile(null);
        } catch (err: any) {
            setError(err.message || "Failed to delete profile");
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadAvatar = useCallback(async (id: string, avatarFile: File) => {
        setLoading(true);
        setError(null);
        try {
            const avatarUrl = await userProfileService.uploadUserAvatar(
                id,
                avatarFile,
            );
            return avatarUrl;
        } catch (err: any) {
            setError(err.message || "Failed to upload avatar");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAvatar = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const avatarBlob = await userProfileService.getUserAvatar(id);
            return avatarBlob;
        } catch (err: any) {
            setError(err.message || "Failed to fetch avatar");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        profiles,
        profile,
        loading,
        error,
        fetchProfiles,
        fetchProfileById,
        fetchUserProfile,
        createProfile,
        updateProfile,
        deleteProfile,
        uploadAvatar,
        fetchAvatar,
    };
};
