import { useState, useCallback } from "react";
import { chatUserService } from "@/services/chat-user-service";
import type { ChatUserRequest } from "@/types/chat.type";

export const useChatUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChatsByMemberId = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    keywords: string = "",
    page: number = 0,
    size: number = 10,
    ascSort: boolean = false,
    type?: string,
    joinDateStart?: string,
    joinDateEnd?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.getChatsByMemberId(
        accountId,
        requesterId,
        keywords,
        page,
        size,
        ascSort,
        type,
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

  const getChatByChatId = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.getChatByChatId(
        accountId,
        requesterId,
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

  const getChatAvatar = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.getChatAvatar(
        accountId,
        requesterId,
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

  const postChat = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatRequest: ChatUserRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.postChat(
        accountId,
        requesterId,
        chatRequest
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const patchChatName = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatId: string,
    name: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.patchChatName(
        accountId,
        requesterId,
        chatId,
        name
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const patchChatAvatar = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatId: string,
    avatarFile: File
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.patchChatAvatar(
        accountId,
        requesterId,
        chatId,
        avatarFile
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateChat = useCallback(async (
    accountId: string | null,
    requesterId: string | null,
    chatId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatUserService.deactivateChat(
        accountId,
        requesterId,
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
    getChatsByMemberId,
    getChatByChatId,
    getChatAvatar,
    postChat,
    patchChatName,
    patchChatAvatar,
    deactivateChat,
  };
};