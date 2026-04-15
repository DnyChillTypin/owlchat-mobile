import { useState, useEffect, useCallback } from "react";
import { messageUserService } from "@/services/message-user-service";
import type {
    FileMessageUserRequest,
    MessageUpdateContentRequest,
    TextMessageUserRequest,
    ResourceData,
} from "@/types/message.type";

export const useMessageUser = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // const getMessagesByChatId = useCallback(
    //     async (
    //         accountId: string | null,
    //         requesterId: string | null,
    //         chatId: string,
    //         keywords: string = "",
    //         page: number = 0,
    //         size: number = 10,
    //         ascSort: boolean = false,
    //         type: string = "ALL",
    //         senderId: string = "",
    //         sentDateStart?: string,
    //         sentDateEnd?: string,
    //     ) => {
    //         setLoading(true);
    //         setError(null);
    //         try {
    //             const data = await messageUserService.getMessagesByChatId(
    //                 accountId,
    //                 requesterId,
    //                 chatId,
    //                 keywords,
    //                 page,
    //                 size,
    //                 ascSort,
    //                 type,
    //                 senderId,
    //                 sentDateStart,
    //                 sentDateEnd,
    //             );
    //             setMessages(data);
    //         } catch (err: any) {
    //             setError(
    //                 err.message || "An error occurred while fetching messages.",
    //             );
    //         } finally {
    //             setLoading(false);
    //         }
    //     },
    //     [],
    // );
    const getMessagesByChatId = useCallback(
        async (
            accountId: string | null,
            requesterId: string | null,
            chatId: string,
            keywords: string = "",
            page: number = 0,
            size: number = 10,
            ascSort: boolean = false,
            type: string = "ALL",
            senderId: string = "",
            sentDateStart?: string,
            sentDateEnd?: string,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await messageUserService.getMessagesByChatId(
                    accountId,
                    requesterId,
                    chatId,
                    keywords,
                    page,
                    size,
                    ascSort,
                    type,
                    senderId,
                    sentDateStart,
                    sentDateEnd,
                );
                if (page === 0) {
                    setMessages(data); // Nếu là trang đầu tiên, thay thế danh sách tin nhắn
                } else {
                    setMessages((prevMessages) => [...prevMessages, ...data]); // Thêm tin nhắn cũ vào đầu danh sách
                }
                return data;
            } catch (err: any) {
                setError(
                    err.message || "An error occurred while fetching messages.",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );
    const getMessageById = useCallback(
        async (
            accountId: string | null,
            requesterId: string | null,
            messageId: string,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await messageUserService.getMessageById(
                    accountId,
                    requesterId,
                    messageId,
                );
                return data;
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while fetching the message.",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const postNewTextMessage = useCallback(
        async (
            accountId: string | null,
            requesterId: string | null,
            textMessageRequest: TextMessageUserRequest,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await messageUserService.postNewTextMessage(
                    accountId,
                    requesterId,
                    textMessageRequest,
                );
                setMessages((prevMessages) => [data, ...prevMessages]);
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while sending the message.",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const postNewFileMessage = useCallback(
        async (
            accountId: string | null,
            requesterId: string | null,
            chatId: string,
            type: string,
            file: any,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await messageUserService.postNewFileMessage(
                    accountId,
                    requesterId,
                    chatId,
                    type,
                    file,
                );
                setMessages((prevMessages) => [data, ...prevMessages]);
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while uploading the file.",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const putTextMessage = useCallback(
        async (
            accountId: string | null,
            requesterId: string | null,
            messageId: string,
            content: MessageUpdateContentRequest,
        ) => {
            setLoading(true);
            setError(null);
            try {
                const data = await messageUserService.putTextMessage(
                    accountId,
                    requesterId,
                    messageId,
                    content,
                );
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === messageId
                            ? { ...msg, content: data.content }
                            : msg,
                    ),
                );
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while updating the message.",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const softDeleteMessage = useCallback(
        async (
            accountId: string | null,
            requesterId: string | null,
            messageId: string,
        ) => {
            setLoading(true);
            setError(null);
            try {
                await messageUserService.softDeleteMessage(
                    accountId,
                    requesterId,
                    messageId,
                );
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== messageId),
                );
            } catch (err: any) {
                setError(
                    err.message ||
                        "An error occurred while deleting the message.",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        messages,
        setMessages, 
        loading,
        error,
        getMessagesByChatId,
        getMessageById,
        postNewTextMessage,
        postNewFileMessage,
        putTextMessage,
        softDeleteMessage,
    };
};
