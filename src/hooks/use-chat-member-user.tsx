import { useState, useCallback } from "react";
import { chatMemberUserService } from "@/services/chat-member-user-service";
import type {
  ChatMemberCreateUserRequest,
  ChatMemberUpdateNicknameRequest,
  ChatMemberUpdateRoleRequest,
} from "@/types/chat.type";

export const useChatMemberUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChatMembersByMemberId = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    keywords: string = "",
    page: number = 0,
    size: number = 10,
    ascSort: boolean = true,
    role?: string,
    joinDateStart?: string,
    joinDateEnd?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.getChatMembersByMemberId(
        accountId,
        requesterId,
        keywords,
        page,
        size,
        ascSort,
        role,
        joinDateStart,
        joinDateEnd
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChatMembersByChatId = useCallback(async (
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
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.getChatMembersByChatId(
        accountId,
        requesterId,
        chatId,
        keywords,
        page,
        size,
        ascSort,
        role,
        joinDateStart,
        joinDateEnd
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChatMemberByChatIdAndMemberId = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.getChatMemberByChatIdAndMemberId(
        accountId,
        requesterId,
        memberId,
        chatId
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const postChatMember = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatMemberCreateRequest: ChatMemberCreateUserRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.postChatMember(
        accountId,
        requesterId,
        chatMemberCreateRequest
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const patchChatMemberRole = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string,
    roleRequest: ChatMemberUpdateRoleRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.patchChatMemberRole(
        accountId,
        requesterId,
        memberId,
        chatId,
        roleRequest
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const patchChatMemberNickname = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string,
    nicknameRequest: ChatMemberUpdateNicknameRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.patchChatMemberNickname(
        accountId,
        requesterId,
        memberId,
        chatId,
        nicknameRequest
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteChatMember = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    memberId: string,
    chatId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatMemberUserService.deleteChatMember(
        accountId,
        requesterId,
        memberId,
        chatId
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getChatMembersByMemberId,
    getChatMembersByChatId,
    getChatMemberByChatIdAndMemberId,
    postChatMember,
    patchChatMemberRole,
    patchChatMemberNickname,
    deleteChatMember,
  };
};