import type { FriendRequestStatus } from "./enum/friend-request-status";
export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdDate: string; 
  updatedDate: string; 
}
export interface FriendRequestCreateRequest {
  senderId: string;
  receiverId: string;
}
export interface FriendRequestCreateUserRequest {
  receiverId: string;
}
export interface FriendRequestResponseRequest {
  response: string;
}