import { useState, useCallback } from "react";
import type { Friendship } from "@/types/friendship.type";
import friendshipService from "@/services/friendship-service";
export const useFriendship = (
    accountId: string | null = null,
    requesterId: string | null = null,
) => {
    const [friendships, setFriendships] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFriendships = useCallback(
        async (
            page: number = 0,
            size: number = 10,
            ascSort: boolean = true,
            createdDateStart?: string,
            createdDateEnd?: string,
        ) => {
            // Don't fetch if we don't know who we are yet
            if (!requesterId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await friendshipService.getFriendships(
                    accountId,
                    requesterId,
                    page,
                    size,
                    ascSort,
                    createdDateStart,
                    createdDateEnd,
                );
                console.log("[useFriendship] Raw data received:", JSON.stringify(data)?.substring(0, 500));
                setFriendships(data);
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching friendships",
                );
            } finally {
                setLoading(false);
            }
        },
        [accountId, requesterId],
    );

    const fetchFriendshipById = useCallback(
        async (id: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await friendshipService.getFriendshipById(
                    accountId,
                    requesterId,
                    id,
                );
                return data;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching friendship",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [accountId, requesterId],
    );

    const fetchFriendshipWithUser = useCallback(
        async (userId: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await friendshipService.getFriendshipWithUser(
                    accountId,
                    requesterId,
                    userId,
                );
                return data;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching friendship with user",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [accountId, requesterId],
    );

    const deleteFriendship = useCallback(
        async (id: string) => {
            setLoading(true);
            setError(null);
            try {
                const message = await friendshipService.deleteFriendship(
                    accountId,
                    requesterId,
                    id,
                );
                setFriendships((prev) =>
                    prev.filter((friendship) => friendship.id !== id),
                );
                return message;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while deleting friendship",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [accountId, requesterId],
    );

    return {
        friendships,
        loading,
        error,
        fetchFriendships,
        fetchFriendshipById,
        fetchFriendshipWithUser,
        deleteFriendship,
    };
};
