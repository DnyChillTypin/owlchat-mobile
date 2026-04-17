import { useCallback, useState } from "react";
import { friendUserService } from "@/services/friend-service";
import type {
  FriendRequest,
  FriendRequestCreateUserRequest,
  FriendRequestResponseRequest,
} from "../types/friend.type";

type UseFriendState = {
  loading: boolean;
  error: string | null;
};

export const useFriend = () => {
  const [state, setState] = useState<UseFriendState>({
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }));
  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }));

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFriendRequests = useCallback(
    async (
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
      updatedDateEnd?: string
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getFriendRequests(
          accountId,
          requesterId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getFriendRequestById = useCallback(
    async (accountId: string | null = null, requesterId: string | null = null, id: string): Promise<FriendRequest> =>
      wrap(() => friendUserService.getFriendRequestById(accountId, requesterId, id)),
    [wrap]
  );

  const getSendFriendRequests = useCallback(
    async (
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
      updatedDateEnd?: string
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getSendFriendRequests(
          accountId,
          requesterId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getReceiveFriendRequests = useCallback(
    async (
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
      updatedDateEnd?: string
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getReceiveFriendRequests(
          accountId,
          requesterId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getFriendRequestsWithUser = useCallback(
    async (
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
      updatedDateEnd?: string
    ): Promise<FriendRequest[]> =>
      wrap(() =>
        friendUserService.getFriendRequestsWithUser(
          accountId,
          requesterId,
          userId,
          page,
          size,
          ascSort,
          keywords,
          status,
          createdDateStart,
          createdDateEnd,
          updatedDateStart,
          updatedDateEnd
        )
      ),
    [wrap]
  );

  const getFriendRequestFromRequesterToUser = useCallback(
    async (accountId: string | null = null, requesterId: string | null = null, receiverId: string): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.getFriendRequestFromRequesterToUser(
          accountId,
          requesterId,
          receiverId
        )
      ),
    [wrap]
  );

  const getFriendRequestFromUserToRequester = useCallback(
    async (accountId: string | null = null, requesterId: string | null = null, senderId: string): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.getFriendRequestFromUserToRequester(
          accountId,
          requesterId,
          senderId
        )
      ),
    [wrap]
  );

  const postFriendRequest = useCallback(
    async (
      accountId: string | null = null,
      requesterId: string | null = null,
      request: FriendRequestCreateUserRequest
    ): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.postFriendRequest(accountId, requesterId, request)
      ),
    [wrap]
  );

  const patchFriendRequestStatus = useCallback(
    async (
      accountId: string | null = null,
      requesterId: string | null = null,
      id: string,
      request: FriendRequestResponseRequest
    ): Promise<FriendRequest> =>
      wrap(() =>
        friendUserService.patchFriendRequestStatus(
          accountId,
          requesterId,
          id,
          request
        )
      ),
    [wrap]
  );

  const deleteFriendRequest = useCallback(
    async (accountId: string | null = null, requesterId: string | null = null, id: string): Promise<void> =>
      wrap(() => friendUserService.deleteFriendRequest(accountId, requesterId, id)),
    [wrap]
  );

  return {
    loading: state.loading,
    error: state.error,
    getFriendRequests,
    getFriendRequestById,
    getSendFriendRequests,
    getReceiveFriendRequests,
    getFriendRequestsWithUser,
    getFriendRequestFromRequesterToUser,
    getFriendRequestFromUserToRequester,
    postFriendRequest,
    patchFriendRequestStatus,
    deleteFriendRequest,
  };
};