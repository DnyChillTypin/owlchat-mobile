import type { ChatType } from "./enum/chat-type";

export interface Chat {
  id: string;
  status: boolean;
  type: ChatType;
  name: string;
  avatar: string;
  initiatorId: string;
  newestMessageId: string;
  newestMessageDate: string; 
  createdDate: string; 
  updatedDate: string; 
}
export interface ChatMemberUpdateNicknameRequest {
  nickname: string;
}
export interface ChatMemberCreateUserRequest {
  memberId: string;
  chatId: string;
}
export interface ChatUserRequest {
  name: string;
  chatMembersId: string[];
}
export interface ChatMemberUpdateRoleRequest {
  role: string;
}
export interface ChatUpdateNameRequest {
  name: string;
}